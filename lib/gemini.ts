import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Nenhuma variável de ambiente de API Key (API_KEY ou GEMINI_API_KEY) foi definida.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

const promptsSchema = {
    type: Type.OBJECT,
    description: "Prompts prontos para o usuário copiar e usar em outras IAs.",
    properties: {
        Gemini: { type: Type.STRING },
        ChatGPT: { type: Type.STRING },
        Midjourney: { type: Type.STRING },
        Copilot: { type: Type.STRING },
    },
    required: ["Gemini", "ChatGPT", "Midjourney", "Copilot"]
};

export const simpleResponseSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Ignorar. Será gerado externamente." },
        nome: { type: Type.STRING },
        tipo: { type: Type.STRING },
        categoria: { type: Type.STRING },
        subcategoria: { type: Type.STRING },
        descricao_curta: { type: Type.STRING },
        descricao: { type: Type.STRING },
        ganchos_narrativos: { type: Type.STRING },
        nivel_sugerido: { type: Type.INTEGER },
        respiracao_base: { type: Type.STRING },
        raridade: { type: Type.STRING },
        efeito: { type: Type.STRING },
        historia: { type: Type.STRING },
        prompts_de_geracao: promptsSchema,
        preco_em_moedas: { type: Type.STRING },
        espaco_que_ocupa: { type: Type.STRING },
        dano: { type: Type.STRING },
        dados: { type: Type.STRING },
        tipo_de_dano: { type: Type.STRING },
        status_aplicado: { type: Type.STRING },
        efeitos_secundarios: { type: Type.STRING },
        dano_base: { type: Type.STRING },
        multiplicador_de_ataque: { type: Type.STRING },
        defesa: { type: Type.STRING },
        resistencia_magica: { type: Type.STRING },
        velocidade_movimento: { type: Type.STRING },
        clima: { type: Type.STRING },
        bioma: { type: Type.STRING },
    }
};

export const detailedResponseSchema = {
    type: Type.OBJECT,
    properties: {
      nome: { type: Type.STRING },
      tipo: { type: Type.STRING },
      categoria: { type: Type.STRING },
      subcategoria: { type: Type.STRING },
      arquétipo: { type: Type.STRING },
      tipo_habilidade: { type: Type.STRING },
      descricao: { type: Type.STRING },
      nivel_requerido: { type: Type.STRING },
      custo: {
        type: Type.OBJECT,
        properties: { stamina: { type: Type.INTEGER }, ki: { type: Type.INTEGER }, reagentes: { type: Type.STRING } },
      },
      cd: { type: Type.STRING },
      efeitos: {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: { tipo: { type: Type.STRING }, valor: { type: Type.STRING }, alvo: { type: Type.STRING }, obs: { type: Type.STRING } }
          }
      },
      interacao_respirações: { type: Type.STRING },
      roleplay_hook: { type: Type.STRING },
      teste_necessario: {
        type: Type.OBJECT,
        properties: { tipo: { type: Type.STRING }, cd: { type: Type.STRING }, efeito_falha: { type: Type.STRING } },
      },
      efeito_no_inimigo: {
        type: Type.OBJECT,
        properties: { teste: { type: Type.STRING }, cd: { type: Type.STRING }, falha: { type: Type.STRING } },
      },
      exaustao: { type: Type.STRING },
      cura_condicional: { type: Type.STRING },
      dano_total_formula: { type: Type.STRING },
      dano_por_nivel: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            nivel: { type: Type.STRING }, arma: { type: Type.STRING }, forma: { type: Type.STRING }, modificador: { type: Type.STRING }, dano_total_exemplo: { type: Type.STRING }, cd_vit: { type: Type.STRING },
          },
          required: ["nivel", "arma", "forma", "modificador", "dano_total_exemplo"]
        },
      },
      momentum: {
          type: Type.OBJECT,
          properties: {
              ganho_por_acerto: { type: Type.INTEGER },
              ganho_por_crit: { type: Type.INTEGER },
              gasta: {
                  type: Type.ARRAY,
                  items: { type: Type.OBJECT, properties: { '1': { type: Type.STRING }, '2': { type: Type.STRING }, '3': { type: Type.STRING } } }
              }
          }
      },
      ganchos_narrativos: { type: Type.STRING },
      raridade: { type: Type.STRING },
      efeito: { type: Type.STRING },
      historia: { type: Type.STRING },
      preco_em_moedas: { type: Type.STRING },
      espaco_que_ocupa: { type: Type.STRING },
      prompts_de_geracao: promptsSchema,
    }
};

export const serverGenerateImage = async (prompt: string): Promise<string> => {
    const aiClient = getAiClient();
    const response = await aiClient.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error('A API de geração de imagem não retornou resultados.');
    }

    const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
        throw new Error('A API retornou uma imagem, mas os dados da imagem estão vazios.');
    }
    
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
    return imageUrl;
};

export { getAiClient };