import type { FilterState } from '../types';
import { Type } from '@google/genai';

/**
 * Builds a detailed, contextual prompt for the Gemini API based on the selected category and filters.
 */
export const buildGenerationPrompt = (filters: FilterState, count: number, promptModifier?: string): string => {
    let basePrompt = `Você é um mestre de RPG e escritor criativo especializado no universo de Demon Slayer (Kimetsu no Yaiba), mas com a capacidade de adaptar elementos para diferentes eras e estilos.
Sua tarefa é gerar ${count} item(s) único(s) e detalhado(s) para uma campanha de RPG com base nos seguintes filtros.
A resposta DEVE ser um objeto JSON${count > 1 ? ` contendo uma chave "items" que é um array de objetos` : ''}, seguindo o schema JSON fornecido.
Foque em originalidade e detalhes que inspirem a narrativa.`;

    const activeFilters: Record<string, any> = {};

    const addFilter = (key: string, value: any) => {
        if (value && value !== 'Aleatória' && value !== 'Nenhuma' && value !== '' && (!Array.isArray(value) || value.length > 0)) {
            activeFilters[key] = Array.isArray(value) ? value.join(', ') : value;
        }
    };

    let categorySpecificInstructions = '';

    switch (filters.category) {
        case 'Caçador':
            categorySpecificInstructions = 'Gere um Caçador de Demônios completo. A raridade deve ser inferida com base na combinação de origem, classe e habilidades, não um filtro direto. Inclua um acessório distintivo. Na "descricao_fisica", descreva detalhadamente a aparência do caçador, incluindo como ele porta sua arma principal e a aparência de seu acessório distintivo, integrando-os visualmente ao personagem.';
            addFilter('Era/Estilo', filters.hunterEra);
            addFilter('País/Cultura', filters.hunterCountry);
            addFilter('Origem', filters.hunterOrigin);
            addFilter('Classe (Arquétipo)', filters.hunterArchetype);
            addFilter('Personalidade', filters.hunterPersonality);
            addFilter('Arma', filters.hunterWeapon);
            addFilter('Respirações', filters.hunterBreathingStyles);
            addFilter('Acessório', filters.hunterAccessory);
            break;
        case 'Acessório':
            categorySpecificInstructions = 'Gere um acessório mágico ou amaldiçoado. Descreva sua aparência, poderes e lore.';
            addFilter('Raridade', filters.accessoryRarity);
            addFilter('Era/Estilo', filters.accessoryEra);
            addFilter('País/Cultura', filters.accessoryCountry);
            addFilter('Inspiração (Kekkijutsu)', filters.accessoryKekkijutsuInspiration);
            addFilter('Inspiração (Respiração)', filters.accessoryBreathingInspiration);
            addFilter('Inspiração (Arma)', filters.accessoryWeaponInspiration);
            addFilter('Inspiração (Origem)', filters.accessoryOrigin);
            break;
        case 'Arma':
            categorySpecificInstructions = 'Gere uma arma única. Se for uma arma Nichirin, descreva a cor da lâmina e o que ela representa.';
            addFilter('Tipo de Arma', filters.weaponType);
            addFilter('Raridade', filters.weaponRarity);
            addFilter('País/Cultura', filters.weaponCountry);
            addFilter('Cor do Metal', filters.weaponMetalColor);
            addFilter('Era/Estilo', filters.weaponEra);
            break;
        case 'Local/Cenário':
            categorySpecificInstructions = 'Gere um local ou cenário evocativo. Descreva a atmosfera, pontos de interesse, perigos e segredos.';
            addFilter('Tom', filters.locationTone);
            addFilter('País', filters.locationCountry);
            addFilter('Era/Estilo', filters.locationEra);
            addFilter('Tipo de Terreno', filters.locationTerrain);
            break;
        case 'World Building':
            categorySpecificInstructions = 'Gere as bases para um cenário de campanha. Crie um conceito central, 3 tramas, 2 facções internas, 2 ameaças externas, 3 eventos históricos, 4 tradições/tabus, 3 mistérios, 5 ganchos, 4 NPCs, 3 locais e 2 mini-missões. Os elementos devem ser interconectados e coerentes.';
            addFilter('Tom', filters.wbTone);
            addFilter('País', filters.wbCountry);
            addFilter('Era/Estilo', filters.wbEra);
            addFilter('Escala de Ameaça', filters.wbThreatScale);
            addFilter('Local Principal', filters.wbLocation);
            break;
        case 'Forma de Respiração':
            categorySpecificInstructions = 'Gere uma nova Forma de Respiração derivada. Se mais de uma base for fornecida, crie um estilo híbrido. Detalhe a mecânica como se fosse para um sistema de RPG.';
            addFilter('Respirações Base', filters.baseBreathingStyles);
            addFilter('Arma Associada', filters.breathingFormWeapon);
            addFilter('Era/Estilo', filters.breathingFormEra);
            addFilter('Tom', filters.breathingFormTone);
            addFilter('Origem do Usuário', filters.breathingFormOrigin);
            addFilter('País/Cultura', filters.breathingFormCountry);
            addFilter('Arquétipo de Usuário', filters.breathingFormArchetype);
            break;
        case 'Kekkijutsu':
            categorySpecificInstructions = 'Gere uma Arte Demoníaca de Sangue (Kekkijutsu). A raridade não é aplicável; o poder deve ser o foco. Descreva suas técnicas e manifestações de forma criativa.';
            addFilter('Era/Estilo', filters.kekkijutsuEra);
            addFilter('País/Cultura', filters.kekkijutsuCountry);
            addFilter('Inspiração (Outro Kekkijutsu)', filters.kekkijutsuKekkijutsuInspiration);
            addFilter('Inspiração (Respiração)', filters.kekkijutsuBreathingInspiration);
            addFilter('Inspiração (Arma)', filters.kekkijutsuWeaponInspiration);
            break;
        case 'Inimigo/Oni':
            categorySpecificInstructions = 'Gere um Oni. O nível de poder deve ditar sua complexidade, habilidades e ameaça.';
            addFilter('Nível de Poder', filters.oniPowerLevel);
            addFilter('País/Cultura', filters.oniCountry);
            addFilter('Personalidade', filters.oniPersonality);
            addFilter('Inspiração (Kekkijutsu)', filters.oniInspirationKekkijutsu);
            addFilter('Inspiração (Respiração)', filters.oniInspirationBreathing);
            addFilter('Arma', filters.oniWeapon);
            break;
        case 'NPC':
             categorySpecificInstructions = 'Gere um NPC (Personagem Não-Jogador). Detalhe sua aparência, personalidade, motivações e segredos. Se uma arma for especificada, integre-a de forma que faça sentido com a profissão do NPC.';
             addFilter('Era', filters.npcEra);
             addFilter('País/Cultura', filters.npcCountry);
             addFilter('Origem', filters.npcOrigin);
             addFilter('Profissão', filters.npcProfession);
             addFilter('Personalidade', filters.npcPersonality);
             addFilter('Arma', filters.npcWeapon);
             break;
        default:
            addFilter('Categoria', filters.category);
            break;
    }

    let prompt = `${basePrompt}\n\n**Instruções Específicas:**\n${categorySpecificInstructions}\n\n**Filtros Ativos:**\n`;
    const filterEntries = Object.entries(activeFilters);
    if (filterEntries.length > 0) {
        prompt += filterEntries.map(([key, value]) => `- ${key}: ${value}`).join('\n');
    } else {
        prompt += '- Nenhum filtro específico aplicado. Use sua criatividade dentro da categoria solicitada.';
    }

    if (promptModifier) {
        prompt += `\n\n**Modificador Adicional:**\n${promptModifier}`;
    }
    
    return prompt;
};

/**
 * Builds the JSON schema for the AI response based on the category.
 */
export const buildResponseSchema = (filters: FilterState, count: number) => {
    let itemProperties: any = {
        nome: { type: Type.STRING, description: 'O nome do item/personagem/lugar.' },
        categoria: { type: Type.STRING, description: 'A categoria, deve ser igual à solicitada.', enum: [filters.category] },
        era: { type: Type.STRING, description: 'A era/estilo do item, conforme filtro se aplicável.' },
        descricao_curta: { type: Type.STRING, description: 'Uma descrição concisa e evocativa de 1-2 frases.' },
        descricao: { type: Type.STRING, description: 'Uma descrição detalhada com background, aparência e lore.' },
        raridade: { type: Type.STRING, description: "A raridade do item. Pode ser 'N/A' se não aplicável." },
        nivel_sugerido: { type: Type.NUMBER, description: "O nível de poder ou de personagem sugerido para este item." },
    };
    let requiredFields = ['nome', 'categoria', 'era', 'descricao_curta', 'descricao', 'raridade', 'nivel_sugerido'];

    // Add category-specific properties
    switch (filters.category) {
        case 'Arma':
        case 'Acessório':
            itemProperties = { ...itemProperties,
                dano: { type: Type.STRING },
                dados: { type: Type.STRING },
                tipo_de_dano: { type: Type.STRING },
                status_aplicado: { type: Type.STRING, description: "Efeito ou condição que a arma aplica." },
                efeitos_secundarios: { type: Type.STRING, description: "Habilidades passivas ou ativas adicionais." },
                ganchos_narrativos: { type: Type.STRING, description: "Ideias de como integrar o item na história." },
            };
            requiredFields.push('dano', 'dados');
            break;

        case 'Caçador':
             itemProperties = { ...itemProperties,
                classe: { type: Type.STRING, description: "O arquétipo ou classe do caçador." },
                personalidade: { type: Type.STRING },
                descricao_fisica: { type: Type.STRING, description: "Descrição visual detalhada do caçador, incluindo traços faciais, cabelo, porte físico, cicatrizes, vestimentas e, crucialmente, como ele carrega sua arma e a aparência de seu acessório no corpo." },
                background: { type: Type.STRING, description: "A história de origem do caçador." },
                arsenal: { type: Type.OBJECT, properties: { arma: { type: Type.STRING }, empunhadura: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } }, required: ['nome', 'descricao'] } }, required: ['arma', 'empunhadura'] },
                habilidades_especiais: { type: Type.OBJECT, properties: { respiracao: { type: Type.STRING }, variacoes_tecnica: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['respiracao'] },
                acessorio: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } }, required: ['nome', 'descricao'] },
                ganchos_narrativos: { type: Type.ARRAY, items: { type: Type.STRING } },
                uso_em_cena: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Como um mestre pode usar este personagem em uma cena." },
             };
            requiredFields.push('classe', 'personalidade', 'background', 'ganchos_narrativos', 'descricao_fisica');
            break;
        
        case 'Inimigo/Oni':
            itemProperties = { ...itemProperties,
                power_level: { type: Type.STRING, description: "Nível de poder do Oni, ex: Lua Inferior, Oni Comum." },
                descricao_fisica_detalhada: { type: Type.STRING },
                kekkijutsu: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } }, required: ['nome', 'descricao'] },
                comportamento_combate: { type: Type.ARRAY, items: { type: Type.STRING } },
                comportamento_fora_combate: { type: Type.ARRAY, items: { type: Type.STRING } },
                fraquezas_unicas: { type: Type.ARRAY, items: { type: Type.STRING } },
                trofeus_loot: { type: Type.ARRAY, items: { type: Type.STRING } },
                ganchos_narrativos: { type: Type.ARRAY, items: { type: Type.STRING } },
            };
            requiredFields.push('power_level', 'kekkijutsu', 'comportamento_combate');
            break;

        case 'NPC':
            itemProperties = { ...itemProperties,
                origem: { type: Type.STRING },
                profession: { type: Type.STRING },
                voice_and_mannerisms: { type: Type.STRING, description: "Como o NPC fala e se comporta." },
                inventory_focal: { type: Type.STRING, description: "Um item importante que o NPC carrega." },
                motivation: { type: Type.STRING, description: "O principal objetivo do NPC." },
                secret: { type: Type.STRING, description: "Um segredo que o NPC esconde." },
                dialogue_lines: { type: Type.ARRAY, items: { type: Type.STRING } },
                ganchos_narrativos: { type: Type.ARRAY, items: { type: Type.STRING } },
            };
            requiredFields.push('origem', 'profession', 'motivation', 'secret');
            break;

        case 'Forma de Respiração':
            itemProperties = { ...itemProperties,
                base_breathing_id: { type: Type.STRING, description: "A respiração da qual esta forma deriva." },
                derivation_type: { type: Type.STRING, description: "Tipo de derivação, ex: Híbrida, Evoluída." },
                name_native: { type: Type.STRING, description: "Nome no idioma original (ex: japonês)." },
                description_flavor: { type: Type.STRING, description: "Descrição narrativa e visual da forma." },
                requirements: { type: Type.OBJECT, properties: { min_rank: { type: Type.STRING }, exhaustion_cost: { type: Type.STRING }, cooldown: { type: Type.STRING } }, required: ['min_rank', 'exhaustion_cost', 'cooldown'] },
                mechanics: { type: Type.OBJECT, properties: { activation: { type: Type.STRING }, target: { type: Type.STRING }, initial_test: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, dc_formula: { type: Type.STRING } }, required: ['type', 'dc_formula'] }, on_success_target: { type: Type.STRING }, on_fail_target: { type: Type.STRING }, damage_formula_rank: { type: Type.OBJECT, description: "Objeto com rank como chave e fórmula de dano como valor." } }, required: ['activation', 'target', 'initial_test'] },
                level_scaling: { type: Type.OBJECT, description: "Objeto descrevendo como a habilidade escala com o nível/rank." },
                micro_variants: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pequenas variações ou customizações da forma." },
            };
            requiredFields.push('base_breathing_id', 'description_flavor', 'requirements', 'mechanics');
            break;

        case 'Kekkijutsu':
            itemProperties = { ...itemProperties,
                dano: { type: Type.STRING },
                dados: { type: Type.STRING },
                tipo_de_dano: { type: Type.STRING },
                status_aplicado: { type: Type.STRING },
                efeitos_secundarios: { type: Type.STRING },
                ganchos_narrativos: { type: Type.STRING },
            };
            requiredFields.push('dano');
            break;

        case 'Local/Cenário':
            itemProperties.ganchos_narrativos = { type: Type.STRING };
            break;

        case 'Missão/Cenário':
            const missionNpcSchema = { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, role: { type: Type.STRING }, dialogue_example: { type: Type.STRING }, physical_trait: { type: Type.STRING }, goal: { type: Type.STRING }, secret: { type: Type.STRING }, twist: { type: Type.STRING } }, required: ['name', 'role', 'goal', 'secret'] };
            const missionItemSchema = { type: Type.OBJECT, properties: { appearance: { type: Type.STRING }, origin: { type: Type.STRING }, wear: { type: Type.STRING }, quirk: { type: Type.STRING }, use: { type: Type.STRING } }, required: ['appearance', 'use'] };
            itemProperties = { ...itemProperties,
                title: { type: Type.STRING }, logline: { type: Type.STRING }, summary: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } }, complications: { type: Type.ARRAY, items: { type: Type.STRING } }, failure_states: { type: Type.ARRAY, items: { type: Type.STRING } }, rewards: { type: Type.ARRAY, items: { type: Type.STRING } },
                numberOfSessions: { type: Type.NUMBER }, environment: { type: Type.STRING },
                protagonist_desc: { type: Type.OBJECT, properties: { silhouette: { type: Type.STRING }, face: { type: Type.STRING }, attire: { type: Type.STRING }, movement: { type: Type.STRING }, defining_feature: { type: Type.STRING } } },
                oni_desc: { type: Type.OBJECT, properties: { scale: { type: Type.STRING }, skin: { type: Type.STRING }, appendages: { type: Type.STRING }, eyes: { type: Type.STRING }, sound_smell: { type: Type.STRING }, mystic_sign: { type: Type.STRING } } },
                demonBloodArtType: { type: Type.STRING },
                key_npcs: { type: Type.ARRAY, items: missionNpcSchema },
                relevant_items: { type: Type.ARRAY, items: missionItemSchema },
                scaling_hooks: { type: Type.STRING },
                tone_variations: { type: Type.OBJECT, description: "Variações da missão com diferentes tons." },
                sensitive_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
                tone: { type: Type.STRING },
            };
            requiredFields = ['nome', 'categoria', 'era', 'descricao_curta', 'title', 'logline', 'summary', 'objectives'];
            break;

        case 'World Building':
            const wbPlotSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['title', 'description'] };
            const wbNpcSchema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['name', 'role'] };
            const wbPoiSchema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['name', 'type'] };
            const wbMissionSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING }, objective: { type: Type.STRING }, reward: { type: Type.STRING } }, required: ['title', 'objective'] };
            const wbFactionSchema = { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, objetivo: { type: Type.STRING }, descricao: { type: Type.STRING } }, required: ['nome', 'objetivo', 'descricao'] };
            const wbThreatSchema = { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, tipo: { type: Type.STRING }, descricao: { type: Type.STRING } }, required: ['nome', 'tipo', 'descricao'] };
            const wbHistorySchema = { type: Type.OBJECT, properties: { evento: { type: Type.STRING }, impacto: { type: Type.STRING } }, required: ['evento', 'impacto'] };
            
            itemProperties = { ...itemProperties,
                plot_threads: { type: Type.ARRAY, items: wbPlotSchema },
                adventure_hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                key_npcs_wb: { type: Type.ARRAY, items: wbNpcSchema },
                points_of_interest: { type: Type.ARRAY, items: wbPoiSchema },
                mini_missions: { type: Type.ARRAY, items: wbMissionSchema },
                faccoes_internas: { type: Type.ARRAY, items: wbFactionSchema },
                ameacas_externas: { type: Type.ARRAY, items: wbThreatSchema },
                tradicoes_culturais: { type: Type.ARRAY, items: { type: Type.STRING } },
                eventos_historicos_chave: { type: Type.ARRAY, items: wbHistorySchema },
                misterios_segredos: { type: Type.ARRAY, items: { type: Type.STRING } },
            };
            requiredFields.push('plot_threads', 'adventure_hooks', 'key_npcs_wb', 'points_of_interest', 'faccoes_internas', 'ameacas_externas');
            break;
    }

    const itemSchema = {
        type: Type.OBJECT,
        properties: itemProperties,
        required: requiredFields,
    };
    
    if (count > 1) {
        return {
            type: Type.OBJECT,
            properties: {
                items: {
                    type: Type.ARRAY,
                    items: itemSchema,
                },
            },
            required: ['items'],
        };
    }

    return itemSchema;
};