import type { GeneratedItem } from '../types';

const section = (title: string, content?: string | string[] | null, indent = 0) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return '';
    const prefix = ' '.repeat(indent);
    let body = '';
    if (Array.isArray(content)) {
        body = content.map(line => `${prefix}- ${line}`).join('\n');
    } else {
        body = `${prefix}${content}`;
    }
    return `\n${prefix}${title.toUpperCase()}\n${'='.repeat(title.length + indent)}\n${body}\n`;
};

export const buildPlainTextForItem = (item: GeneratedItem): string => {
    if (!item) return "Nenhum item selecionado.";

    const lines: string[] = [];

    lines.push((item.name_pt || item.title || item.nome || 'Item Sem Nome').toUpperCase());
    
    let subheader = `${item.categoria}`;
    if(item.origem) subheader += ` • ${item.origem}`;
    if(item.classe) subheader += ` • ${item.classe}`;
    if(item.power_level) subheader += ` • Nível de Poder: ${item.power_level}`;
    else if(item.raridade && item.raridade !== 'N/A') subheader += ` • ${item.raridade}`;
    if(item.nivel_sugerido && item.nivel_sugerido > 0) subheader += ` (Nível ${item.nivel_sugerido})`;

    lines.push(subheader);
    lines.push('-'.repeat(subheader.length));

    if (item.descricao_curta) lines.push(`\n${item.descricao_curta}\n`);
    
    // Generic Item fields
    if (item.descricao) lines.push(section('Descrição', item.descricao));

    // Hunter
    if (item.personalidade) lines.push(section('Personalidade', item.personalidade));
    if (item.descricao_fisica) lines.push(section('Descrição Física', item.descricao_fisica));
    if (item.background) lines.push(section('Background', item.background));
    if (item.arsenal) {
        const arsenalContent = `Arma: ${item.arsenal.arma}\nEstilo: ${item.arsenal.empunhadura.nome}\n${item.arsenal.empunhadura.descricao}`;
        lines.push(section('Arsenal', arsenalContent));
    }
    if(item.habilidades_especiais){
        const habilidades = `Respiração: ${item.habilidades_especiais.respiracao}\nTécnicas: \n- ${item.habilidades_especiais.variacoes_tecnica.join('\n- ')}`;
        lines.push(section('Habilidades Especiais', habilidades));
    }
    if (item.acessorio) lines.push(section('Acessório', `${item.acessorio.nome}: ${item.acessorio.descricao}`));
    if (item.uso_em_cena) lines.push(section('Uso em Cena', item.uso_em_cena));
    
    // Oni
    if (item.descricao_fisica_detalhada) lines.push(section('Aparência', item.descricao_fisica_detalhada));
    if(item.kekkijutsu && item.kekkijutsu.nome.toLowerCase() !== 'nenhum') lines.push(section('Kekkijutsu', `${item.kekkijutsu.nome}\n${item.kekkijutsu.descricao}`));
    if (item.comportamento_combate) lines.push(section('Comportamento em Combate', item.comportamento_combate));
    if (item.comportamento_fora_combate) lines.push(section('Comportamento Fora de Combate', item.comportamento_fora_combate));
    if (item.fraquezas_unicas) lines.push(section('Fraquezas Únicas', item.fraquezas_unicas));
    if (item.trofeus_loot) lines.push(section('Troféus / Loot', item.trofeus_loot));

    // Generic Mechanics
    const hasMechanics = item.dano || item.dados || item.tipo_de_dano;
    if (hasMechanics) {
         const mechanics = `Dano: ${item.dano || 'N/A'}\nDados: ${item.dados || 'N/A'}\nTipo: ${item.tipo_de_dano || 'N/A'}`;
         lines.push(section('Mecânicas de Combate', mechanics));
    }
    const hasEffects = item.status_aplicado || item.efeitos_secundarios;
     if (hasEffects && item.status_aplicado !== 'Nenhum' && item.efeitos_secundarios !== 'Nenhum') {
         const effects = `Status: ${item.status_aplicado || 'N/A'}\nEfeitos Secundários: ${item.efeitos_secundarios || 'N/A'}`;
         lines.push(section('Efeitos Adicionais', effects));
    }

    // Shared: Ganchos
    if (item.ganchos_narrativos) lines.push(section('Ganchos Narrativos', item.ganchos_narrativos));

    // Breathing Form
    if(item.derivation_type) lines.push(section('Derivação', `${item.derivation_type} da ${item.base_breathing_id}`));
    if(item.description_flavor) lines.push(section('Descrição (Flavor)', item.description_flavor));
    if(item.requirements) {
        const reqs = `Rank Mínimo: ${item.requirements.min_rank}\nCusto: ${item.requirements.exhaustion_cost} Exaustão\nCooldown: ${item.requirements.cooldown}`;
        lines.push(section('Requisitos', reqs));
    }
    if(item.mechanics) {
        const mechs = `Ativação: ${item.mechanics.activation}\nAlvo: ${item.mechanics.target}\nTeste: ${item.mechanics.initial_test.type} vs DC ${item.mechanics.initial_test.dc_formula}`;
        lines.push(section('Mecânicas Principais', mechs));
        if(item.mechanics.damage_formula_rank){
            const damageRanks = Object.entries(item.mechanics.damage_formula_rank).map(([r, f])=>`Rank ${r}: ${f}`).join('\n');
            lines.push(section('Dano por Rank', damageRanks));
        }
    }
    
    // World Building
    if(item.plot_threads) lines.push(section('Tramas Principais', item.plot_threads.map(p => `${p.title}: ${p.description}`)));
    if(item.adventure_hooks) lines.push(section('Ganchos de Aventura', item.adventure_hooks));
    if(item.key_npcs_wb) lines.push(section('NPCs Importantes', item.key_npcs_wb.map(n => `${n.name} (${n.role}): ${n.description}`)));
    if(item.points_of_interest) lines.push(section('Pontos de Interesse', item.points_of_interest.map(p => `${p.name} (${p.type}): ${p.description}`)));
    if(item.mini_missions) lines.push(section('Mini-Missões', item.mini_missions.map(m => `${m.title} (Recompensa: ${m.reward}): ${m.objective}`)));

    return lines.join('\n').trim();
};
