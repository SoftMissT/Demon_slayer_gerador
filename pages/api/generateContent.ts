import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient, responseSchema as simpleResponseSchema, serverGenerateImage } from '../../lib/gemini';
// FIX: Import 'GenerationType' to be used in type casting.
import type { FilterState, GeneratedItem, GenerationType } from '../../types';
import { Type } from '@google/genai';
import { buildImagePrompt } from '../../lib/promptBuilder';
import { randomUUID } from 'crypto';

const buildSimplePrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    return `
    Objetivo: Gerar ${count} conteúdo(s) para RPG de mesa no universo de Kimetsu no Yaiba, com foco em narrativa e mecânicas simples.

    Filtros Aplicados:
    - Tipo de Geração: ${filters.generationType || 'Qualquer um'}
    - Nível Alvo: ${filters.level}
    - Era: ${filters.era || 'Padrão (Período Edo)'}
    - Raridade: ${filters.rarity}
    ${filters.breathingBase ? `- Respiração Base: ${filters.breathingBase}` : ''}
    ${filters.weaponType.length > 0 ? `- Tipos de Arma: ${filters.weaponType.join(', ')}` : ''}
    ${filters.kekkijutsu ? `- Kekkijutsu: ${filters.kekkijutsu}` : ''}
    ${promptModifier ? `- Modificador Adicional: ${promptModifier}` : ''}

    Instruções:
    1. Dano: Defina 'dano', 'dados' e 'tipo_de_dano'. Ex: "dano": "2d6", "dados": "d6", "tipo_de_dano": "cortante".
    2. Status e Efeitos: Use 'status_aplicado' e 'efeitos_secundarios'. Se não houver, use "Nenhum".
    3. Estatísticas de Combate: Para tipos de personagem (Oni, Caçador, Classe/Origem, Híbrido), preencha 'dano_base', 'multiplicador_de_ataque', 'defesa', 'resistencia_magica' e 'velocidade_movimento'. Para outros tipos como Missão ou Arma, use "N/A".
    4. Classe/Origem: Para este tipo, 'descricao' deve detalhar a história, 'efeitos_secundarios' as habilidades, e os campos de dano devem ser "N/A".
    5. Estilo: Narrativa detalhada e sombria, com ganchos de roleplay em 'ganchos_narrativos'.

    INSTRUÇÕES DE SAÍDA:
    - A resposta DEVE ser um array JSON com ${count} objeto(s).
    - Siga estritamente o schema JSON fornecido.
    - O campo 'categoria' DEVE corresponder ao 'Tipo de Geração' do filtro.
    - Gere um 'id' (UUID v4) e uma 'descricao_curta' (1-2 linhas).
    `;
};

const detailedResponseSchema = {
    type: Type.OBJECT,
    properties: {
      nome: { type: Type.STRING },
      tipo: { type: Type.STRING },
      descricao: { type: Type.STRING },
      nivel_requerido: { type: Type.STRING },
      teste_necessario: {
        type: Type.OBJECT,
        properties: {
          tipo: { type: Type.STRING },
          cd: { type: Type.STRING },
          efeito_falha: { type: Type.STRING },
        },
      },
      efeito_no_inimigo: {
        type: Type.OBJECT,
        properties: {
          teste: { type: Type.STRING },
          cd: { type: Type.STRING },
          falha: { type: Type.STRING },
        },
      },
      exaustao: { type: Type.STRING },
      cura_condicional: { type: Type.STRING },
      dano_por_nivel: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            nivel: { type: Type.STRING },
            dano: { type: Type.STRING },
            pdr: { type: Type.STRING },
            cd_vit: { type: Type.STRING },
          },
        },
      },
      ganchos_narrativos: { type: Type.STRING },
    }
};

const buildDetailedPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    return `
    Objetivo: Gerar ${count} técnica(s) de respiração ou kekkijutsu(s) detalhada(s), inspirada(s) em Kimetsu no Yaiba, com narrativa épica, cálculo de dano, testes, status e ganchos para roleplay.
    
    Filtros Aplicados:
    - Tipo de Geração: ${filters.generationType}
    - Nível Alvo: ${filters.level}
    ${filters.breathingBase ? `- Respiração Base: ${filters.breathingBase}` : ''}
    ${promptModifier ? `- Modificador Adicional: ${promptModifier}` : ''}

    Instruções:

    1) Nome e Forma: Cada técnica deve ter um nome completo, incluindo forma e possível título secreto (ex.: "Décima Forma, Técnica Secreta dos Venturi: Sacrificio del Principe del Vento"). O campo "tipo" deve ser "${filters.generationType}".

    2) Narrativa: Descrever visual e sonoramente cada técnica no campo "descricao": movimentos, postura, padrão de ataques, sons, efeitos no ambiente e sensação para espectadores. Incluir a sequência de golpes detalhada. Manter estilo épico e cinematográfico.

    3) Nível Requerido: Especificar nível mínimo de habilidade em "nivel_requerido".

    4) Testes e CDs:
    - Definir testes obrigatórios para usar a técnica em "teste_necessario" (com "tipo", "cd" e "efeito_falha").
    - Definir testes para os inimigos resistirem em "efeito_no_inimigo" (com "teste", "cd", "falha").

    5) Dano: Calcular dano base e escalonado por nível em "dano_por_nivel", que é um array. Cada objeto deve ter "nivel", "dano" (ex: "3d8 + DEX"), "pdr" e "cd_vit". Incluir bônus por atributos e tipos de dano na descrição. Efeitos de status devem ser descritos em "efeito_no_inimigo.falha".

    6) Custo e Consequências: Determinar exaustão, consumo de energia ou sangue em "exaustao". Definir possíveis efeitos de cura em "cura_condicional".

    7) Ganchos Narrativos: Em "ganchos_narrativos", incluir impacto em roleplay, como a técnica afeta aliados, inimigos ou cenário.

    8) Saída Estruturada: Gerar a resposta como um array JSON com ${count} objeto(s), seguindo estritamente o schema fornecido.
    `;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { filters, count = 1, promptModifier } = req.body as { filters: FilterState, count: number, promptModifier?: string };
        const isDetailedType = ['Forma de Respiração', 'Kekkijutsu'].includes(filters.generationType);
        
        const prompt = isDetailedType 
            ? buildDetailedPrompt(filters, count, promptModifier) 
            : buildSimplePrompt(filters, count, promptModifier);

        const schema = isDetailedType 
            ? { type: Type.ARRAY, items: detailedResponseSchema } 
            : { type: Type.ARRAY, items: simpleResponseSchema };

        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
            },
        });

        const rawText = typeof response?.text === "string" ? response.text.trim() : "";
        if (!rawText) {
            throw new Error("API returned no text in response.text.");
        }
        let itemsFromApi = JSON.parse(rawText);

        if (!Array.isArray(itemsFromApi)) {
            itemsFromApi = [itemsFromApi];
        }

        const processedItems: GeneratedItem[] = itemsFromApi.map((item: any) => {
            if (isDetailedType) {
                const nivelNum = parseInt(item.nivel_requerido, 10) || filters.level;
                return {
                    id: randomUUID(),
                    nome: item.nome,
                    categoria: item.tipo as GenerationType,
                    descricao: item.descricao,
                    descricao_curta: item.descricao.substring(0, 120) + '...',
                    nivel_sugerido: nivelNum,
                    ganchos_narrativos: item.ganchos_narrativos,
                    respiracao_base: filters.breathingBase,
                    // Detailed fields
                    nivel_requerido: item.nivel_requerido,
                    teste_necessario: item.teste_necessario,
                    efeito_no_inimigo: item.efeito_no_inimigo,
                    exaustao: item.exaustao,
                    cura_condicional: item.cura_condicional,
                    dano_por_nivel: item.dano_por_nivel,
                };
            }
            // Simple type item
            return item as GeneratedItem;
        });

        const itemsWithImagesPromises = processedItems.map(async (item) => {
            if (['Inimigo/Oni', 'Caçador', 'Híbrido Humano-Oni'].includes(item.categoria) && !isDetailedType) {
                try {
                    const imagePrompt = buildImagePrompt(item, filters.era);
                    const imageUrl = await serverGenerateImage(imagePrompt);
                    return { ...item, imageUrl };
                } catch (error) {
                    console.error(`Falha ao gerar imagem para ${item.categoria}: ${item.nome}`, error);
                    return item; // Retorna o item sem imagem em caso de falha
                }
            }
            return item;
        });

        const finalItems = await Promise.all(itemsWithImagesPromises);
        
        res.status(200).json({ items: finalItems });

    } catch (error) {
        console.error("Erro na API /api/generateContent:", error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.' });
    }
}