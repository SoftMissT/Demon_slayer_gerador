import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient as getGeminiClient } from '../../lib/gemini';
import { getOpenAiClient } from '../../lib/openai';
import { callDeepSeekAPI } from '../../lib/deepseek';
import type { FilterState, GeneratedItem } from '../../types';
import { buildGenerationPrompt, buildResponseSchema } from '../../lib/promptBuilder';
import { Type } from '@google/genai';

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
const step1_generateBaseWithDeepSeek = async (filters: FilterState, promptModifier?: string): Promise<{ baseConcept: any, provenance: Provenance }> => {
    const provenance: Provenance = { step: '1/3 - Base Concept', model: 'DeepSeek', status: 'skipped' };
    if (!process.env.DEEPSEEK_API_KEY) {
        console.warn("DeepSeek API key not found, skipping base concept generation.");
        return { baseConcept: {}, provenance };
    }

    try {
        const prompt = `Você é uma IA de brainstorming para RPG. Sua tarefa é gerar uma ideia conceitual bruta para um item da categoria "${filters.category}" no universo de Demon Slayer. Forneça apenas os conceitos-chave em um objeto JSON com as chaves: "nome", "descricao_curta", "tematica", e "raridade". ${promptModifier ? `Instrução adicional: ${promptModifier}`: ''}`;

        const baseConcept = await callDeepSeekAPI([
            { role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' },
            { role: 'user', content: prompt }
        ]);

        if (baseConcept && typeof baseConcept === 'object') {
            provenance.status = 'success';
            return { baseConcept, provenance };
        }
        throw new Error("Resposta inválida do DeepSeek.");
    } catch (error) {
        console.error("Error in Step 1 (DeepSeek):", error);
        provenance.status = 'failed';
        return { baseConcept: {}, provenance }; // Return empty object on failure to allow pipeline to continue
    }
};


// Step 2: Enrich and structure the concept with Gemini
const step2_refineWithGemini = async (baseConcept: any, filters: FilterState, promptModifier?: string): Promise<{ enrichedItem: GeneratedItem | null, provenance: Provenance }> => {
    const provenance: Provenance = { step: '2/3 - Enrichment', model: 'Gemini', status: 'skipped' };
    const geminiClient = getGeminiClient();
    if (!geminiClient) {
        provenance.status = 'failed';
        return { enrichedItem: null, provenance };
    }

    try {
        const prompt = buildGenerationPrompt(filters, 1, promptModifier, baseConcept);
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

        const enrichedItem = safeJsonParse(geminiResult.text);
        if (enrichedItem) {
            provenance.status = 'success';
            return { enrichedItem, provenance };
        }
        throw new Error("Resposta inválida do Gemini.");
    } catch (error) {
        console.error("Error in Step 2 (Gemini):", error);
        provenance.status = 'failed';
        return { enrichedItem: null, provenance };
    }
};

// Step 3: Finalize and polish with OpenAI
const step3_finalizeWithOpenAI = async (item: GeneratedItem): Promise<{ finalItem: GeneratedItem, provenance: Provenance }> => {
    const provenance: Provenance = { step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped' };
    const openAiClient = getOpenAiClient();
    if (!openAiClient) {
        return { finalItem: item, provenance };
    }
    
    try {
        const polishableFields = {
            nome: ('title' in item && item.title) || item.nome,
            descricao_curta: item.descricao_curta,
            descricao: item.descricao,
            ganchos_narrativos: item.ganchos_narrativos,
        };

        const prompt = `Você é um mestre de RPG e escritor criativo. Sua tarefa é fazer o polimento final no item a seguir, que já foi estruturado por outras IAs. Melhore a narrativa, a clareza e o impacto, tornando as descrições mais vívidas e os ganchos narrativos mais intrigantes. Retorne um objeto JSON APENAS com as chaves que você aprimorou: "nome", "descricao_curta", "descricao", "ganchos_narrativos".\n\nItem para polir:\n${JSON.stringify(polishableFields)}`;

        const response = await openAiClient.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: "json_object" },
            messages: [
                { role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' },
                { role: 'user', content: prompt }
            ]
        });

        const polishedData = safeJsonParse(response.choices[0].message.content);
        if (polishedData) {
            provenance.status = 'success';
            return { finalItem: { ...item, ...polishedData }, provenance };
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

        // Step 1: DeepSeek
        const { baseConcept, provenance: p1 } = await step1_generateBaseWithDeepSeek(filters, promptModifier);
        allProvenance.push(p1);

        // Step 2: Gemini
        const { enrichedItem, provenance: p2 } = await step2_refineWithGemini(baseConcept, filters, promptModifier);
        allProvenance.push(p2);
        
        if (!enrichedItem) {
            throw new Error("Falha na etapa crítica de enriquecimento com Gemini. Não é possível continuar.");
        }

        // Step 3: OpenAI
        const { finalItem, provenance: p3 } = await step3_finalizeWithOpenAI(enrichedItem);
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