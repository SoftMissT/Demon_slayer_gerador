import type { NextApiRequest, NextApiResponse } from 'next';
import { getAiClient } from '../../lib/gemini';
import { Type } from '@google/genai';
import type { FilterState, GeneratedItem } from '../../types';

// --- Start of inlined promptSchemas.ts content ---

// Schemas for individual item types
const baseItemSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        categoria: { type: Type.STRING },
        raridade: { type: Type.STRING },
        nivel_sugerido: { type: Type.INTEGER },
        descricao_curta: { type: Type.STRING },
        descricao: { type: Type.STRING },
        dano: { type: Type.STRING, description: "Ex: 'Médio', 'Baixo', 'Alto'" },
        dados: { type: Type.STRING, description: "Ex: '2d8', '1d12'" },
        tipo_de_dano: { type: Type.STRING, description: "Ex: 'Cortante', 'Perfurante', 'Fogo'" },
        status_aplicado: { type: Type.STRING, description: "Ex: 'Queimadura', 'Lentidão', 'Nenhum'" },
        efeitos_secundarios: { type: Type.STRING, description: "Efeitos passivos ou secundários." },
        ganchos_narrativos: { type: Type.STRING, description: "Ideias de como integrar o item na história." },
    },
    required: ["nome", "categoria", "raridade", "nivel_sugerido", "descricao_curta", "descricao"]
};

const hunterSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        categoria: { type: Type.STRING, description: "Deve ser 'Caçador'" },
        origem: { type: Type.STRING },
        classe: { type: Type.STRING, description: "O arquétipo/classe do caçador. Ex: 'O Veterano Marcado', 'O Prodígio Inovador'." },
        personalidade: { type: Type.STRING },
        nivel_sugerido: { type: Type.INTEGER },
        raridade: { type: Type.STRING, description: "A 'raridade' ou notoriedade do Caçador, ex: Comum, Raro, Lendário." },
        descricao_fisica: { type: Type.STRING, description: "Descrição detalhada da aparência do caçador." },
        background: { type: Type.STRING, description: "Uma história de fundo curta e impactante." },
        arsenal: {
            type: Type.OBJECT,
            properties: {
                arma: { type: Type.STRING, description: "Tipo de arma principal, ex: Katana, Naginata." },
                empunhadura: { 
                    type: Type.OBJECT,
                    properties: {
                        nome: { type: Type.STRING, description: "O nome do estilo de combate, ex: Ittō-ryū (Estilo de Uma Espada)." },
                        descricao: { type: Type.STRING, description: "Uma descrição detalhada de como o estilo de combate se manifesta." }
                    },
                    required: ["nome", "descricao"]
                 }
            },
            required: ["arma", "empunhadura"]
        },
        habilidades_especiais: {
            type: Type.OBJECT,
            properties: {
                respiracao: { type: Type.STRING, description: "O nome da Forma de Respiração principal, ou uma combinação se houver duas." },
                variacoes_tecnica: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exemplos de técnicas ou variações únicas da respiração." }
            },
            required: ["respiracao", "variacoes_tecnica"]
        },
        acessorio: {
            type: Type.OBJECT,
            description: "Um acessório único e temático que o caçador usa, com nome e descrição.",
            properties: {
                nome: { type: Type.STRING },
                descricao: { type: Type.STRING }
            },
            required: ["nome", "descricao"]
        },
        ganchos_narrativos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Três ganchos de aventura ou plot prontos envolvendo o caçador." },
        uso_em_cena: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Três exemplos de como o caçador pode ser introduzido ou utilizado em uma cena." },
    },
    required: ["nome", "categoria", "origem", "classe", "nivel_sugerido", "raridade", "descricao_fisica", "background", "arsenal", "habilidades_especiais", "ganchos_narrativos", "uso_em_cena", "acessorio", "personalidade"]
};

const oniSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        categoria: { type: Type.STRING, description: "Deve ser 'Inimigo/Oni'" },
        power_level: { type: Type.STRING, description: "O nível de poder do Oni, ex: 'Minion', 'Lua Inferior', 'Lua Superior'." },
        raridade: { type: Type.STRING, description: "Raridade correspondente ao nível de poder." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível sugerido correspondente ao nível de poder." },
        descricao_curta: { type: Type.STRING, description: "Uma descrição curta e impactante para a lista." },
        descricao_fisica_detalhada: { type: Type.STRING, description: "Uma descrição visual rica e grotesca do Oni." },
        kekkijutsu: {
            type: Type.OBJECT,
            description: "A Arte Demoníaca de Sangue. Se não houver, os campos nome e descricao devem conter 'Nenhum'.",
            properties: {
                nome: { type: Type.STRING },
                descricao: { type: Type.STRING }
            },
            required: ["nome", "descricao"]
        },
        comportamento_combate: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de táticas, estratégias e padrões de ataque do Oni em batalha." },
        comportamento_fora_combate: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de hábitos, manias e comportamentos do Oni em seu covil ou quando não está em alerta." },
        fraquezas_unicas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de fraquezas específicas e criativas, além do sol e de Lâminas de Nichirin. Pense em medos, rituais ou itens específicos." },
        trofeus_loot: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de itens, partes do corpo ou materiais que podem ser coletados do Oni para criar armas, armaduras ou poções." },
        ganchos_narrativos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Três ganchos de aventura ou plot prontos envolvendo o Oni." },
    },
    required: ["nome", "categoria", "power_level", "raridade", "nivel_sugerido", "descricao_curta", "descricao_fisica_detalhada", "kekkijutsu", "comportamento_combate", "comportamento_fora_combate", "fraquezas_unicas", "trofeus_loot", "ganchos_narrativos"]
};

const breathingFormMechanicsSchema = {
    type: Type.OBJECT,
    properties: {
        activation: { type: Type.STRING, description: "Ex: 'Ação completa', 'Ação bônus', 'Reação'" },
        target: { type: Type.STRING, description: "Ex: 'alvo único', 'área X metros', 'cone Y'" },
        initial_test: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "Atributo testado, ex: 'FDV', 'VIT'" },
                dc_formula: { type: Type.STRING, description: "Fórmula para a Classe de Dificuldade, ex: '10 + FDV_usuario'" }
            },
            required: ["type", "dc_formula"]
        },
        on_success_target: { type: Type.STRING, description: "Efeito se o alvo passar no teste inicial." },
        on_fail_target: { type: Type.STRING, description: "Efeito se o alvo falhar no teste inicial." },
        damage_formula_rank: { type: Type.OBJECT, description: "Objeto com fórmulas de dano por rank, ex: {'rank3': '18d12 + 6*FOR'}" },
        weapon_heat: {
            type: Type.OBJECT,
            properties: {
                weapon: { type: Type.INTEGER },
                target: { type: Type.INTEGER },
                duration: { type: Type.STRING }
            }
        },
        critical_rule: { type: Type.STRING },
        exhaustion_cost: { type: Type.INTEGER },
        exhaustion_transfer: {
            type: Type.OBJECT,
            properties: {
                vit_test_dc: { type: Type.STRING },
                transfer_on_fail: { type: Type.INTEGER }
            }
        },
        cooldown: { type: Type.STRING, description: "Ex: 'por encontro', 'descanso curto', 'X turnos'" },
        scaling_notes: { type: Type.STRING }
    },
    required: ["activation", "target", "initial_test", "on_success_target", "on_fail_target", "damage_formula_rank", "exhaustion_cost", "cooldown"]
};

const breathingFormRequirementsSchema = {
    type: Type.OBJECT,
    properties: {
        min_rank: { type: Type.INTEGER },
        cooldown: { type: Type.STRING },
        exhaustion_cost: { type: Type.INTEGER }
    },
    required: ["min_rank", "cooldown", "exhaustion_cost"]
};

const breathingFormSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING, description: "Nome em Português da forma derivada." },
        categoria: { type: Type.STRING, description: "Deve ser 'Forma de Respiração'" },
        raridade: { type: Type.STRING, description: "Raridade da forma, ex: Raro, Épico." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível sugerido para aprender a forma." },
        descricao_curta: { type: Type.STRING, description: "Um resumo de 1-2 frases sobre o que a forma faz." },
        base_breathing_id: { type: Type.STRING, description: "O nome da respiração base da qual esta forma deriva." },
        derivation_type: { type: Type.STRING, description: "Ex: 'Técnica Esotérica', 'Variação Ancestral'" },
        name_native: { type: Type.STRING, description: "Nome opcional no estilo japonês original." },
        name_pt: { type: Type.STRING, description: "Nome em português da forma." },
        description_flavor: { type: Type.STRING, description: "Texto narrativo curto (1-3 frases) sobre a aparência da técnica." },
        mechanics: breathingFormMechanicsSchema,
        requirements: breathingFormRequirementsSchema,
        level_scaling: { type: Type.OBJECT, description: "Objeto descrevendo como os valores mudam por rank." },
        balance_variants: {
            type: Type.OBJECT,
            properties: {
                leve: { type: Type.OBJECT, description: "Versão com custo e dano reduzidos." },
                padrao: { type: Type.OBJECT, description: "Versão padrão da mecânica." },
                brutal: { type: Type.OBJECT, description: "Versão com custo e dano aumentados." }
            }
        },
        micro_variants: { type: Type.ARRAY, items: { type: Type.OBJECT }, description: "Exatamente 3 pequenas variações da técnica." },
        sensitive_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
        clipboard_plain: { type: Type.STRING },
        clipboard_markdown: { type: Type.STRING },
        notes_for_gm: { type: Type.STRING },
    },
    required: ["nome", "categoria", "raridade", "nivel_sugerido", "descricao_curta", "base_breathing_id", "derivation_type", "description_flavor", "mechanics", "requirements", "level_scaling", "micro_variants"]
};


const locationSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        categoria: { type: Type.STRING, description: "Deve ser 'Local/Cenário'" },
        raridade: { type: Type.STRING, description: "Raridade do local, ex: Comum, Raro, Lendário." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível de desafio sugerido para o local." },
        descricao_curta: { type: Type.STRING },
        descricao: { type: Type.STRING },
        clima: { type: Type.STRING },
        bioma: { type: Type.STRING },
        pais: { type: Type.STRING },
        terreno: { type: Type.STRING },
        tom_local: { type: Type.STRING },
        ganchos_narrativos: { type: Type.STRING },
    },
    required: ["nome", "categoria", "raridade", "nivel_sugerido", "descricao_curta", "descricao", "clima", "bioma", "ganchos_narrativos", "pais", "terreno", "tom_local"]
};

const missionNpcSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        role: { type: Type.STRING },
        dialogue_example: { type: Type.STRING },
        physical_trait: { type: Type.STRING },
        goal: { type: Type.STRING },
        secret: { type: Type.STRING },
        twist: { type: Type.STRING },
    },
    required: ["id", "name", "role", "dialogue_example", "physical_trait", "goal", "secret", "twist"]
}

const missionItemSchema = {
    type: Type.OBJECT,
    properties: {
        appearance: { type: Type.STRING },
        origin: { type: Type.STRING },
        wear: { type: Type.STRING },
        quirk: { type: Type.STRING },
        use: { type: Type.STRING },
    },
    required: ["appearance", "origin", "wear", "quirk", "use"]
}

const missionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        categoria: { type: Type.STRING, description: "Deve ser 'Missão/Cenário'" },
        raridade: { type: Type.STRING, description: "A 'raridade' ou impacto da missão, ex: Comum, Raro, Épico, Lendário." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível de desafio sugerido para a missão." },
        logline: { type: Type.STRING },
        summary: { type: Type.STRING },
        objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
        complications: { type: Type.ARRAY, items: { type: Type.STRING } },
        failure_states: { type: Type.ARRAY, items: { type: Type.STRING } },
        rewards: { type: Type.ARRAY, items: { type: Type.STRING } },
        numberOfSessions: { type: Type.INTEGER },
        environment: { type: Type.STRING, description: "Detalhes sobre a visão, som e cheiro do ambiente principal." },
        protagonist_desc: {
            type: Type.OBJECT,
            properties: {
                silhouette: { type: Type.STRING }, face: { type: Type.STRING }, attire: { type: Type.STRING }, movement: { type: Type.STRING }, defining_feature: { type: Type.STRING },
            }
        },
        oni_desc: {
             type: Type.OBJECT,
            properties: {
                scale: { type: Type.STRING }, skin: { type: Type.STRING }, appendages: { type: Type.STRING }, eyes: { type: Type.STRING }, sound_smell: { type: Type.STRING }, mystic_sign: { type: Type.STRING },
            }
        },
        demonBloodArtType: { type: Type.STRING },
        key_npcs: { type: Type.ARRAY, items: missionNpcSchema },
        relevant_items: { type: Type.ARRAY, items: missionItemSchema },
        scaling_hooks: { type: Type.STRING, description: "Ganchos para missões futuras e como a ameaça pode escalar." },
        tone_variations: { type: Type.OBJECT, description: "Como a missão mudaria com tons de 'Horror', 'Ação' e 'Mistério'." },
        sensitive_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
        micro_variants: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 pequenas variações, como 'O alvo é um traidor' ou 'O NPC chave está mentindo'." },
    },
    required: ["title", "categoria", "raridade", "nivel_sugerido", "logline", "summary", "objectives", "complications", "failure_states", "rewards", "numberOfSessions", "environment", "key_npcs", "scaling_hooks"]
}

const npcSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING },
        categoria: { type: Type.STRING, description: "Deve ser 'NPC'" },
        raridade: { type: Type.STRING, description: "A 'raridade' ou importância do NPC, ex: Comum, Raro, Lendário." },
        nivel_sugerido: { type: Type.INTEGER, description: "Nível de desafio/importância do NPC." },
        descricao_curta: { type: Type.STRING, description: "Aparência curta do NPC." },
        descricao: { type: Type.STRING, description: "Aparência completa e detalhada e história de fundo do NPC." },
        role: { type: Type.STRING, description: "O papel do NPC na história (ex: 'Vendedor Misterioso', 'Guarda Leal', 'Informante Ardiloso')." },
        profession: { type: Type.STRING },
        origem: { type: Type.STRING, description: "A origem do NPC, que molda sua visão de mundo. Ex: 'Samurai', 'Isolado', 'Civilizado'." },
        voice_and_mannerisms: { type: Type.STRING, description: "Como o NPC fala e se comporta." },
        inventory_focal: { type: Type.STRING, description: "Um item importante ou propriedade que o NPC possui." },
        motivation: { type: Type.STRING, description: "O que impulsiona as ações do NPC." },
        secret: { type: Type.STRING, description: "Um segredo que o NPC esconde." },
        relationship_to_pcs: { type: Type.STRING, description: "A relação inicial do NPC com os personagens dos jogadores." },
        ganchos_narrativos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Três ganchos de missão/plot prontos envolvendo o NPC." },
        dialogue_lines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Três exemplos de falas do NPC." },
    },
    required: ["nome", "categoria", "raridade", "nivel_sugerido", "descricao_curta", "descricao", "role", "profession", "voice_and_mannerisms", "inventory_focal", "motivation", "secret", "relationship_to_pcs", "ganchos_narrativos", "dialogue_lines", "origem"]
};

// Schemas for World Building
const wbPlotThreadSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
    },
    required: ["title", "description"]
};

const wbKeyNpcSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        role: { type: Type.STRING },
        description: { type: Type.STRING },
    },
    required: ["name", "role", "description"]
};

const wbPointOfInterestSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING, description: "Ex: 'Vila Oculta', 'Ruína Amaldiçoada', 'Mercado Negro'" },
        description: { type: Type.STRING },
    },
    required: ["name", "type", "description"]
};

const wbMiniMissionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        objective: { type: Type.STRING },
        reward: { type: Type.STRING },
    },
    required: ["title", "objective", "reward"]
};

const worldBuildingSchema = {
    type: Type.OBJECT,
    properties: {
        nome: { type: Type.STRING, description: "Um nome temático para o conceito de world building. Ex: 'O Lamento da Lua de Sangue', 'As Cicatrizes de Ferro'." },
        categoria: { type: Type.STRING, description: "Deve ser 'World Building'" },
        raridade: { type: Type.STRING, description: "A 'raridade' deve ser 'N/A' para esta categoria." },
        nivel_sugerido: { type: Type.INTEGER, description: "O 'nivel_sugerido' deve ser 0 para esta categoria." },
        descricao_curta: { type: Type.STRING, description: "Um parágrafo de introdução ao cenário ou situação." },
        plot_threads: { type: Type.ARRAY, items: wbPlotThreadSchema, description: "Exatamente 3 tramas principais que podem conduzir uma campanha." },
        adventure_hooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exatamente 5 ganchos de aventura diretos para iniciar uma sessão." },
        key_npcs_wb: { type: Type.ARRAY, items: wbKeyNpcSchema, description: "Exatamente 4 NPCs importantes, com seus papéis e descrições." },
        points_of_interest: { type: Type.ARRAY, items: wbPointOfInterestSchema, description: "Exatamente 3 locais de interesse com descrições." },
        mini_missions: { type: Type.ARRAY, items: wbMiniMissionSchema, description: "Exatamente 2 mini-missões prontas para jogar." },
    },
    required: ["nome", "categoria", "descricao_curta", "plot_threads", "adventure_hooks", "key_npcs_wb", "points_of_interest", "mini_missions", "raridade", "nivel_sugerido"]
};

const getResponseSchema = (category: string) => {
    let itemSchema;
    switch (category) {
        case 'Local/Cenário':
            itemSchema = locationSchema;
            break;
        case 'Missão/Cenário':
            itemSchema = missionSchema;
            break;
        case 'NPC':
            itemSchema = npcSchema;
            break;
        case 'Caçador':
            itemSchema = hunterSchema;
            break;
        case 'Inimigo/Oni':
            itemSchema = oniSchema;
            break;
        case 'World Building':
            itemSchema = worldBuildingSchema;
            break;
        case 'Forma de Respiração':
            itemSchema = breathingFormSchema;
            break;
        default:
            itemSchema = baseItemSchema;
    }
    
    return {
        type: Type.OBJECT,
        properties: {
            items: {
                type: Type.ARRAY,
                items: itemSchema,
            },
        },
        required: ["items"]
    };
};

/**
 * Helper function to interpret a filter value. If it's 'Aleatório' or empty,
 * it returns a descriptive string for the AI. Otherwise, it returns the value itself.
 * @param value The filter value from the state.
 * @param instruction The instruction for the AI if the value is random/empty.
 * @param defaultValue A default value to use if the instruction is not desired.
 */
const getFilterInstruction = (value: string | undefined | null, instruction: string): string => {
    if (!value || value === 'Aleatório' || value === 'Aleatória') {
        return instruction;
    }
    return value;
};

const buildItemGenerationPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    let prompt = `Você é um mestre de RPG e escritor criativo, especializado no universo de Demon Slayer (Kimetsu no Yaiba).
Sua tarefa é gerar ${count} item(s) de RPG detalhado(s) com base nos filtros fornecidos.
A resposta DEVE ser um objeto JSON, seguindo o schema fornecido.
Seja criativo, evocativo e forneça detalhes que inspirem a narrativa e a jogabilidade.
`;

    switch(filters.category) {
        case 'Caçador':
            prompt = `Você é um mestre de RPG e escritor criativo, especializado no universo de Demon Slayer (Kimetsu no Yaiba).
Sua tarefa é gerar um Caçador de Onis completo e memorável, seguindo estritamente a estrutura JSON fornecida.
O personagem deve ser único, inspirado nos filtros, e pronto para ser usado em uma campanha de RPG. A notoriedade/raridade do caçador deve ser inferida criativamente a partir dos filtros, não é uma entrada direta.

**Filtros a serem utilizados:**
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era ou estilo visual apropriado')}
- **Origem**: ${getFilterInstruction(filters.origem, 'uma origem criativa e adequada')}
- **Arquétipo/Classe**: ${getFilterInstruction(filters.hunterArchetype, 'um arquétipo de caçador interessante')}
- **Personalidade**: ${getFilterInstruction(filters.hunterPersonality, 'uma personalidade marcante')}
- **Arma Principal**: ${getFilterInstruction(filters.hunterWeapon, 'uma arma principal adequada')}
- **Estilos de Respiração**: ${filters.hunterBreathingStyles.length > 0 ? filters.hunterBreathingStyles.join(', ') : 'um ou dois estilos de respiração que combinem com o personagem'}
- **Tom do Personagem**: ${filters.hunterTone}

**Instruções Detalhadas:**
1.  **Coerência Total**: Todos os campos devem ser coerentes entre si. A Origem, Arquétipo, Personalidade, Arma, Respiração e Tom devem se refletir na história, aparência e habilidades.
2.  **Arquétipo (Classe)**: Use o arquétipo como a principal inspiração para o estilo de luta e a história do personagem.
3.  **Personalidade e Tom**: A personalidade e o tom devem ditar o comportamento, o background e os ganchos narrativos.
4.  **Arsenal**: A arma principal DEVE ser a definida no filtro (se não for aleatória). A 'empunhadura' deve descrever o estilo de combate de forma detalhada.
5.  **Habilidades Especiais**: O campo 'respiracao' deve listar o(s) estilo(s) selecionado(s). Se dois estilos forem fornecidos, descreva como o caçador os combina. Forneça exemplos de técnicas únicas.
6.  **Acessório Distintivo**: Crie um acessório único e funcional que complemente a história, aparência ou estilo de luta do caçador.

Preencha todos os campos do schema com criatividade, garantindo um personagem coeso e inspirador.
`;
            break;

        case 'Acessório':
            prompt = `Gere um Acessório para um RPG no estilo Demon Slayer.
O acessório deve ser tematicamente inspirado pelos seguintes filtros:
- **Raridade**: ${getFilterInstruction(filters.rarity, 'uma raridade adequada')}
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}
- **Inspiração (Respiração)**: ${filters.accessoryInspirationBreathing}
- **Inspiração (Kekkijutsu)**: ${filters.accessoryInspirationKekkijutsu}
- **Inspiração (Arma)**: ${filters.accessoryWeaponInspiration}
- **Inspiração (Origem)**: ${getFilterInstruction(filters.accessoryOriginInspiration, 'uma origem adequada')}

Crie um item que combine essas influências de forma criativa. Por exemplo, um acessório inspirado na 'Respiração das Chamas' e na 'Katana' poderia ser uma guarda de espada que emite calor. Um acessório inspirado na origem 'Ninja' e no Kekkijutsu 'Controle de Sombras' poderia ser uma máscara que permite ao usuário se misturar com as sombras. Seja criativo.
`;
            break;

        case 'Arma':
             prompt = `Gere uma Arma para um RPG no estilo Demon Slayer.
A arma deve ser criada com base nos seguintes filtros:
- **Raridade**: ${getFilterInstruction(filters.rarity, 'uma raridade adequada')}
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}
- **Cor do Metal (Lâmina Nichirin)**: ${getFilterInstruction(filters.weaponMetalColor, 'uma cor de metal significativa')}

Descreva a aparência da arma, especialmente a cor da lâmina, e crie efeitos mecânicos e ganchos narrativos que correspondam à sua raridade e estilo. Se a cor for aleatória, escolha uma que combine com a arma.
`;
            break;
            
        case 'Local/Cenário':
            prompt = `Você é um mestre de RPG e escritor criativo, especializado em criar cenários vívidos no universo de Demon Slayer (Kimetsu no Yaiba).
Sua tarefa é gerar UM Local/Cenário detalhado, seguindo estritamente a estrutura JSON fornecida e os filtros abaixo.

**Filtros Obrigatórios:**
- **Era/Estilo do Mundo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}
- **Tom e Atmosfera**: ${filters.locationTone}
- **País/Cultura de Inspiração**: ${getFilterInstruction(filters.locationCountry, 'um país ou cultura interessante')}
- **Tipo de Terreno**: ${getFilterInstruction(filters.locationTerrain, 'um tipo de terreno adequado')}

**Instruções de Geração:**
1.  **Coerência Temática**: O local gerado DEVE refletir todos os filtros. Por exemplo, um local 'Steampunk' com tom de 'terror' em um 'Pântano Nebuloso' deve ter descrições de máquinas enferrujadas e abandonadas envoltas em névoa, com perigos mecânicos e uma atmosfera opressiva.
2.  **Descrição Vívida**: Descreva a aparência, o clima, os sons e os cheiros do local.
3.  **Ganchos Narrativos**: Os ganchos de aventura devem estar diretamente ligados às características do local.
4.  **Preenchimento do JSON**: Preencha OBRIGATÓRIAMENTE os campos 'pais', 'terreno', e 'tom_local' no JSON com os valores correspondentes aos filtros ou com a escolha feita pela IA caso o filtro seja 'Aleatório'.

Crie um local único e inspirador que seja uma consequência direta da combinação dos filtros fornecidos.
`;
            break;

        case 'World Building':
            prompt = `Gere um pacote de World Building para um RPG de mesa no universo de Demon Slayer. O objetivo é fornecer a um mestre de jogo um conjunto de ideias prontas e interligadas para iniciar uma campanha ou um arco de história.
A resposta DEVE ser um objeto JSON, seguindo estritamente o schema fornecido.

**Filtros para inspirar o cenário:**
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}
- **Tom**: ${filters.wbTone}
- **País/Cultura de Inspiração**: ${getFilterInstruction(filters.wbCountry, 'um país ou cultura interessante')}
- **Escala da Ameaça**: ${filters.wbScale}

Concentre-se em entregar ideias práticas e inspiradoras, com os seguintes elementos obrigatórios, todos influenciados pelos filtros acima:
1.  **nome**: Um nome evocativo para este cenário/trama.
2.  **descricao_curta**: Um parágrafo introdutório que estabelece o tom e o conceito central.
3.  **plot_threads**: Exatamente 3 tramas principais.
4.  **adventure_hooks**: Exatamente 5 ganchos de aventura.
5.  **key_npcs_wb**: Exatamente 4 NPCs importantes.
6.  **points_of_interest**: Exatamente 3 locais de interesse.
7.  **mini_missions**: Exatamente 2 mini-missões.

Mantenha a coerência entre todos os elementos. Os campos 'raridade' e 'nivel_sugerido' devem ser 'N/A' e 0 respectivamente.
`;
            break;

        case 'Forma de Respiração':
            prompt = `Você é um game designer especialista em RPG de mesa, focado em criar mecânicas balanceadas e temáticas para um sistema de jogo no universo de Demon Slayer.
Sua tarefa é criar UMA NOVA FORMA DERIVADA para uma Respiração existente. NUNCA crie uma nova respiração base.
A resposta DEVE ser um objeto JSON, seguindo estritamente o schema fornecido.

**Contexto para a Criação (Filtros):**
A técnica deve ser adequada para um caçador com o seguinte perfil:
- **Respirações Base para Derivação**: ${filters.baseBreathingStyles.length > 0 ? filters.baseBreathingStyles.join(' e ') : 'uma respiração base adequada'}
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}
- **Arma Preferida**: ${getFilterInstruction(filters.breathingFormWeapon, 'uma arma adequada')}
- **Tom**: ${filters.breathingFormTone}
- **Origem do Caçador**: ${getFilterInstruction(filters.breathingFormOrigin, 'uma origem de caçador adequada')}
- **Arquétipo do Caçador**: ${getFilterInstruction(filters.breathingFormArchetype, 'um arquétipo de caçador adequado')}

**Regras de Geração Obrigatórias:**
1.  **Derivação e Consistência**: A nova forma DEVE derivar da(s) Respiração(ões) Base. Se duas respirações forem fornecidas, crie uma forma híbrida que combine elementos de ambas de forma criativa. O campo 'base_breathing_id' no JSON deve conter o nome da respiração principal ou uma combinação dos nomes (ex: 'Chamas e Vento'). A técnica deve ser tematicamente consistente com o perfil do caçador descrito acima.
2.  **Mecânica Detalhada**: O objeto 'mechanics' DEVE seguir o template do schema, com regras claras de ativação, custo, dano, etc.
3.  **Escala**: O campo 'level_scaling' deve detalhar como os valores mudam com o rank/nível.
4.  **Variantes**: Gere 3 'micro_variants' e as variantes de balanço (leve, padrão, brutal).

Por favor, gere a nova Forma de Respiração Derivada no formato JSON solicitado.
`;
            break;

        case 'Kekkijutsu':
            prompt = `Gere um Kekkijutsu (Arte Demoníaca de Sangue) para um RPG no estilo Demon Slayer. A raridade deve ser adequada à complexidade da arte, não é um filtro.
O Kekkijutsu deve ser tematicamente inspirado pelos seguintes filtros:
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}
- **Inspiração (Kekkijutsu Existente)**: ${filters.kekkijutsuInspiration}
- **Inspiração (Respiração de Caçador)**: ${filters.kekkijutsuInspirationBreathing}
- **Inspiração (Arma)**: ${getFilterInstruction(filters.kekkijutsuWeapon, 'uma arma como inspiração, ou nenhuma')}

Crie uma arte demoníaca que seja uma manifestação sombria e distorcida das inspirações. Por exemplo, um Kekkijutsu inspirado na 'Respiração da Água' pode ser a capacidade de criar lâminas de sangue pressurizado. Um Kekkijutsu inspirado em 'Machado' pode ser a habilidade de cristalizar o sangue em armas pesadas. Seja criativo e detalhado. Use o schema base, focando em 'descricao', 'efeitos_secundarios', e 'ganchos_narrativos'.
`;
            break;

        case 'Inimigo/Oni':
            prompt = `Gere um Oni (demônio) completo e memorável para um RPG de mesa, seguindo estritamente a estrutura JSON solicitada.
O inimigo deve ser uma ameaça única e inspiradora, com sua dificuldade e complexidade baseadas no Nível de Poder solicitado.

**Filtros:**
- **Nível de Poder**: ${getFilterInstruction(filters.oniPowerLevel, 'um nível de poder criativo e adequado')}
- **Arma**: ${getFilterInstruction(filters.oniWeapon, 'uma arma adequada ou garras/punhos')}
- **Inspiração (Respiração)**: ${filters.oniInspirationBreathing}
- **Inspiração (Kekkijutsu)**: ${filters.oniInspirationKekkijutsu}
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}

**Diretrizes de Nível de Poder:**
- **Minion**: Simples, fraco, geralmente em grupos. Kekkijutsu 'Nenhum' ou muito básico. Raridade 'Comum', Nível 1-3.
- **Médio**: Desafio para um caçador novato. Kekkijutsu presente, mas não devastador. Raridade 'Incomum', Nível 4-7.
- **Lua Inferior**: Poderoso, capaz de dominar uma pequena região. Kekkijutsu complexo e perigoso. Raridade 'Raro', Nível 8-12.
- **Lua Minguante**: Um termo para Onis que já foram Luas Inferiores ou estão perto desse poder, mas caíram em desgraça ou estão isolados. Raridade 'Raro' ou 'Épico', Nível 13-16.
- **Lua Superior**: Uma das doze criaturas mais poderosas. Kekkijutsu com potencial para destruir cidades. Uma ameaça de fim de campanha. Raridade 'Lendário', Nível 17-20.

Incorpore as inspirações de forma criativa no design, comportamento e Kekkijutsu do Oni.
`;
            break;

        case 'NPC':
            prompt = `Gere um NPC completo e memorável para um RPG no estilo Demon Slayer.
O NPC deve ser criado com base nos seguintes filtros:
- **Era/Estilo**: ${getFilterInstruction(filters.era, 'uma era apropriada')}
- **Origem**: ${getFilterInstruction(filters.origem, 'uma origem criativa e adequada')}
- **Tom do NPC**: ${filters.missionTone}
- **Profissão**: ${getFilterInstruction(filters.profession, 'uma profissão adequada')}
- **Relação com PJs**: ${getFilterInstruction(filters.relation_with_pcs, 'uma relação inicial interessante')}
- **Nível de Detalhe**: ${filters.level_detail}

A 'descricao_curta' deve ser a aparência física, e a 'descricao' deve ser a história de fundo e personalidade, ambas influenciadas fortemente pela sua Origem.
`;
            break;
            
        case 'Missão/Cenário':
             prompt += `- Tom: ${filters.missionTone}\n`;
             prompt += `- Intensidade (1-5): ${filters.intensity}\n`;
             prompt += `- Escala da Ameaça: ${filters.missionScale}\n`;
             if(filters.protagonist) prompt += `- Protagonista: ${filters.protagonist}\n`;
             if(filters.targets) prompt += `- Alvo: ${filters.targets}\n`;
             if(filters.moodModifiers) prompt += `- Modificadores de Ambiente: ${filters.moodModifiers}\n`;
            break;
        
        default: // 'Arma' and 'Aleatória' fall here
            prompt += `Filtros:\n- Categoria: ${getFilterInstruction(filters.category, 'uma categoria de item interessante')}\n- Raridade: ${getFilterInstruction(filters.rarity, 'uma raridade adequada')}\n- Era: ${getFilterInstruction(filters.era, 'uma era adequada')}\n`;
    }
    
    if (promptModifier) {
        prompt += `\nInstrução Adicional: ${promptModifier}\n`;
    }

    prompt += "\nPor favor, gere os itens no formato JSON solicitado."
    return prompt;
}

// --- End of inlined promptSchemas.ts content ---


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ items: GeneratedItem[] } | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { filters, count = 1, promptModifier } = req.body;

        if (!filters) {
            return res.status(400).json({ message: 'Filtros são obrigatórios.' });
        }

        const aiClient = getAiClient();
        const prompt = buildItemGenerationPrompt(filters, count, promptModifier);
        const schema = getResponseSchema(filters.category);

        const result = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = result.text?.trim();
        if (!jsonText) {
            throw new Error("A resposta da IA estava vazia. A geração pode ter sido bloqueada ou o modelo não produziu uma saída válida.");
        }

        const data = JSON.parse(jsonText);
        
        const items = data.items || [];
        const finalItems = Array.isArray(items) ? items : [items];

        res.status(200).json({ items: finalItems });

    } catch (error) {
        console.error("Erro em /api/generateContent:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
        res.status(500).json({ message: `Falha ao gerar conteúdo. Detalhes: ${errorMessage}` });
    }
}