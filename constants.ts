// constants.ts
import { CATEGORIES, RARITIES } from './types';
import { PROFESSIONS_BY_TEMATICA } from './lib/professionsData';
import { ORIGINS_DATA } from './lib/originsData';
import { BREATHING_STYLES_DATA } from './lib/breathingStylesData';
import { WEAPON_TYPES, GRIP_TYPES } from './lib/weaponData';
import { TEMATICAS_DATA } from './lib/tematicasData';

export const APP_NAME = 'Kimetsu Forge';

export const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c, label: c }));
export const RARITY_OPTIONS = RARITIES.map(r => ({ value: r, label: r }));

export const THEME_OPTIONS = TEMATICAS_DATA;

export const ORIGIN_OPTIONS = ORIGINS_DATA.map(o => ({ value: o.nome, label: o.nome }));
export const BREATHING_STYLE_OPTIONS = BREATHING_STYLES_DATA.map(b => ({ value: b.nome, label: b.nome }));
export const WEAPON_TYPE_OPTIONS = WEAPON_TYPES.map(w => ({ value: w.name, label: w.name }));
export const GRIP_TYPE_OPTIONS = GRIP_TYPES.map(g => ({ value: g.name, label: g.name }));
export const PROFESSION_OPTIONS = PROFESSIONS_BY_TEMATICA.all.map(p => ({ value: p, label: p }));