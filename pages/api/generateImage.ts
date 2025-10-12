
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Modality } from '@google/genai';
import type { GptParameters, MidjourneyParameters, ApiKeys } from '../../types';

interface ImageResponse {
    base64Image?: string;
    textResponse?: string;
    message: string;
}

const buildEnhancedImagePrompt = (prompt: string, mjParams?: MidjourneyParameters, gptParams?: GptParameters): string => {
    let finalPrompt = `**Descrição Principal:**\n${prompt}\n`;

    if (gptParams) {
        finalPrompt += `\n**Diretrizes de Estilo:**\n- **Atmosfera:** ${gptParams.tone}\n- **Estilo de Arte:** ${gptParams.style}\n- **Composição da Cena:** ${gptParams.composition}\n`;
    }

    if (mjParams) {
        const activeParams = Object.entries(mjParams).filter(([, p]) => p.active);
        if (activeParams.length > 0) {
            finalPrompt += `\n**Inspirações Adicionais (estilo Midjourney):**\n`;
            if (mjParams.style?.active) finalPrompt += `- Estética: ${mjParams.style.value}\n`;
            if (mjParams.stylize?.active) finalPrompt += `- Nível de Estilização: ${mjParams.stylize.value > 500 ? 'Alto e artístico' : 'Moderado e fiel'}\n`;
            if (mjParams.chaos?.active) finalPrompt += `- Nível de Caos/Surpresa: ${mjParams.chaos.value > 50 ? 'Alto' : 'Baixo'}\n`;
            if (mjParams.weird?.active) finalPrompt += `- Elementos Incomuns/Estranhos: ${mjParams.weird.value > 1000 ? 'Muito Presentes' : 'Sutis'}\n`;
        }
    }

    finalPrompt += `\nCombine todos esses elementos em uma única imagem coesa, dramática e de alta qualidade.`;
    return finalPrompt;
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ImageResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    try {
        const { prompt, mjParams, gptParams, apiKeys } = req.body as { prompt: string, mjParams?: MidjourneyParameters, gptParams?: GptParameters, apiKeys?: ApiKeys };
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ message: 'O prompt é obrigatório e deve ser uma string.' });
        }

        const aiClient = getAiClient(apiKeys?.gemini);
        if (!aiClient) {
            return res.status(500).json({ message: 'A chave da API do Gemini não está configurada no servidor.' });
        }

        const enhancedPrompt = buildEnhancedImagePrompt(prompt, mjParams, gptParams);

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
        });
        
        let base64Image: string | undefined = undefined;
        let textResponse: string | undefined = undefined;

        if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                base64Image = part.inlineData.data;
              } else if (part.text) {
                textResponse = part.text;
              }
            }
        }

        if (!base64Image) {
            const reason = textResponse || 'A IA não retornou uma imagem. Tente um prompt diferente.';
            return res.status(500).json({ message: reason });
        }

        res.status(200).json({ base64Image, textResponse, message: 'Imagem gerada com sucesso!' });

    } catch (error: any) {
        console.error("Erro em /api/generateImage:", error);
        res.status(500).json({ message: `Falha ao gerar imagem. Detalhes: ${error.message}` });
    }
}
