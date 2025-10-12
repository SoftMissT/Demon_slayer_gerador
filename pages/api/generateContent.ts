import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient as getGeminiClient } from '../../lib/gemini';
import { getOpenAiClient } from '../../lib/openai';
import { callDeepSeekAPI } from '../../lib/deepseek';
import type { FilterState, GeneratedItem } from '../../types';
import { buildGenerationPrompt, buildResponseSchema } from '../../lib/promptBuilder';

// Helper to safely parse JSON from AI responses, handling markdown code blocks
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

type Provenance = { step: string; model: string; status: 'success' | 'skipped' | 'failed' };

// #region Orchestration Steps

// Step 1: Generate a base concept with DeepSeek
const step1_generateBaseConceptWithDeepSeek = async (filters: FilterState, promptModifier?: string): Promise<{ baseConcept: string | null, provenance: Provenance }> => {
    const provenance: Provenance = { step: '1/3 - Conception', model: 'DeepSeek', status: 'skipped' };
    try {
        // FIX: The FilterState type does not have a generic 'tematica' property. This has been corrected to check all category-specific 'tematica' fields to find the active one.
        const tematica = filters.hunterTematica ||
            filters.oniTematica ||
            filters.npcTematica ||
            filters.weaponTematica ||
            filters.accessoryTematica ||
            filters.breathingFormTematica ||
            filters.kekkijutsuTematica ||
            filters.locationTematica ||
            filters.missionTematica ||
            filters.wbTematica ||
            filters.eventTematica ||
            'Qualquer';
        
        const prompt = `Gere um conceito base para um item de RPG de mesa com o tema "Demon Slayer".
        Categoria: ${filters.category}
        Temática: ${tematica}
        ${promptModifier ? `Modificador: ${promptModifier}` : ''}
        Retorne apenas uma frase concisa.`;
        
        const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
        // DeepSeek API returns content directly, not nested in JSON
        const concept = response.choices[0]?.message?.content?.trim();

        if (concept) {
            provenance.status = 'success';
            return { baseConcept: concept, provenance };
        }
        throw new Error("Resposta do DeepSeek estava vazia.");
    } catch (error) {
        console.error("Error in Step 1 (DeepSeek):", error);
        provenance.status = 'failed';
        return { baseConcept: null, provenance };
    }
};


// Step 2: Enrich and structure the concept with Gemini
const step2_enrichWithGemini = async (baseConcept: string, filters: FilterState, promptModifier?: string): Promise<{ generatedItem: GeneratedItem | null, provenance: Provenance }> => {
    const provenance: Provenance = { step: '2/3 - Enrichment', model: 'Gemini', status: 'skipped' };
    const geminiClient = getGeminiClient();
    if (!geminiClient) {
        provenance.status = 'failed';
        return { generatedItem: null, provenance };
    }

    try {
        const prompt = buildGenerationPrompt(baseConcept, filters, 1, promptModifier);
        const schema = buildResponseSchema(filters, 1);
        
        const geminiResult = await geminiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.85,
            },
        });

        const generatedItem = safeJsonParse(geminiResult.text);
        if (generatedItem) {
            provenance.status = 'success';
            return { generatedItem, provenance };
        }
        throw new Error("Resposta inválida do Gemini.");
    } catch (error) {
        console.error("Error in Step 2 (Gemini):", error);
        provenance.status = 'failed';
        return { generatedItem: null, provenance };
    }
};

// Step 3: Finalize and polish with OpenAI
const step3_finalizeWithOpenAI = async (item: GeneratedItem, filters: FilterState): Promise<{ finalItem: GeneratedItem, provenance: Provenance }> => {
    const provenance: Provenance = { step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped' };
    const openAiClient = getOpenAiClient();
    if (!openAiClient) {
        return { finalItem: item, provenance };
    }
    
    try {
        const itemForPolish = {
            nome: ('title' in item && item.title) || item.nome,
            categoria: item.categoria,
            descricao: item.descricao,
            ganchos_narrativos: item.ganchos_narrativos,
            imagePromptProto: item.imagePromptDescription,
        };

        const prompt = `Você é um mestre de narrativa e um especialista em prompts visuais. Sua tarefa é fazer o polimento final no item a seguir.
        1.  **gameText**: Reescreva a 'descricao' e os 'ganchos_narrativos' para ter um tom de roleplay mais forte. Descreva posições, sons, sensações e a sequência de golpes para técnicas.
        2.  **imagePromptDescription**: Refine o 'imagePromptProto' em um prompt final e conciso para um gerador de imagens. Incorpore as seguintes referências de estilo: "${filters.styleReferences || 'nenhum'}". O resultado deve ser uma frase curta com tags (ex: "close-up, dramatic lighting, anime style, cinematic, --ar 3:4").

        Retorne um objeto JSON com duas chaves: "gameText" (a descrição de RPG aprimorada) e "imagePromptDescription" (o prompt de imagem final).

        Item para polir:
        ${JSON.stringify(itemForPolish)}`;

        const response = await openAiClient.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: "json_object" },
            messages: [
                { role: 'system', content: 'You are a helpful assistant designed to output valid JSON with the keys "gameText" and "imagePromptDescription".' },
                { role: 'user', content: prompt }
            ]
        });

        const polishedData = safeJsonParse(response.choices[0].message.content);
        if (polishedData && polishedData.gameText && polishedData.imagePromptDescription) {
            provenance.status = 'success';
            const finalItem = { 
                ...item, 
                descricao: polishedData.gameText,
                imagePromptDescription: polishedData.imagePromptDescription,
            };
            if (!polishedData.gameText.includes("Ganchos")) {
                 finalItem.descricao += `\n\n**Ganchos Narrativos:**\n${Array.isArray(item.ganchos_narrativos) ? item.ganchos_narrativos.map(h => `- ${h}`).join('\n') : item.ganchos_narrativos || ''}`;
            }
            return { finalItem, provenance };
        }
        return { finalItem: item, provenance };
    } catch (error) {
        console.error("Error in Step 3 (OpenAI):", error);
        provenance.status = 'failed';
        return { finalItem: item, provenance };
    }
};

// #endregion

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ items?: GeneratedItem[]; message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { filters, count = 1, promptModifier } = req.body as { filters: FilterState, count: number, promptModifier?: string };

    if (!filters || !filters.category) {
      return res.status(400).json({ message: 'Filtros inválidos ou categoria ausente.' });
    }

    const generationPromises = Array.from({ length: count }).map(async () => {
        const allProvenance: Provenance[] = [];

        // Step 1: DeepSeek (with fallback)
        const { baseConcept, provenance: p1 } = await step1_generateBaseConceptWithDeepSeek(filters, promptModifier);
        allProvenance.push(p1);
        
        const conceptForGemini = baseConcept || `Um(a) ${filters.category} gerado(a) do zero com base nos filtros fornecidos.`;

        // Step 2: Gemini
        const { generatedItem, provenance: p2 } = await step2_enrichWithGemini(conceptForGemini, filters, promptModifier);
        allProvenance.push(p2);
        
        if (!generatedItem) {
            throw new Error("Falha na etapa crítica de enriquecimento com Gemini. Não é possível continuar.");
        }

        // Step 3: OpenAI
        const { finalItem, provenance: p3 } = await step3_finalizeWithOpenAI(generatedItem, filters);
        allProvenance.push(p3);
        
        return { ...finalItem, provenance: allProvenance };
    });

    const results = await Promise.all(generationPromises);

    const processedItems = results.map((item: any) => ({
        ...item,
        id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
    }));

    res.status(200).json({ items: processedItems, message: 'Conteúdo gerado com sucesso!' });

  } catch (error: any) {
    console.error("Erro em /api/generateContent:", error);
    res.status(500).json({ message: `Falha ao gerar conteúdo. Detalhes: ${error.message}` });
  }
}
