

import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

// FIX: Updated environment variable to API_KEY per coding guidelines.
const getAiClient = (): GoogleGenAI => {
    if (!process.env.API_KEY) {
        throw new Error("A variável de ambiente API_KEY não está definida. Certifique-se de que está configurada corretamente no ambiente de execução.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const serverGenerateImage = async (prompt: string): Promise<string> => {
    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });
        
        const images = response.generatedImages ?? [];
        const base64ImageBytes = images[0]?.image?.imageBytes;

        if (!base64ImageBytes) {
            throw new Error("API returned no image data.");
        }

        return `data:image/png;base64,${base64ImageBytes}`;

    } catch(error) {
        console.error("Erro detalhado na chamada da API de Imagem Gemini:", error);
        throw new Error("Falha ao gerar a imagem no servidor.");
    }
};

export const responseSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Identificador único (UUID v4)." },
        nome: { type: Type.STRING, description: "Nome do item gerado." },
        categoria: { type: Type.STRING, description: "Categoria do item, ex: 'Forma de Respiração', 'Arma', 'Inimigo/Oni'." },
        descricao_curta: { type: Type.STRING, description: "Resumo de 1-2 linhas para exibição em lista." },
        descricao: { type: Type.STRING, description: "Descrição narrativa detalhada." },
        dano: { type: Type.STRING, description: "Dano numérico ou fórmula, ex: '12' ou '2d6+FOR'." },
        dados: { type: Type.STRING, description: "Tipo de dado usado, ex: 'd6', '2d10'. 'N/A' se for dano fixo." },
        tipo_de_dano: { type: Type.STRING, description: "Tipo de dano, ex: 'Cortante', 'Fogo'." },
        status_aplicado: { type: Type.STRING, description: "Condições ou status aplicados, ex: 'Sangramento (3 turnos)', 'Paralisia'. 'Nenhum' se não houver." },
        efeitos_secundarios: { type: Type.STRING, description: "Qualquer outro efeito mecânico ou narrativo. 'Nenhum' se não houver." },
        ganchos_narrativos: { type: Type.STRING, description: "Ideias ou ganchos para usar o item em uma história de RPG." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível de poder/patente sugerido para o item/personagem." },
        respiracao_base: { type: Type.STRING, description: "Respiração base associada, se aplicável." },
        
        // Estatísticas de Combate Detalhadas
        dano_base: { type: Type.STRING, description: "Dano base do personagem/arma. Ex: '15'. 'N/A' se não aplicável." },
        multiplicador_de_ataque: { type: Type.STRING, description: "Multiplicador de ataque, ex: '1.2x FOR'. 'N/A' se não aplicável." },
        defesa: { type: Type.STRING, description: "Valor de defesa física. Ex: '20'. 'N/A' se não aplicável." },
        resistencia_magica: { type: Type.STRING, description: "Valor de resistência mágica ou a kekkijutsus. Ex: '15'. 'N/A' se não aplicável." },
        velocidade_movimento: { type: Type.STRING, description: "Velocidade de movimento em combate. Ex: '10m'. 'N/A' se não aplicável." },
    }
};

export { getAiClient };