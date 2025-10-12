import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient as getGeminiClient } from '../../lib/gemini';
import { getOpenAiClient } from '../../lib/openai';
import { callDeepSeekAPI } from '../../lib/deepseek';
import type { FilterState, GeneratedItem, Category } from '../../types';
import { buildGenerationPrompt, buildResponseSchema } from '../../lib/promptBuilder';
import { Type } from '@google/genai';
import * as ALL_CONSTANTS from '../../constants';
import { BREATHING_STYLES_DATA } from '../../lib/breathingStylesData';
import { WEAPON_TYPES } from '../../lib/weaponData';

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

const pickRandom = (arr: readonly any[], exclude: any[] = ['Aleatória', 'Aleatório', 'Nenhuma', 'N/A', '']) => {
    const options = arr.filter(o => !exclude.includes(o));
    if (options.length === 0) {
        const fallbackOptions = arr.filter(o => ![''].includes(o));
        if (fallbackOptions.length > 0) return fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
        return arr[0] || '';
    }
    return options[Math.floor(Math.random() * options.length)];
};

const breathingStylesOptions = BREATHING_STYLES_DATA.map(bs => bs.nome);
const weaponTypeOptions = WEAPON_TYPES.map(w => w.name);

const KEY_TO_RANDOM_MAP: { [key in keyof FilterState]?: readonly any[] } = {
    weaponRarity: ALL_CONSTANTS.RARITIES,
    weaponTematica: ALL_CONSTANTS.TEMATICAS,
    weaponCountry: ALL_CONSTANTS.COUNTRIES,
    weaponType: weaponTypeOptions,
    weaponMetalColor: ALL_CONSTANTS.METAL_COLORS,
    accessoryRarity: ALL_CONSTANTS.RARITIES,
    accessoryTematica: ALL_CONSTANTS.TEMATICAS,
    accessoryOrigin: ALL_CONSTANTS.ORIGINS,
    accessoryCountry: ALL_CONSTANTS.COUNTRIES,
};


const resolveRandomFilters = (filters: FilterState): FilterState => {
    const resolved = { ...filters };

    for (const key in resolved) {
        const filterKey = key as keyof FilterState;
        let value = resolved[filterKey];
        
        // Handle both single string and array for multi-selects
        if (Array.isArray(value)) {
            if (value.includes('Aleatória') || value.includes('Aleatório')) {
                 const optionsArray = KEY_TO_RANDOM_MAP[filterKey];
                 if(optionsArray) {
                    (resolved as any)[filterKey] = [pickRandom(optionsArray)];
                 }
            }
        } else if (value === 'Aleatória' || value === 'Aleatório') {
            const optionsArray = KEY_TO_RANDOM_MAP[filterKey];
            if (optionsArray) {
                (resolved as any)[filterKey] = pickRandom(optionsArray);
            }
        }
    }
    return resolved;
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
            imagePromptProto: item.imagePromptDescription, // Gemini creates this now
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
            // Merge the polished text back into the item
            const finalItem = { 
                ...item, 
                descricao: polishedData.gameText, // 'descricao' is our gameText
                imagePromptDescription: polishedData.imagePromptDescription,
            };
            // Ensure narrative hooks are preserved if not part of the polish
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
    
    const resolvedFilters = resolveRandomFilters(filters);

    const generationPromises = Array.from({ length: count }).map(async () => {
        const allProvenance: Provenance[] = [];

        // Step 1: DeepSeek
        const { baseConcept, provenance: p1 } = await step1_generateBaseWithDeepSeek(resolvedFilters, promptModifier);
        allProvenance.push(p1);

        // Step 2: Gemini
        const { enrichedItem, provenance: p2 } = await step2_refineWithGemini(baseConcept, resolvedFilters, promptModifier);
        allProvenance.push(p2);
        
        if (!enrichedItem) {
            throw new Error("Falha na etapa crítica de enriquecimento com Gemini. Não é possível continuar.");
        }

        // Step 3: OpenAI
        const { finalItem, provenance: p3 } = await step3_finalizeWithOpenAI(enrichedItem, resolvedFilters);
        allProvenance.push(p3);
        
        // Ensure the final item has the correct category from the resolved filters.
        // The type system assumes `categoria` always exists, making `!finalItem.categoria`
        // seem impossible and causing a build error. We cast to `any` to perform this
        // runtime safeguard against potentially incomplete AI responses.
        if (!(finalItem as any).categoria) {
            (finalItem as any).categoria = resolvedFilters.category as Category;
        }

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