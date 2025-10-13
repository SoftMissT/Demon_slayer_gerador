import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import type { GeneratedItem, User } from '../types';

// In-memory cache for the whitelist
let whitelistedIds: Set<string> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const TARGET_SHEET_NAME = 'discord_id';

// Shared JWT client to avoid re-creating it on every call
let jwtClient: JWT | null = null;

// The full header row for the log sheet.
const LOG_HEADERS = [
    'nome_usuario', 'timestamp', 'id', 'categoria', 'nome', 'descricao_curta', 'raridade', 'nivel_sugerido', 'tematica', 'image_prompt',
    // Weapon
    'arma_dano', 'arma_tipo_de_dano', 'arma_status_aplicado', 'arma_efeitos_secundarios',
    // Accessory
    'acessorio_efeitos_passivos', 'acessorio_efeitos_ativos', 'acessorio_condicao_ativacao',
    // Kekkijutsu
    'kekkijutsu_dano', 'kekkijutsu_tipo_de_dano', 'kekkijutsu_status_aplicado', 'kekkijutsu_efeitos_secundarios',
    // Hunter
    'cacador_classe', 'cacador_personalidade', 'cacador_background',
    // Oni
    'oni_power_level', 'oni_kekkijutsu_nome', 'oni_kekkijutsu_descricao', 'oni_fraquezas_unicas',
    // NPC
    'npc_origem', 'npc_motivacao', 'npc_segredo', 'npc_profissao',
    // Mission
    'missao_titulo', 'missao_logline', 'missao_objetivos',
    // World Building
    'wb_plot_threads', 'wb_faccoes', 'wb_ameacas',
    // Event
    'evento_level', 'evento_threat_level', 'evento_tipo',
    // Breathing Form
    'respiracao_base', 'respiracao_mecanicas',
    'dados_completos_json'
];

function getJwtClient(): JWT {
    if (jwtClient) {
        return jwtClient;
    }
    
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!serviceAccountEmail || !privateKey) {
        throw new Error('As credenciais da conta de serviço do Google (EMAIL, PRIVATE_KEY) não estão configuradas corretamente nas variáveis de ambiente.');
    }

    jwtClient = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    return jwtClient;
}

async function getWhitelistedIds(): Promise<Set<string>> {
    const now = Date.now();
    if (whitelistedIds && (now - lastFetchTime < CACHE_DURATION)) {
        console.log('Whitelist successfully served from cache.');
        return whitelistedIds;
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
        throw new Error('A variável de ambiente GOOGLE_SHEET_ID não está definida.');
    }

    try {
        const auth = getJwtClient();
        const sheets = google.sheets({ version: 'v4', auth });
        
        const spreadsheetMeta = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
        });
        
        const sheetExists = spreadsheetMeta.data.sheets?.some(
            sheet => sheet.properties?.title === TARGET_SHEET_NAME
        );

        if (!sheetExists) {
            const availableSheets = spreadsheetMeta.data.sheets?.map(s => `"${s.properties?.title}"`).join(', ') || 'Nenhuma aba encontrada';
            throw new Error(`A planilha foi encontrada, mas a aba com o nome exato "${TARGET_SHEET_NAME}" não existe. Abas disponíveis: [${availableSheets}]. Verifique se há erros de digitação ou espaços extras.`);
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${TARGET_SHEET_NAME}!B2:B`, 
        });

        const rows = response.data.values;
        const newIdSet = new Set<string>();
        if (rows && rows.length > 0) {
            rows.flat().forEach(cellValue => {
                const id = String(cellValue).trim();
                if (id) {
                    newIdSet.add(id);
                }
            });
        }
        
        whitelistedIds = newIdSet;
        lastFetchTime = Date.now();
        
        if (whitelistedIds.size > 0) {
            console.log(`Whitelist successfully refreshed. Found ${whitelistedIds.size} authorized IDs.`);
        } else {
            console.log('Whitelist successfully refreshed. 0 IDs found (the sheet might be empty).');
        }

        return whitelistedIds;

    } catch (error: any) {
        console.error('Original Google Sheets API Error:', error.code, error.message);
        
        if (error.message.startsWith('A planilha foi encontrada, mas a aba')) {
            throw error;
        }

        let detailedErrorMessage = 'Falha ao buscar la lista de autorização.';

        if (error.message) {
            const msg = error.message.toLowerCase();
            if (error.code === 403 || msg.includes('permission denied')) {
                detailedErrorMessage = 'Erro de Permissão (403): A planilha não foi compartilhada com o e-mail da conta de serviço (`GOOGLE_SERVICE_ACCOUNT_EMAIL`) com, no mínimo, permissão de "Leitor".';
            } else if (error.code === 404 || msg.includes('requested entity was not found')) {
                detailedErrorMessage = 'Planilha não encontrada (404): Verifique se o `GOOGLE_SHEET_ID` está correto nas suas variáveis de ambiente.';
            } else if (msg.includes('private key') || msg.includes('invalid_grant')) {
                detailedErrorMessage = 'Erro de Autenticação: A `GOOGLE_PRIVATE_KEY` ou o `GOOGLE_SERVICE_ACCOUNT_EMAIL` parecem estar incorretos. Copie-os novamente do seu arquivo JSON, garantindo que a chave privada esteja completa.';
            } else if (msg.includes('api has not been used') || msg.includes('enable the api')) {
                 detailedErrorMessage = 'API não ativada: A API do Google Sheets precisa ser ativada no seu projeto do Google Cloud. Acesse o console do Google Cloud, encontre o projeto correto e ative a "Google Sheets API".';
            } else {
                detailedErrorMessage = `Erro inesperado na API do Google. Verifique os logs do servidor. Mensagem: ${msg}`;
            }
        }

        throw new Error(detailedErrorMessage);
    }
}

export async function isUserWhitelisted(userId: string): Promise<boolean> {
    if (!userId) {
        return false;
    }
    const ids = await getWhitelistedIds();
    return ids.has(userId);
}

export async function logGenerationToSheet(item: GeneratedItem, user?: User | null): Promise<void> {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const logSheetName = process.env.GOOGLE_SHEET_LOG_NAME;

    if (!sheetId || !logSheetName) {
        console.error('GOOGLE_SHEET_ID or GOOGLE_SHEET_LOG_NAME is not set. Skipping sheet logging.');
        return;
    }

    try {
        const auth = getJwtClient();
        const sheets = google.sheets({ version: 'v4', auth });

        const rowMap = new Map<string, string>();
        LOG_HEADERS.forEach(header => rowMap.set(header, ''));

        // Populate common fields
        rowMap.set('nome_usuario', user?.username || 'N/A');
        rowMap.set('timestamp', item.createdAt || new Date().toISOString());
        rowMap.set('id', item.id);
        rowMap.set('categoria', item.categoria);
        rowMap.set('nome', ('title' in item && item.title) || item.nome);
        rowMap.set('descricao_curta', item.descricao_curta);
        rowMap.set('raridade', item.raridade || 'N/A');
        rowMap.set('nivel_sugerido', String(item.nivel_sugerido || 'N/A'));
        rowMap.set('tematica', item.tematica || 'N/A');
        rowMap.set('image_prompt', item.imagePromptDescription || '');
        rowMap.set('dados_completos_json', JSON.stringify(item));
        
        // Populate category-specific fields
        switch (item.categoria) {
            case 'Arma':
                rowMap.set('arma_dano', item.dano || '');
                rowMap.set('arma_tipo_de_dano', item.tipo_de_dano || '');
                rowMap.set('arma_status_aplicado', item.status_aplicado || '');
                rowMap.set('arma_efeitos_secundarios', item.efeitos_secundarios || '');
                break;
            case 'Acessório':
                rowMap.set('acessorio_efeitos_passivos', item.efeitos_passivos || '');
                rowMap.set('acessorio_efeitos_ativos', item.efeitos_ativos || '');
                rowMap.set('acessorio_condicao_ativacao', item.condicao_ativacao || '');
                break;
            case 'Kekkijutsu':
                rowMap.set('kekkijutsu_dano', item.dano || '');
                rowMap.set('kekkijutsu_tipo_de_dano', item.tipo_de_dano || '');
                rowMap.set('kekkijutsu_status_aplicado', item.status_aplicado || '');
                rowMap.set('kekkijutsu_efeitos_secundarios', item.efeitos_secundarios || '');
                break;
            case 'Caçador':
                rowMap.set('cacador_classe', item.classe || '');
                rowMap.set('cacador_personalidade', item.personalidade || '');
                rowMap.set('cacador_background', item.background || '');
                break;
            case 'Inimigo/Oni':
                rowMap.set('oni_power_level', item.power_level || '');
                rowMap.set('oni_kekkijutsu_nome', item.kekkijutsu?.nome || '');
                rowMap.set('oni_kekkijutsu_descricao', item.kekkijutsu?.descricao || '');
                rowMap.set('oni_fraquezas_unicas', item.fraquezas_unicas?.join(', ') || '');
                break;
            case 'NPC':
                rowMap.set('npc_origem', item.origem || '');
                rowMap.set('npc_motivacao', item.motivation || '');
                rowMap.set('npc_segredo', item.secret || '');
                rowMap.set('npc_profissao', item.profession || '');
                break;
            case 'Missões':
                rowMap.set('missao_titulo', item.title || '');
                rowMap.set('missao_logline', item.logline || '');
                rowMap.set('missao_objetivos', item.objectives?.join('; ') || '');
                break;
            case 'World Building':
                 rowMap.set('wb_plot_threads', item.plot_threads?.map(p => p.title).join('; ') || '');
                 rowMap.set('wb_faccoes', item.faccoes_internas?.map(f => f.nome).join(', ') || '');
                 rowMap.set('wb_ameacas', item.ameacas_externas?.map(a => a.nome).join(', ') || '');
                break;
            case 'Evento':
                rowMap.set('evento_level', item.level || '');
                rowMap.set('evento_threat_level', item.threatLevel || '');
                rowMap.set('evento_tipo', item.eventType || '');
                break;
            case 'Forma de Respiração':
                 rowMap.set('respiracao_base', item.base_breathing_id || '');
                 rowMap.set('respiracao_mecanicas', item.mechanics ? `${item.mechanics.activation}, ${item.mechanics.on_success_target}` : '');
                break;
        }

        const rowData = LOG_HEADERS.map(header => rowMap.get(header) || '');
        const range = `${logSheetName}!A:AS`; // Updated range for 45 columns

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData],
            },
        });
        
        console.log(`Successfully logged generation ID ${item.id} to Google Sheet.`);
    } catch (error: any) {
        let errorMessage = error.message;
        if (error.code === 403 || error.message?.toLowerCase().includes('permission denied')) {
            errorMessage = 'Permission Denied (403). A conta de serviço precisa de permissão de "Editor" na planilha para registrar os logs.';
        }
        console.error('Failed to log generation to Google Sheet:', errorMessage);
    }
}