
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Modality } from '@google/genai';

interface ImageResponse {
    base64Image?: string;
    textResponse?: string;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ImageResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    try {
        const { prompt } = req.body;
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ message: 'O prompt é obrigatório e deve ser uma string.' });
        }

        const aiClient = getAiClient();
        if (!aiClient) {
            return res.status(500).json({ message: 'A chave da API do Gemini não está configurada no servidor.' });
        }

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
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
            return res.status(500).json({ message: 'A IA não retornou uma imagem. Tente um prompt diferente.' });
        }

        res.status(200).json({ base64Image, textResponse, message: 'Imagem gerada com sucesso!' });

    } catch (error: any) {
        console.error("Erro em /api/generateImage:", error);
        res.status(500).json({ message: `Falha ao gerar imagem. Detalhes: ${error.message}` });
    }
}