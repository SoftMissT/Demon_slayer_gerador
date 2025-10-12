import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient as getGeminiClient } from '../../lib/gemini';
import { getOpenAiClient } from '../../lib/openai';
import { getOpenRouterClient } from '../../lib/openrouter';
import { callDeepSeekAPI } from '../../lib/deepseek';
import type { FilterState, GeneratedItem } from '../../types';
import { buildGenerationPrompt, buildResponseSchema } from '../../lib/promptBuilder';

// Helper function to safely parse JSON from AI responses
const safeJsonParse = (jsonString: string | null | undefined) => {
    if (!jsonString) return null;
    try {
        // Find JSON within markdown code blocks if they exist
        const match = jsonString.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        if (match && (match[1] || match[2])) {
            return JSON.parse(match[1] || match[2]);
        }
        return JSON.parse(jsonString); // Fallback for raw JSON
    } catch (error) {
        console.error("JSON parsing failed for string:", jsonString);
        return null;
    }
};

// Step 2: Polish narrative with GPT or OpenRouter
const polishNarrativeWithGPT = async (item: GeneratedItem, focus: string): Promise<GeneratedItem> => {
    const narrativeClient = getOpenRouterClient() || getOpenAiClient();
    
    if (!narrativeClient) {
        console.warn("No narrative client (OpenAI or OpenRouter) is available, skipping narrative polish.");
        return item;
    }

    const isUsingOpenRouter = !!getOpenRouterClient();
    // The user mentioned "GPT 5". We will use a powerful model available on OpenRouter, like 'openai/gpt-4o'.
    // If falling back to OpenAI, use 'gpt-4o-mini'.
    const model = isUsingOpenRouter ? 'openai/gpt-4o' : 'gpt-4o-mini';

    try {
        const narrativeFields = {
            nome: ('title' in item && item.title) || item.nome,
            descricao_curta: item.descricao_curta,
            descricao: item.descricao,
            ganchos_narrativos: item.ganchos_narrativos,
        };

        const gptPrompt = `Você é um escritor criativo e autor de módulos de RPG, especializado no universo de Demon Slayer. Sua tarefa é aprimorar o conteúdo a seguir com um foco especial em "${focus}". Reescreva as descrições e os ganchos narrativos para serem mais evocativos, detalhados e envolventes, mantendo os conceitos originais. Retorne um objeto JSON com quatro chaves: "nome", "descricao_curta", "descricao", "ganchos_narrativos". Responda apenas com o objeto JSON.\n\nConteúdo para aprimorar:\n${JSON.stringify(narrativeFields)}`;
        
        const gptResponse = await narrativeClient.chat.completions.create({
            model: model,
            response_format: { type: "json_object" },
            messages: [
                { role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' },
                { role: 'user', content: gptPrompt }
            ]
        });

        const polishedNarrative = safeJsonParse(gptResponse.choices[0].message.content);

        if (polishedNarrative) {
            return {
                ...item,
                nome: polishedNarrative.nome || item.nome,
                descricao_curta: polishedNarrative.descricao_curta || item.descricao_curta,
                descricao: polishedNarrative.descricao || item.descricao,
                ganchos_narrativos: polishedNarrative.ganchos_narrativos || item.ganchos_narrativos,
            };
        }
    } catch (error) {
        console.error(`Error polishing narrative with ${isUsingOpenRouter ? 'OpenRouter' : 'GPT'}:`, error);
    }
    return item; // Return original item on failure
};


// Step 3: Refine mechanics with DeepSeek
const refineMechanicsWithDeepSeek = async (item: GeneratedItem, focus: string): Promise<GeneratedItem> => {
    if (!process.env.DEEPSEEK_API_KEY) {
        console.warn("DeepSeek API key not found, skipping mechanics refinement.");
        return item;
    }

    try {
        const mechanicalFields: Partial<GeneratedItem> = {};
        // FIX: Changed type from `(keyof GeneratedItem)[]` to `(keyof any)[]` to resolve type errors.
        // `keyof GeneratedItem` resolves to the intersection of keys across all union members, which
        // is too restrictive and does not include specific mechanical fields.
        const mechanicalKeys: (keyof any)[] = ['dano', 'dados', 'tipo_de_dano', 'status_aplicado', 'efeitos_secundarios', 'kekkijutsu', 'habilidades_especiais', 'arsenal', 'requirements', 'mechanics', 'level_scaling', 'fraquezas_unicas', 'trofeus_loot'];
        
        mechanicalKeys.forEach(key => {
            if (key in item) {
                (mechanicalFields as any)[key] = (item as any)[key];
            }
        });

        if (Object.keys(mechanicalFields).length === 0) {
            return item; // No mechanical fields to refine for this item type
        }

        const deepSeekPrompt = `Você é um game designer especialista em balanceamento de TTRPGs. Seus parceiros de IA, Gemini e GPT, criaram um item com uma narrativa já polida. Sua tarefa é refinar APENAS os campos de mecânica de jogo para torná-los mais interessantes, balanceados e criativos, com um foco especial em "${focus}". Não altere a narrativa. Retorne APENAS um objeto JSON contendo os campos de mecânica de jogo que você refinou.

Mecânicas para refinar:
${JSON.stringify(mechanicalFields, null, 2)}

Analise e melhore os valores, e então retorne apenas o JSON com os campos atualizados.`;

        const refinedMechanics = await callDeepSeekAPI([
            { role: 'system', content: 'You are a helpful assistant designed to output valid JSON.' },
            { role: 'user', content: deepSeekPrompt }
        ]);

        if (refinedMechanics) {
            return { ...item, ...refinedMechanics };
        }
    } catch (error) {
        console.error("Error refining mechanics with DeepSeek:", error);
    }
    return item; // Return GPT-polished item if DeepSeek refinement fails
};


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

    // Step 1: Generate base structure with Gemini
    const geminiClient = getGeminiClient();
    if (!geminiClient) {
        return res.status(500).json({ message: 'Erro de configuração do servidor: a API Key do Google Gemini não foi encontrada.' });
    }
    
    const prompt = buildGenerationPrompt(filters, count, promptModifier);
    const schema = buildResponseSchema(filters, count);
    
    const geminiResult = await geminiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.85,
        },
    });

    const geminiData = safeJsonParse(geminiResult.text);
    if (!geminiData) {
      throw new Error("A resposta da IA (Gemini) estava vazia ou em formato inválido.");
    }

    let items: GeneratedItem[] = count > 1 ? geminiData.items : [geminiData]; 
    if (!Array.isArray(items)) {
        throw new Error("A resposta da IA (Gemini) não continha um array de um array de itens válido.");
    }
    
    // Step 2 & 3: Polish and refine each item in sequence
    const enhancedItems = await Promise.all(
        items.map(async (item) => {
            const narrativelyPolishedItem = await polishNarrativeWithGPT(item, filters.aiFocusGpt);
            const mechanicallyRefinedItem = await refineMechanicsWithDeepSeek(narrativelyPolishedItem, filters.aiFocusDeepSeek);
            return mechanicallyRefinedItem;
        })
    );

    const processedItems = enhancedItems.map((item: any) => ({
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