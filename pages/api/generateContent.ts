import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from 'openai';
import { getAiClient } from '../../lib/gemini';
import { getOpenAiClient } from '../../lib/openai';
import { callDeepSeekAPI } from '../../lib/deepseek';
import { buildGenerationPrompt, buildResponseSchema } from '../../lib/promptBuilder';
import type { FilterState, GeneratedItem, Category } from '../../types';

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

    const { filters, promptModifier } = req.body as { filters: FilterState, promptModifier?: string };
    
    if (!filters || !filters.category) {
        return res.status(400).json({ message: 'A categoria é obrigatória nos filtros.' });
    }
    
    const allProvenance: any[] = [];

    try {
        // Step 1: DeepSeek for base concept
        let baseConcept = {};
        try {
            const prompt = `Você é uma IA de brainstorming para RPG. Sua tarefa é gerar uma ideia conceitual bruta para um item da categoria "${filters.category}" no universo de Demon Slayer. Forneça apenas os conceitos-chave em um objeto JSON com as chaves: "nome", "descricao_curta", "tematica", e "raridade". ${promptModifier ? `Instrução adicional: ${promptModifier}`: ''}`;
            baseConcept = await callDeepSeekAPI([
                { role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' },
                { role: 'user', content: prompt }
            ]);
            allProvenance.push({ step: '1/3 - Base Concept', model: 'DeepSeek', status: 'success' });
        } catch (error: any) {
            console.error("Error in Step 1 (DeepSeek):", error);
            allProvenance.push({ step: '1/3 - Base Concept', model: 'DeepSeek', status: 'failed', error: error.message });
            // Continue even if this step fails, Gemini can work without it.
        }

        // Step 2: Gemini for enrichment
        const geminiClient = getAiClient();
        if (!geminiClient) {
            return res.status(500).json({ message: 'Cliente Gemini não inicializado. Verifique a chave de API.' });
        }
        let enrichedItem: GeneratedItem | null = null;
        try {
            const geminiPrompt = buildGenerationPrompt(filters, 1, promptModifier, baseConcept);
            const schema = buildResponseSchema(filters, 1);
            const geminiResult = await geminiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: geminiPrompt,
                config: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.85 },
            });
            enrichedItem = safeJsonParse(geminiResult.text);
            if (!enrichedItem) throw new Error("A resposta do Gemini foi inválida ou nula.");
            allProvenance.push({ step: '2/3 - Enrichment', model: 'Gemini', status: 'success' });
        } catch (error: any) {
            console.error("Error in Step 2 (Gemini):", error);
            allProvenance.push({ step: '2/3 - Enrichment', model: 'Gemini', status: 'failed', error: error.message });
            return res.status(500).json({ message: `Falha na etapa do Gemini: ${error.message}` });
        }

        // Step 3: OpenAI for final polish
        let finalItem = enrichedItem;
        try {
            const openAiClient = getOpenAiClient();
            if (openAiClient) {
                const itemForPolish = {
                    nome: ('title' in finalItem && finalItem.title) || finalItem.nome,
                    categoria: finalItem.categoria,
                    descricao: finalItem.descricao,
                    ganchos_narrativos: finalItem.ganchos_narrativos,
                    imagePromptProto: finalItem.imagePromptDescription,
                };
                const polishPrompt = `Você é um mestre de narrativa e um especialista em prompts visuais. Sua tarefa é fazer o polimento final no item a seguir.
                1.  **gameText**: Reescreva a 'descricao' e os 'ganchos_narrativos' para ter um tom de roleplay mais forte.
                2.  **imagePromptDescription**: Refine o 'imagePromptProto' em um prompt final e conciso para um gerador de imagens. Incorpore as seguintes referências de estilo: "${filters.styleReferences || 'nenhum'}".
                Retorne um objeto JSON com duas chaves: "gameText" e "imagePromptDescription".
                Item para polir: ${JSON.stringify(itemForPolish)}`;
                
                const response = await openAiClient.chat.completions.create({
                    model: 'gpt-4o',
                    response_format: { type: "json_object" },
                    messages: [{ role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' }, { role: 'user', content: polishPrompt }]
                });
                const polishedData = safeJsonParse(response.choices[0].message.content);

                if (polishedData && polishedData.gameText && polishedData.imagePromptDescription) {
                    finalItem = { ...finalItem, descricao: polishedData.gameText, imagePromptDescription: polishedData.imagePromptDescription };
                    allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'success' });
                } else {
                    allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped', reason: 'Invalid data' });
                }
            } else {
                 allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped', reason: 'Client not configured' });
            }
        } catch (error: any) {
            console.error("Error in Step 3 (OpenAI):", error);
            allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'failed', error: error.message });
            // Don't fail the whole request, just return the Gemini result
        }
        
        if (!(finalItem as any).categoria) (finalItem as any).categoria = filters.category as Category;

        const result: GeneratedItem = { 
            ...finalItem, 
            provenance: allProvenance,
            id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
        };

        res.status(200).json(result);

    } catch (error: any) {
        console.error("Erro na orquestração da API:", error);
        res.status(500).json({ message: error.message || 'Um erro inesperado ocorreu no servidor.' });
    }
}
