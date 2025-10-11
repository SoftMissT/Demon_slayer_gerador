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
        if (value && value !== 'Aleatória' && value !== 'Nenhuma' && (!Array.isArray(value) || value.length > 0)) {
            activeFilters[key] = Array.isArray(value) ? value.join(', ') : value;
        }
    };

    let categorySpecificInstructions = '';

    switch (filters.category) {
        case 'Caçador':
            categorySpecificInstructions = 'Gere um Caçador de Demônios completo. A raridade deve ser inferida com base na combinação de origem, classe e habilidades, não um filtro direto. Inclua um acessório distintivo.';
            addFilter('Arma', filters.hunterWeapon);
            addFilter('Respirações', filters.hunterBreathingStyles);
            addFilter('Acessório', filters.hunterAccessory);
            addFilter('Era/Estilo', filters.hunterEra);
            addFilter('Personalidade', filters.hunterPersonality);
            addFilter('Origem', filters.hunterOrigin);
            addFilter('Classe (Arquétipo)', filters.hunterArchetype);
            break;
        case 'Acessório':
            categorySpecificInstructions = 'Gere um acessório mágico ou amaldiçoado. Descreva sua aparência, poderes e lore.';
            addFilter('Raridade', filters.accessoryRarity);
            addFilter('Era/Estilo', filters.accessoryEra);
            addFilter('Inspiração (Kekkijutsu)', filters.accessoryKekkijutsuInspiration);
            addFilter('Inspiração (Respiração)', filters.accessoryBreathingInspiration);
            addFilter('Inspiração (Arma)', filters.accessoryWeaponInspiration);
            addFilter('Inspiração (Origem)', filters.accessoryOrigin);
            break;
        case 'Arma':
            categorySpecificInstructions = 'Gere uma arma única. Se for uma arma Nichirin, descreva a cor da lâmina e o que ela representa.';
            addFilter('Tipo de Arma', filters.weaponType);
            addFilter('Raridade', filters.weaponRarity);
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
            categorySpecificInstructions = 'Gere as bases para um cenário de campanha. Crie um conceito central, 3 tramas, 5 ganchos, 4 NPCs, 3 locais e 2 mini-missões.';
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
            addFilter('Origem Cultural', filters.breathingFormOrigin);
            addFilter('Arquétipo de Usuário', filters.breathingFormArchetype);
            break;
        case 'Kekkijutsu':
            categorySpecificInstructions = 'Gere uma Arte Demoníaca de Sangue (Kekkijutsu). A raridade não é aplicável; o poder deve ser o foco. Descreva suas técnicas e manifestações de forma criativa.';
            addFilter('Era/Estilo', filters.kekkijutsuEra);
            addFilter('Inspiração (Outro Kekkijutsu)', filters.kekkijutsuKekkijutsuInspiration);
            addFilter('Inspiração (Respiração)', filters.kekkijutsuBreathingInspiration);
            addFilter('Inspiração (Arma)', filters.kekkijutsuWeaponInspiration);
            break;
        case 'Inimigo/Oni':
            categorySpecificInstructions = 'Gere um Oni. O nível de poder deve ditar sua complexidade, habilidades e ameaça.';
            addFilter('Nível de Poder', filters.oniPowerLevel);
            addFilter('Inspiração (Kekkijutsu)', filters.oniInspirationKekkijutsu);
            addFilter('Inspiração (Respiração)', filters.oniInspirationBreathing);
            addFilter('Arma', filters.oniWeapon);
            break;
        case 'NPC':
             categorySpecificInstructions = 'Gere um NPC (Personagem Não-Jogador). Detalhe sua aparência, personalidade, motivações e segredos.';
             addFilter('Origem', filters.npcOrigin);
             addFilter('Era', filters.npcEra);
             addFilter('Profissão', filters.npcProfession);
             break;
        default:
            addFilter('Categoria', filters.category);
            // FIX: Removed incorrect reference to a generic 'era' property which does not exist on FilterState.
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
        // FIX: Added 'era' to the base schema to ensure it's returned by the API.
        era: { type: Type.STRING, description: 'A era/estilo do item, conforme filtro se aplicável.' },
        descricao_curta: { type: Type.STRING, description: 'Uma descrição concisa e evocativa de 1-2 frases.' },
        descricao: { type: Type.STRING, description: 'Uma descrição detalhada com background, aparência e lore.' },
    };
    // FIX: Added 'era' to the required fields.
    let requiredFields = ['nome', 'categoria', 'era', 'descricao_curta', 'descricao'];

    // Add category-specific properties
    switch (filters.category) {
        case 'Arma':
        case 'Acessório':
            itemProperties = { ...itemProperties,
                raridade: { type: Type.STRING, enum: ['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Amaldiçoado'] },
                nivel_sugerido: { type: Type.NUMBER },
                dano: { type: Type.STRING },
                dados: { type: Type.STRING },
                tipo_de_dano: { type: Type.STRING },
                status_aplicado: { type: Type.STRING },
                efeitos_secundarios: { type: Type.STRING },
                ganchos_narrativos: { type: Type.STRING },
            };
            requiredFields.push('raridade', 'nivel_sugerido', 'dano', 'dados');
            break;

        case 'Caçador':
             itemProperties = { ...itemProperties,
                raridade: { type: Type.STRING, description: "Inferida, não baseada em filtro." },
                nivel_sugerido: { type: Type.NUMBER },
                classe: { type: Type.STRING },
                personalidade: { type: Type.STRING },
                descricao_fisica: { type: Type.STRING },
                background: { type: Type.STRING },
                arsenal: { type: Type.OBJECT, properties: { arma: { type: Type.STRING }, empunhadura: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } } } } },
                habilidades_especiais: { type: Type.OBJECT, properties: { respiracao: { type: Type.STRING }, variacoes_tecnica: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                acessorio: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, descricao: { type: Type.STRING } } },
                ganchos_narrativos: { type: Type.ARRAY, items: { type: Type.STRING } },
                uso_em_cena: { type: Type.ARRAY, items: { type: Type.STRING } },
             };
            requiredFields.push('raridade', 'nivel_sugerido', 'classe', 'personalidade', 'background', 'ganchos_narrativos');
            break;
        
        // Add schemas for all other categories...
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