
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverGenerateImage } from '../../lib/gemini';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    try {
        const { prompt } = req.body as { prompt: string };
        if (!prompt) {
            return res.status(400).json({ message: 'O prompt é obrigatório.' });
        }
        
        const imageUrl = await serverGenerateImage(prompt);
        
        res.status(200).json({ imageUrl });

    } catch (error) {
        console.error("Erro na API /api/generateImage:", error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor ao gerar a imagem.' });
    }
}
