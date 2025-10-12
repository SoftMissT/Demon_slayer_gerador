import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';
import type { FilterState, GeneratedItem } from '../../types';
import { buildGenerationPrompt, buildResponseSchema } from '../../lib/promptBuilder';

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

    const aiClient = getAiClient();
    if (!aiClient) {
        return res.status(500).json({ message: 'Erro de configuração do servidor: a API Key do Google Gemini não foi encontrada.' });
    }
    
    const prompt = buildGenerationPrompt(filters, count, promptModifier);
    const schema = buildResponseSchema(filters, count);
    
    const result = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.85,
        },
    });

    const jsonText = result.text?.trim();
    if (!jsonText) {
      throw new Error("A resposta da IA estava vazia ou em formato inválido.");
    }

    const responseData = JSON.parse(jsonText);
    const items = count > 1 ? responseData.items : [responseData]; 

    if (!Array.isArray(items)) {
        throw new Error("A resposta da IA não continha um array de itens válido.");
    }

    const processedItems = items.map((item: any) => ({
        ...item,
        id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
    }));

    res.status(200).json({ items: processedItems, message: 'Conteúdo gerado com sucesso!' });

  } catch (error) {
    console.error("Erro em /api/generateContent:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
    res.status(500).json({ message: `Falha ao gerar conteúdo. Detalhes: ${errorMessage}` });
  }
}
