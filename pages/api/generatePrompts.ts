
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        prompts: {
            type: Type.OBJECT,
            properties: {
                midjourney: { type: Type.STRING, description: "Prompt conciso e descritivo para Midjourney, começando com /imagine prompt: e incluindo parâmetros como --v 6." },
                gemini: { type: Type.STRING, description: "Prompt verboso e instrutivo para Gemini, pedindo detalhes de iluminação, paleta e referências artísticas." },
                copilot: { type: Type.STRING, description: "Prompt focado em assets para Copilot (DALL-E), descrevendo o objeto em termos de camadas e mapas de textura." },
                gpt: { type: Type.STRING, description: "Prompt para ChatGPT (DALL-E) pedindo 5 variações curtas do conceito, cada uma com uma frase e 3 tags de estilo." }
            },
            required: ["midjourney", "gemini", "copilot", "gpt"]
        },
        references: {
            type: Type.ARRAY,
            description: "Array de até 3 referências conceituais ou de inspiração encontradas na web. Não precisam ser URLs diretas de imagens, mas sim artigos, conceitos ou galerias que enriqueçam a ideia.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "O título da página ou do conceito de referência." },
                    url: { type: Type.STRING, description: "A URL da referência." },
                    source: { type: Type.STRING, description: "O nome do site ou da fonte (ex: ArtStation, Wikipedia)." }
                },
                required: ["title", "url", "source"]
            }
        }
    }
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { query } = req.body;
        
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({ message: 'O campo "query" é obrigatório.' });
        }

        const sanitizedQuery = query.trim().slice(0, 500);

        const aiClient = getAiClient();

        const prompt = `
            O usuário quer criar uma imagem baseada na seguinte ideia: "${sanitizedQuery}".
            Sua tarefa é atuar como um engenheiro de prompts especialista. NÃO GERE IMAGENS.
            Sua única saída DEVE ser um objeto JSON válido que corresponde ao schema fornecido.

            1.  **Gere 4 prompts de texto distintos** para as seguintes plataformas de IA, adaptando o estilo para cada uma:
                *   **midjourney:** Crie um prompt conciso, visual e cheio de adjetivos, começando com "/imagine prompt:" e incluindo parâmetros técnicos relevantes como "--v 6" e "--ar 2:3".
                *   **gemini:** Crie um prompt mais verboso e instrutivo, como se estivesse dando uma direção de arte. Peça detalhes sobre iluminação, paleta de cores, e cite referências artísticas.
                *   **copilot:** Crie um prompt descritivo focado na criação de um "asset" de jogo ou 3D. Mencione camadas, mapas de textura (como normal_map, roughness), e como o objeto deve ser estruturado.
                *   **gpt:** Crie um prompt que peça ao ChatGPT para gerar 5 variações curtas da ideia principal, onde cada variação é uma frase com 3 tags de estilo.

            2.  **Encontre 3 referências conceituais** usando sua ferramenta de busca. As referências devem ser inspirações (artigos, galerias, conceitos de arte, páginas da Wikipedia sobre o tema) que ajudem o usuário a refinar a ideia. Para cada referência, forneça o título, a URL e a fonte.
        `;

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            },
            // A ferramenta de busca é habilitada por padrão no modelo flash, 
            // não sendo necessário especificar `tools: [{googleSearch: {}}]`
            // a menos que queiramos um controle mais fino, que não é o caso aqui.
        });

        const rawText = response.text.trim();
        if (!rawText) {
            throw new Error("A API não retornou texto.");
        }
        
        const data = JSON.parse(rawText);

        const finalResponse = {
            query: sanitizedQuery,
            prompts: data.prompts,
            references: data.references,
        };

        res.status(200).json(finalResponse);

    } catch (error) {
        console.error("Erro em /api/generatePrompts:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: errorMessage });
    }
}
