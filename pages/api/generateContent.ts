import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';
import type { FilterState, GeneratedItem } from '../../types';

const buildMissionPrompt = (filters: FilterState): string => {
    const { era, tone, intensity, scale, protagonist, targets, moodModifiers } = filters;

    return `
Você é um mestre de RPG e escritor de cenários de classe mundial. Sua tarefa é gerar uma missão detalhada com base nos parâmetros fornecidos, seguindo RIGOROSAMENTE a estrutura de saída JSON e as regras de conteúdo.

**PARÂMETROS DA MISSÃO:**
- ERA: "${era}"
- TONE: "${tone}"
- INTENSITY: ${intensity} (de 1 a 5)
- SCALE: "${scale}"
- PROTAGONISTA: "${protagonist}"
- TARGETS: "${targets}"
- MOOD_MODIFIERS: "${moodModifiers}"

**REGRAS OBRIGATÓRIAS:**
1. **Estrutura de Saída:** A resposta DEVE ser um único objeto JSON válido, sem markdown ou texto extra, seguindo o schema fornecido.
2. **Linguagem Sensorial:** Use linguagem concreta e sensorial. Mostre, não diga.
3. **Templates de Descrição:** Use os templates abaixo VERBATIM para descrever o protagonista, o oni, NPCs e itens.

**TEMPLATES DE DESCRIÇÃO (USE ESTA ESTRUTURA):**

**Caçador (5 frases):**
- Silhueta e postura.
- Traços faciais e pele.
- Roupa e armadura; sinais de uso.
- Movimento e gestos característicos.
- Marca ou relíquia identificadora + cheiro/efeito.

**Oni (6 frases):**
- Tamanho e proporção fora do humano.
- Pele/textura e cor.
- Apêndices e deformidades.
- Olhos e expressão.
- Som/odor que o acompanha.
- Sinal místico ou ferida que conta história.

**Item (5 linhas):**
- Aparência imediata.
- Material e procedência.
- Sinais de uso e dano.
- Propriedade estranha (visual ou mecânica).
- Uso concreto em cena.

**NPC (5 linhas):**
- Papel social.
- Objetivo imediato.
- Flaw ou segredo.
- Traço físico memorável.
- Linha de diálogo curta que revele caráter.

**SAÍDA REQUERIDA (11 PONTOS):**
1. **Título:** Título sucinto da missão.
2. **Sinopse:** 2 frases.
3. **Gancho, Objetivo, Stakes:** Gancho inicial, objetivo principal e o que está em jogo.
4. **Três Complicações:** 3 complicações possíveis.
5. **Ambiente:** Descrição detalhada do local principal (visão, som, cheiro, etc.).
6. **Descrição do Protagonista:** Usando o template de 5 frases.
7. **Descrição do Oni:** Usando o template de 6 frases.
8. **3 NPCs Relevantes:** Usando o template de 5 linhas para cada um.
9. **3 Itens Relevantes:** Usando o template de 5 linhas para cada um.
10. **3 Variações de Tom:** Leve, padrão e extremo.
11. **Ganchos Secundários e Escalada:** Sugestões para continuar a história.

Agora, gere a missão.
`;
};

const missionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        logline: { type: Type.STRING },
        summary: { type: Type.STRING },
        objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
        complications: { type: Type.ARRAY, items: { type: Type.STRING } },
        environment: { type: Type.STRING },
        protagonist_desc: {
            type: Type.OBJECT,
            properties: {
                silhouette: { type: Type.STRING },
                face: { type: Type.STRING },
                attire: { type: Type.STRING },
                movement: { type: Type.STRING },
                defining_feature: { type: Type.STRING },
            },
        },
        oni_desc: {
            type: Type.OBJECT,
            properties: {
                scale: { type: Type.STRING },
                skin: { type: Type.STRING },
                appendages: { type: Type.STRING },
                eyes: { type: Type.STRING },
                sound_smell: { type: Type.STRING },
                mystic_sign: { type: Type.STRING },
            },
        },
        key_npcs: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    secret: { type: Type.STRING },
                    twist: { type: Type.STRING },
                    physical_trait: { type: Type.STRING },
                    dialogue_example: { type: Type.STRING },
                },
            },
        },
        relevant_items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    appearance: { type: Type.STRING },
                    origin: { type: Type.STRING },
                    wear: { type: Type.STRING },
                    quirk: { type: Type.STRING },
                    use: { type: Type.STRING },
                },
            },
        },
        tone_variations: { type: Type.OBJECT },
        scaling_hooks: { type: Type.STRING },
    },
};


const buildDefaultPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    const { category, rarity, era, breathingStyles, demonArts } = filters;

    let prompt = `Você é um mestre de RPG especialista em criar conteúdo para o universo de Demon Slayer. Sua tarefa é gerar ${count} ${count > 1 ? 'itens únicos' : 'item único'} com base nos seguintes critérios. A resposta DEVE ser um array JSON de objetos, seguindo o schema fornecido, mesmo que gere apenas um item.

**Categoria:** ${category}
**Raridade:** ${rarity}
**Era/Estilo:** ${era}
`;

    if (category === 'Forma de Respiração' && breathingStyles && breathingStyles.length > 0) {
        prompt += `**Inspiração (Respirações Existentes):** ${breathingStyles.join(', ')}. Crie uma nova Forma de Respiração que combine elementos ou se inspire nestes estilos.\n`;
    }

    if (category === 'Kekkijutsu' && demonArts && demonArts.length > 0) {
        prompt += `**Inspiração (Kekkijutsus Existentes):** ${demonArts.join(', ')}. Crie um novo Kekkijutsu que combine elementos ou se inspire nestas artes.\n`;
    }
    
    if (promptModifier) {
        prompt += `**Modificador Adicional:** ${promptModifier}\n`;
    }

    prompt += `
Para cada item, forneça todos os campos definidos no schema. Seja criativo e detalhado.
Gere o JSON diretamente, sem markdown ou texto extra.
`;

    return prompt;
};

const defaultResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            nome: { type: Type.STRING },
            categoria: { type: Type.STRING },
            raridade: { type: Type.STRING },
            nivel_sugerido: { type: Type.INTEGER },
            descricao_curta: { type: Type.STRING },
            descricao: { type: Type.STRING },
            dano: { type: Type.STRING },
            dados: { type: Type.STRING },
            tipo_de_dano: { type: Type.STRING },
            status_aplicado: { type: Type.STRING },
            efeitos_secundarios: { type: Type.STRING },
            ganchos_narrativos: { type: Type.STRING },
            clima: { type: Type.STRING },
            bioma: { type: Type.STRING },
        },
    },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ items: GeneratedItem[] } | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { filters, count, promptModifier } = req.body;

    if (!filters) {
      return res.status(400).json({ message: 'Filtros são obrigatórios.' });
    }

    const aiClient = getAiClient();
    let prompt;
    let responseSchema;
    let isSingleItem = true;

    if (filters.category === 'Missão/Cenário') {
        prompt = buildMissionPrompt(filters);
        responseSchema = missionSchema;
        isSingleItem = false; // The mission generator returns a single object, not an array
    } else {
        prompt = buildDefaultPrompt(filters, count || 1, promptModifier);
        responseSchema = defaultResponseSchema;
    }

    const result = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = result.text.trim();
    let generatedItems;

    if (isSingleItem) {
        generatedItems = JSON.parse(jsonText);
    } else {
        const singleMission = JSON.parse(jsonText);
        // Wrap the single mission object in an array to match the expected return type
        generatedItems = [{ ...singleMission, nome: singleMission.title, categoria: 'Missão/Cenário' }];
    }

    res.status(200).json({ items: generatedItems });

  } catch (error) {
    console.error("Erro em /api/generateContent:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
    res.status(500).json({ message: `Falha ao gerar conteúdo. Detalhes: ${errorMessage}` });
  }
}