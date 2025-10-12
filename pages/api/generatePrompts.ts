

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';
// FIX: Corrected type import from the now separate types.ts file.
import type { PromptGenerationResult } from '../../types';

// Helper to format Midjourney params into a string
const formatMjParams = (params: { [key: string]: any }, negativePrompt?: string): string => {
    let paramString = '';
    if (params.aspectRatio) paramString += ` --ar ${params.aspectRatio}`;
    if (params.chaos) paramString += ` --c ${params.chaos}`;
    if (params.quality) paramString += ` --q ${params.quality}`;
    if (params.style) paramString += ` --style ${params.style}`;
    if (params.stylize) paramString += ` --s ${params.stylize}`;
    if (params.weird) paramString += ` --w ${params.weird}`;
    if (params.version) {
        if (params.version.startsWith('Niji')) {
            paramString += ` --niji ${params.version.split(' ')[1]}`;
        } else {
            paramString += ` --v ${params.version}`;
        }
    }
    if (negativePrompt) {
        paramString += ` --no ${negativePrompt}`;
    }
    return paramString.trim();
};

const buildPromptGenerationPrompt = (topic: string, negativePrompt: string, mjParams: any, gptParams: any): string => {
    const mjParamsString = formatMjParams(mjParams, negativePrompt);
    
    return `Você é um "Alquimista de Prompts", um mestre na arte de traduzir ideias humanas em comandos visuais perfeitos para IAs de geração de imagem.
Sua especialidade é criar prompts para Midjourney e DALL-E 3/GPT.

**Missão:** Transforme a seguinte ideia do usuário em dois prompts distintos, um para cada plataforma, seguindo as diretrizes alquímicas abaixo.

**Ideia Bruta do Usuário:**
- Tópico Principal: ${topic}
- Ingredientes a Evitar (Prompt Negativo): ${negativePrompt || 'Nenhum'}
- Fórmula para GPT/DALL-E:
  - Tom/Atmosfera: ${gptParams.tone}
  - Estilo de Arte: ${gptParams.style}
  - Composição/Ângulo: ${gptParams.composition}
- Encantamento Final para Midjourney: ${mjParamsString}

**Diretrizes Alquímicas:**

1.  **Elixir para Midjourney:**
    - **Fórmula:** Crie uma sequência potente de palavras-chave e frases descritivas curtas, separadas por vírgulas. Pense nisso como as anotações de um mestre artista: conciso, mas evocativo.
    - **Foco:** Priorize termos de iluminação (ex: 'cinematic lighting', 'volumetric'), detalhes de câmera (ex: 'depth of field', '8k'), e estilo (ex: 'hyperdetailed', 'epic composition').
    - **Estrutura:** Comece com o sujeito principal, adicione o cenário, depois os detalhes de estilo, e termine com os parâmetros técnicos.
    - **Obrigatório:** O prompt DEVE terminar com a string de encantamento final exatamente como fornecida: \`${mjParamsString}\`.

2.  **Transmutação para GPT/DALL-E:**
    - **Fórmula:** Escreva um parágrafo narrativo rico e imersivo, como se estivesse descrevendo uma cena de um filme de alto orçamento ou uma passagem de um livro de fantasia.
    - **Foco:** Use linguagem sensorial para descrever a cena. Incorpore a "Fórmula para GPT/DALL-E" de forma natural no texto para definir a atmosfera, o estilo visual e a perspectiva da câmera.
    - **Estrutura:** Conte uma pequena história. Descreva o personagem, suas ações, o ambiente ao redor, a iluminação e a emoção geral da cena.

A resposta final DEVE ser um único objeto JSON válido com duas chaves: "midjourneyPrompt" e "gptPrompt". Sem explicações, apenas o JSON.`;
};


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        midjourneyPrompt: { type: Type.STRING },
        gptPrompt: { type: Type.STRING },
    },
    required: ["midjourneyPrompt", "gptPrompt"]
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PromptGenerationResult | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { topic, negativePrompt, mjParams, gptParams } = req.body;

        if (!topic) {
            return res.status(400).json({ message: 'O tópico é obrigatório.' });
        }

        const aiClient = getAiClient();
        if (!aiClient) {
            return res.status(500).json({ message: 'Erro de configuração do servidor: a API Key do Google Gemini não foi encontrada.' });
        }

        const prompt = buildPromptGenerationPrompt(topic, negativePrompt, mjParams, gptParams);

        const result = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = result.text?.trim();
        if (!jsonText) {
            throw new Error("A resposta da IA estava vazia.");
        }

        const data = JSON.parse(jsonText);
        
        res.status(200).json(data);

    } catch (error: any) {
        console.error("Erro em /api/generatePrompts:", error);

        let detailedMessage = 'Ocorreu um erro desconhecido no servidor.';
        if (error instanceof Error) {
            detailedMessage = error.message;
        } else if (typeof error === 'string') {
            detailedMessage = error;
        }

        try {
            const jsonMatch = detailedMessage.match(/({.*})/s);
            if (jsonMatch && jsonMatch[0]) {
                const errorObj = JSON.parse(jsonMatch[0]);
                if (errorObj.error && errorObj.error.message) {
                    detailedMessage = errorObj.error.message;
                }
            } else if (detailedMessage.includes("API key not valid")) {
                detailedMessage = "API key not valid. Please pass a valid API key.";
            }
        } catch (e) {
            // Parsing failed
        }

        res.status(500).json({ message: `Falha ao gerar prompts. Detalhes: ${detailedMessage}` });
    }
}