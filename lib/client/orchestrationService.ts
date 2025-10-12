import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from 'openai';
import type { FilterState, GeneratedItem, Category, MidjourneyParameters, GptParameters, GeminiParameters, PromptGenerationResult } from '../../types';
import { buildGenerationPrompt, buildResponseSchema } from '../promptBuilder';
import type { ApiKeys } from '../../App';
import * as ALL_CONSTANTS from '../../constants';
import { BREATHING_STYLES_DATA } from '../breathingStylesData';
import { WEAPON_TYPES } from '../weaponData';

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
        if (Array.isArray(value)) {
            if (value.includes('Aleatória') || value.includes('Aleatório')) {
                 const optionsArray = KEY_TO_RANDOM_MAP[filterKey];
                 if(optionsArray) (resolved as any)[filterKey] = [pickRandom(optionsArray)];
            }
        } else if (value === 'Aleatória' || value === 'Aleatório') {
            const optionsArray = KEY_TO_RANDOM_MAP[filterKey];
            if (optionsArray) (resolved as any)[filterKey] = pickRandom(optionsArray);
        }
    }
    return resolved;
};

// #region Client-side AI Calls

const callDeepSeekClient = async (messages: any[], apiKey: string): Promise<any> => {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: 'deepseek-chat', messages, temperature: 0.7, stream: false }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Erro na API do DeepSeek: ${response.statusText}`);
    }
    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    if (!content) throw new Error('A resposta da API do DeepSeek estava vazia.');
    return safeJsonParse(content);
};

// #endregion

// Main orchestration function moved to client
export const orchestrateGeneration = async (filters: FilterState, apiKeys: ApiKeys, promptModifier?: string): Promise<GeneratedItem> => {
    const allProvenance: any[] = [];
    const resolvedFilters = resolveRandomFilters(filters);

    // Step 1: DeepSeek
    let baseConcept = {};
    try {
        const prompt = `Você é uma IA de brainstorming para RPG. Sua tarefa é gerar uma ideia conceitual bruta para um item da categoria "${resolvedFilters.category}" no universo de Demon Slayer. Forneça apenas os conceitos-chave em um objeto JSON com as chaves: "nome", "descricao_curta", "tematica", e "raridade". ${promptModifier ? `Instrução adicional: ${promptModifier}`: ''}`;
        baseConcept = await callDeepSeekClient([
            { role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' },
            { role: 'user', content: prompt }
        ], apiKeys.deepseek);
        allProvenance.push({ step: '1/3 - Base Concept', model: 'DeepSeek', status: 'success' });
    } catch (error) {
        console.error("Error in Step 1 (DeepSeek):", error);
        allProvenance.push({ step: '1/3 - Base Concept', model: 'DeepSeek', status: 'failed' });
    }

    // Step 2: Gemini
    const geminiClient = new GoogleGenAI({ apiKey: apiKeys.gemini });
    let enrichedItem: GeneratedItem | null = null;
    try {
        const prompt = buildGenerationPrompt(resolvedFilters, 1, promptModifier, baseConcept);
        const schema = buildResponseSchema(resolvedFilters, 1);
        const geminiResult = await geminiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.85 },
        });
        enrichedItem = safeJsonParse(geminiResult.text);
        if (!enrichedItem) throw new Error("Resposta inválida do Gemini.");
        allProvenance.push({ step: '2/3 - Enrichment', model: 'Gemini', status: 'success' });
    } catch (error) {
        console.error("Error in Step 2 (Gemini):", error);
        allProvenance.push({ step: '2/3 - Enrichment', model: 'Gemini', status: 'failed' });
        throw new Error(`Falha na etapa do Gemini: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Step 3: OpenAI
    const openAiClient = new OpenAI({ apiKey: apiKeys.openai, dangerouslyAllowBrowser: true });
    let finalItem = enrichedItem;
    try {
        const itemForPolish = {
            nome: ('title' in finalItem && finalItem.title) || finalItem.nome,
            categoria: finalItem.categoria,
            descricao: finalItem.descricao,
            ganchos_narrativos: finalItem.ganchos_narrativos,
            imagePromptProto: finalItem.imagePromptDescription,
        };
        const prompt = `Você é um mestre de narrativa e um especialista em prompts visuais. Sua tarefa é fazer o polimento final no item a seguir.
        1.  **gameText**: Reescreva a 'descricao' e os 'ganchos_narrativos' para ter um tom de roleplay mais forte.
        2.  **imagePromptDescription**: Refine o 'imagePromptProto' em um prompt final e conciso para um gerador de imagens. Incorpore as seguintes referências de estilo: "${filters.styleReferences || 'nenhum'}".
        Retorne um objeto JSON com duas chaves: "gameText" e "imagePromptDescription".
        Item para polir: ${JSON.stringify(itemForPolish)}`;

        const response = await openAiClient.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: "json_object" },
            messages: [{ role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' }, { role: 'user', content: prompt }]
        });
        const polishedData = safeJsonParse(response.choices[0].message.content);
        if (polishedData && polishedData.gameText && polishedData.imagePromptDescription) {
            finalItem = { ...finalItem, descricao: polishedData.gameText, imagePromptDescription: polishedData.imagePromptDescription };
            allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'success' });
        } else {
             allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'skipped' });
        }
    } catch (error) {
        console.error("Error in Step 3 (OpenAI):", error);
        allProvenance.push({ step: '3/3 - Final Polish', model: 'OpenAI (GPT-4o)', status: 'failed' });
    }

    if (!(finalItem as any).categoria) (finalItem as any).categoria = resolvedFilters.category as Category;

    return { 
        ...finalItem, 
        provenance: allProvenance,
        id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
    };
};


// Client-side prompt generation
interface GeneratePromptsRequest {
    basePrompt: string;
    mjParams?: MidjourneyParameters;
    gptParams: GptParameters;
    geminiParams: GeminiParameters;
    generateMidjourney: boolean;
    generateGpt: boolean;
    generateGemini: boolean;
}

const buildMidjourneyPrompt = (base: string, params?: MidjourneyParameters): string => {
    if (!params) return base;
    let prompt = base;
    const activeParams = Object.entries(params).filter(([, p]) => p.active);
    const technicalParams = activeParams.filter(([key]) => !['artStyle', 'lighting', 'colorPalette', 'composition', 'detailLevel'].includes(key));
    if (technicalParams.length > 0) {
        prompt += ' ';
        technicalParams.forEach(([key, param]) => {
            const paramKey = key === 'aspectRatio' ? 'ar' : key === 'version' ? 'v' : key === 'style' ? 'style' : key === 'stylize' ? 's' : key === 'chaos' ? 'c' : key === 'quality' ? 'q' : 'w';
            if (paramKey === 'v' && param.value.toString().startsWith('Niji')) {
                 prompt += `--niji ${param.value.toString().split(' ')[1]} `;
            } else {
                 prompt += `--${paramKey} ${param.value} `;
            }
        });
    }
    return prompt.trim();
};


export const generatePrompts = async (request: GeneratePromptsRequest, apiKeys: ApiKeys): Promise<PromptGenerationResult> => {
    const geminiClient = new GoogleGenAI({ apiKey: apiKeys.gemini });
    const { basePrompt, mjParams, gptParams, geminiParams, generateMidjourney, generateGpt, generateGemini } = request;

    const requestedPrompts: string[] = [];
    if (generateMidjourney) requestedPrompts.push('"midjourneyPrompt"');
    if (generateGpt) requestedPrompts.push('"gptPrompt"');
    if (generateGemini) requestedPrompts.push('"geminiPrompt"');
    
    let systemPrompt = `Você é um especialista em engenharia de prompts para IAs generativas de imagem. Sua tarefa é expandir um prompt base do usuário em prompts otimizados para os modelos solicitados. O resultado deve ser um objeto JSON contendo APENAS as seguintes chaves: ${requestedPrompts.join(', ')}.\n\n`;
    let userPrompt = `**Prompt Base do Usuário:**\n"${basePrompt}"\n\n`;
    
    if (generateMidjourney) {
        systemPrompt += `Para "midjourneyPrompt":\n- Crie um prompt conciso e visual em INGLÊS. Use palavras-chave e frases curtas separadas por vírgulas.\n- Incorpore elementos de estilo como "cinematic lighting", "ultra detailed", "8k", "photorealistic".\n\n`;
        if (mjParams) {
            const descriptiveParams = [{ label: 'Estilo de Arte', param: mjParams.artStyle }, { label: 'Iluminação', param: mjParams.lighting }, { label: 'Paleta de Cores', param: mjParams.colorPalette }, { label: 'Composição', param: mjParams.composition }, { label: 'Nível de Detalhe', param: mjParams.detailLevel }].filter(({ param }) => param?.active);
            if (descriptiveParams.length > 0) {
                userPrompt += `**Parâmetros Descritivos (para Midjourney):**\n`;
                descriptiveParams.forEach(({ label, param }) => { if(param) userPrompt += `- ${label}: ${param.value}\n`; });
                userPrompt += '\n';
            }
        }
    }
    if (generateGpt) {
        systemPrompt += `Para "gptPrompt":\n- Crie um prompt narrativo e descritivo em INGLÊS com 2-3 frases detalhadas para DALL-E 3.\n\n`;
        userPrompt += `**Parâmetros Estruturados (para GPT/DALL-E):**\n- Tom/Atmosfera: ${gptParams.tone}\n- Estilo de Arte: ${gptParams.style}\n- Composição/Ângulo: ${gptParams.composition}\n\n`;
    }
    if (generateGemini) {
         systemPrompt += `Para "geminiPrompt":\n- Crie um prompt narrativo em PORTUGUÊS, otimizado para o Gemini.\n\n`;
        userPrompt += `**Parâmetros de Alquimia (para Gemini):**\n- Estilo de Arte: ${geminiParams.artStyle}\n- Iluminação: ${geminiParams.lighting}\n- Paleta de Cores: ${geminiParams.colorPalette}\n- Composição: ${geminiParams.composition}\n- Nível de Detalhe: ${geminiParams.detailLevel}\n`;
    }
    
    const response = await geminiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: { systemInstruction: systemPrompt, responseMimeType: "application/json" },
    });
    
    const content = response.text;
    if (!content) throw new Error('A resposta da IA estava vazia.');

    const generatedPrompts = JSON.parse(content) as Partial<PromptGenerationResult>;
    const result: PromptGenerationResult = {};
    
    if (generateMidjourney && generatedPrompts.midjourneyPrompt) {
        result.midjourneyPrompt = buildMidjourneyPrompt(generatedPrompts.midjourneyPrompt, mjParams);
    }
    if (generateGpt && generatedPrompts.gptPrompt) {
        result.gptPrompt = generatedPrompts.gptPrompt;
    }
    if (generateGemini && generatedPrompts.geminiPrompt) {
        result.geminiPrompt = generatedPrompts.geminiPrompt;
    }

    return result;
};