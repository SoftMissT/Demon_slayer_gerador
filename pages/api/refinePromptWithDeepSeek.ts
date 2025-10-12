import type { NextApiRequest, NextApiResponse } from 'next';

interface RefineResponse {
    refinedPrompt?: string;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RefineResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { promptToRefine, modelType } = req.body;

    if (!promptToRefine || !modelType) {
        return res.status(400).json({ message: 'Prompt e tipo de modelo são obrigatórios.' });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ message: 'Erro de configuração do servidor: a API Key do DeepSeek não foi encontrada.' });
    }

    const systemPrompt = `Você é um especialista em engenharia de prompts para IAs de geração de imagem. Sua tarefa é refinar e aprimorar o prompt a seguir, que é destinado ao ${modelType === 'midjourney' ? 'Midjourney' : 'DALL-E 3'}. Adicione detalhes mais vívidos, termos artísticos, e melhore a composição para gerar uma imagem mais impressionante e coesa. Mantenha a essência do prompt original, mas eleve sua qualidade. Retorne APENAS o texto do prompt refinado, sem nenhuma outra explicação, cabeçalho ou formatação.`;

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: promptToRefine },
                ],
                temperature: 0.7,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DeepSeek API Error:', errorData);
            throw new Error(errorData.error?.message || `Erro na API do DeepSeek: ${response.statusText}`);
        }

        const data = await response.json();
        const refinedPrompt = data.choices[0]?.message?.content?.trim();

        if (!refinedPrompt) {
            throw new Error('A resposta da API do DeepSeek estava vazia ou em formato inválido.');
        }

        res.status(200).json({ refinedPrompt, message: 'Prompt refinado com sucesso!' });

    } catch (error: any) {
        console.error("Erro em /api/refinePromptWithDeepSeek:", error);
        res.status(500).json({ message: error.message || 'Falha ao refinar o prompt.' });
    }
}
