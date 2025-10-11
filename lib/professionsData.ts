

// FIX: Corrected type import from the now separate types.ts file.
import type { Era } from '../types';

export const PROFESSIONS_BY_ERA: Record<string, string[]> = {
    'Aleatória': ['Aleatória'],
    'Período Edo (Japão Feudal)': [
        'Aleatória', 'Samurai', 'Ninja', 'Ferreiro de Nichirin', 'Comerciante', 'Monge', 'Gueixa', 'Ronin', 'Agricultor', 'Artesão', 'Daimyo', 'Médico Herbalista'
    ],
    'Medieval Fantasia': [
        'Aleatória', 'Cavaleiro', 'Mago', 'Ladrão', 'Clérigo', 'Bardo', 'Ferreiro', 'Alquimista', 'Guarda da cidade', 'Nobre', 'Caçador de Monstros', 'Estalajadeiro'
    ],
    'Steampunk': [
        'Aleatória', 'Inventor', 'Engenheiro de Autômatos', 'Aviador', 'Detetive Particular', 'Operário de Fábrica', 'Aristocrata', 'Contrabandista', 'Mecânico de Dirigíveis', 'Jornalista'
    ],
    'Cyberpunk': [
        'Aleatória', 'Netrunner (Hacker)', 'Samurai de Rua', 'Executivo Corporativo', 'Técnico de Mercado Negro', 'Policial Cibernético', 'Mídia (Repórter)', 'Androide de Prazer', 'Membro de Gangue', 'Contrabandista de Dados'
    ],
    'Pós-apocalíptico': [
        'Aleatória', 'Batedor do Deserto', 'Catador de Sucata', 'Líder de Acampamento', 'Mutante Pária', 'Mecânico de Comboio', 'Curandeiro Tribal', 'Saqueador', 'Comerciante Itinerante', 'Cultista do Fim do Mundo'
    ],
    'Moderno': [
        'Aleatória', 'Detetive', 'Oficial de Polícia', 'Jornalista Investigativo', 'Médico de Emergência', 'Cientista', 'Hacker', 'Agente Secreto', 'CEO de Tecnologia', 'Soldado de Forças Especiais'
    ],
    'Tempos Atuais': [
        'Aleatória', 'Detetive', 'Oficial de Polícia', 'Jornalista Investigativo', 'Médico de Emergência', 'Cientista', 'Hacker', 'Agente Secreto', 'CEO de Tecnologia', 'Soldado de Forças Especiais'
    ],
    'Futurista (Sci-Fi)': [
        'Aleatória', 'Piloto de Caça Estelar', 'Engenheiro de Hiperpropulsão', 'Contrabandista Galáctico', 'Soldado Imperial', 'Xenobiólogo', 'Diplomata Interestelar', 'Androide de Serviço', 'Minerador de Asteroide', 'Caçador de Recompensas'
    ],
    'Biopunk': [
        'Aleatória', 'Bio-hacker', 'Engenheiro Genético', 'Cultista Orgânico', 'Caçador de Replicantes', 'Médico de Clínica Ilegal', 'Híbrido Humano-Animal', 'Agente de Bio-segurança', 'Fazendeiro de Órgãos', 'Contrabandista de Biomods'
    ],
};

// Populate an 'all' category with unique professions from all eras for the 'Aleatória' era filter
const allProfessions = new Set<string>(['Aleatória']);
Object.entries(PROFESSIONS_BY_ERA).forEach(([era, professions]) => {
    if (era !== 'Aleatória') {
        professions.forEach(prof => {
            if (prof !== 'Aleatória') {
                allProfessions.add(prof);
            }
        });
    }
});
PROFESSIONS_BY_ERA.all = Array.from(allProfessions);
