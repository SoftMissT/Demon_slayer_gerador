import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from 'openai';
import { getAiClient } from '../../lib/gemini';
import { getOpenAiClient } from '../../lib/openai';
import { callDeepSeekAPI } from '../../lib/deepseek';
import { buildGenerationPrompt, buildResponseSchema } from '../../lib/promptBuilder';
import type { FilterState, GeneratedItem, Category, User, AIFlags } from '../../types';

// Helper to safely parse JSON from AI responses
const safeJsonParse = (jsonString: string | null | undefined): any | null => {
    if (!jsonString) return null;
    try {
        const match = jsonString.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        if (match && (match[1] || match[2])) {
            return JSON.parse(match[1] || match[2]);
        }
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("JSON parsing failed for string:", jsonString);
        return null;
    }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratedItem | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { filters, promptModifier, user, aiFlags } = req.body as { filters: FilterState, promptModifier?: string, user?: User, aiFlags: AIFlags };
    
    if (!filters || !filters.category) {
        return res.status(400).json({ message: 'A categoria é obrigatória nos filtros.' });
    }

    if (!aiFlags.useDeepSeek && !aiFlags.useGemini && !aiFlags.useGpt) {
        return res.status(400).json({ message: 'Pelo menos um modelo de IA deve ser selecionado para a geração.' });
    }
    
    const allProvenance: any[] = [];
    let accumulatedData: Partial<GeneratedItem> = {};

    try {
        // Step 1: DeepSeek for base concept (optional)
        if (aiFlags.useDeepSeek) {
            try {
                const prompt = `Você é uma IA de brainstorming para RPG. Sua tarefa é gerar uma ideia conceitual bruta para um item da categoria "${filters.category}" no universo de Demon Slayer. Forneça apenas os conceitos-chave em um objeto JSON com as chaves: "nome", "descricao_curta", "tematica", e "raridade". ${promptModifier ? `Instrução adicional: ${promptModifier}`: ''}`;
                const baseConcept = await callDeepSeekAPI([
                    { role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' },
                    { role: 'user', content: prompt }
                ]);
                accumulatedData = { ...accumulatedData, ...baseConcept };
                allProvenance.push({ step: '1/3 - Base Concept', model: 'DeepSeek', status: 'success' });
            } catch (error: any) {
                console.error("Error in Step 1 (DeepSeek):", error);
                allProvenance.push({ step: '1/3 - Base Concept', model: 'DeepSeek', status: 'failed', error: error.message });
            }
        } else {
             allProvenance.push({ step: '1/3 - Base Concept', model: 'DeepSeek', status: 'skipped' });
        }


        // Step 2: Gemini for enrichment (can be optional, but core)
        if (aiFlags.useGemini) {
            const geminiClient = getAiClient();
            if (!geminiClient) {
                return res.status(500).json({ message: 'A chave de API do Gemini não está configurada corretamente no servidor. A geração falhou.' });
            }
            try {
                const geminiPrompt = buildGenerationPrompt(filters, 1, promptModifier, accumulatedData);
                const schema = buildResponseSchema(filters, 1);
                const geminiResult = await geminiClient.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: geminiPrompt,
                    config: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.85 },
                });
                const enrichedItem = safeJsonParse(geminiResult.text);
                if (!enrichedItem) throw new Error("A resposta do Gemini foi inválida ou nula.");
                accumulatedData = { ...accumulatedData, ...enrichedItem };
                allProvenance.push({ step: '2/3 - Enrichment', model: 'Gemini', status: 'success' });
            } catch (error: any) {
                console.error("Error in Step 2 (Gemini):", error);
                allProvenance.push({ step: '2/3 - Enrichment', model: 'Gemini', status: 'failed', error: error.message });
                return res.status(500).json({ message: `Falha na etapa do Gemini: ${error.message}` });
            }
        } else {
            allProvenance.push({ step: '2/3 - Enrichment', model: 'Gemini', status: 'skipped' });
        }


        // Step 3: OpenAI for final polish (optional)
        if (aiFlags.useGpt) {
            if (!accumulatedData.nome || !accumulatedData.descricao) {
                allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped', reason: 'No base content generated in previous steps.' });
            } else {
                try {
                    const openAiClient = getOpenAiClient();
                    if (openAiClient) {
                        const itemForPolish = {
                            nome: ('title' in accumulatedData && accumulatedData.title) || accumulatedData.nome,
                            categoria: accumulatedData.categoria,
                            descricao: accumulatedData.descricao,
                            ganchos_narrativos: accumulatedData.ganchos_narrativos,
                            imagePromptProto: accumulatedData.imagePromptDescription,
                        };
                        const polishPrompt = `Você é um mestre de narrativa e um especialista em prompts visuais. Sua tarefa é fazer o polimento final no item a seguir.
1.  **descricao**: Reescreva a 'descricao' para ter um tom de roleplay mais forte, mais imersivo e poético.
2.  **ganchos_narrativos**: Reescreva os 'ganchos_narrativos' para serem mais intrigantes e convidativos à aventura. Mantenha o formato de array de strings.
3.  **imagePromptDescription**: Refine o 'imagePromptProto' em um prompt final e conciso para um gerador de imagens. Incorpore as seguintes referências de estilo: "${filters.styleReferences || 'nenhum'}".
Retorne um objeto JSON com três chaves: "descricao", "ganchos_narrativos", e "imagePromptDescription".
Item para polir: ${JSON.stringify(itemForPolish)}`;
                        
                        const response = await openAiClient.chat.completions.create({
                            model: 'gpt-4o',
                            response_format: { type: "json_object" },
                            messages: [{ role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' }, { role: 'user', content: polishPrompt }]
                        });
                        const polishedData = safeJsonParse(response.choices[0].message.content);

                        if (polishedData && polishedData.descricao && polishedData.ganchos_narrativos && polishedData.imagePromptDescription) {
                            accumulatedData = { 
                                ...accumulatedData, 
                                descricao: polishedData.descricao,
                                ganchos_narrativos: polishedData.ganchos_narrativos,
                                imagePromptDescription: polishedData.imagePromptDescription 
                            };
                            allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'success' });
                        } else {
                            allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped', reason: 'Invalid or incomplete data from GPT.' });
                        }
                    } else {
                        allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped', reason: 'Client not configured' });
                    }
                } catch (error: any) {
                    console.error("Error in Step 3 (OpenAI):", error);
                    allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'failed', error: error.message });
                }
            }
        } else {
            allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped' });
        }
        
        if (!accumulatedData.categoria) accumulatedData.categoria = filters.category as Category;
        if (!accumulatedData.id) accumulatedData.id = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        if (!accumulatedData.createdAt) accumulatedData.createdAt = new Date().toISOString();

        const result: GeneratedItem = { 
            ...accumulatedData, 
            provenance: allProvenance,
        } as GeneratedItem;

        res.status(200).json(result);

    } catch (error: any) {
        console.error("Erro na orquestração da API:", error);
        res.status(500).json({ message: error.message || 'Um erro inesperado ocorreu no servidor.' });
    }
}