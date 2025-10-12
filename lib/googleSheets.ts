import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// In-memory cache for the whitelist
let whitelistedIds: Set<string> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches the list of whitelisted Discord IDs from a specified Google Sheet.
 * Implements an in-memory cache to reduce the number of API calls.
 * @returns {Promise<Set<string>>} A set containing the whitelisted user IDs.
 * @throws {Error} If fetching from Google Sheets fails due to configuration or network issues.
 */
async function getWhitelistedIds(): Promise<Set<string>> {
    const now = Date.now();
    if (whitelistedIds && (now - lastFetchTime < CACHE_DURATION)) {
        console.log('Whitelist successfully served from cache.');
        return whitelistedIds;
    }

    try {
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        // The private key from environment variables might have escaped newlines.
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            throw new Error('As credenciais da API do Google Sheets não estão configuradas corretamente nas variáveis de ambiente do projeto.');
        }

        const auth = new JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            // Reads from the sheet named 'discord_id', column B, starting from the second row.
            range: 'discord_id!B2:B', 
        });

        const rows = response.data.values;
        const newIdSet = new Set<string>();
        if (rows && rows.length > 0) {
            // Flatten the array of rows, get the first element of each row, and filter out any empty or non-string ones.
            rows.flat().forEach(cellValue => {
                // Convert the cell value to a string, then trim. This is more robust.
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
        // Log the original, detailed error for server-side debugging.
        console.error('Original Google Sheets API Error:', error.code, error.message);
        
        let detailedErrorMessage = 'Falha ao buscar a lista de autorização.';

        // Google API errors often have a `code` property and a message.
        if (error.message) {
            const msg = error.message.toLowerCase();
            if (error.code === 403 || msg.includes('permission denied')) {
                detailedErrorMessage = 'Erro de Permissão (403): A planilha não foi compartilhada com o e-mail da conta de serviço (`GOOGLE_SERVICE_ACCOUNT_EMAIL`) com, no mínimo, permissão de "Leitor".';
            } else if (error.code === 404 || msg.includes('requested entity was not found')) {
                detailedErrorMessage = 'Planilha não encontrada (404): Verifique se o `GOOGLE_SHEET_ID` está correto e se o nome da aba da planilha é exatamente "discord_id".';
            } else if (msg.includes('private key') || msg.includes('invalid_grant')) {
                detailedErrorMessage = 'Erro de Autenticação: A `GOOGLE_PRIVATE_KEY` ou o `GOOGLE_SERVICE_ACCOUNT_EMAIL` parecem estar incorretos. Copie-os novamente do seu arquivo JSON, garantindo que a chave privada esteja completa.';
            } else if (msg.includes('api has not been used') || msg.includes('enable the api')) {
                 detailedErrorMessage = 'API não ativada: A API do Google Sheets precisa ser ativada no seu projeto do Google Cloud. Acesse o console do Google Cloud, encontre o projeto correto e ative a "Google Sheets API".';
            } else {
                // Include the original error for more context if it's not one of the common ones.
                detailedErrorMessage = `Erro inesperado na API do Google. Verifique os logs do servidor. Mensagem: ${msg}`;
            }
        }

        throw new Error(detailedErrorMessage);
    }
}

/**
 * Checks if a given Discord user ID is present in the Google Sheets whitelist.
 * @param {string} userId - The Discord user ID to verify.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is whitelisted, and false otherwise.
 * @throws {Error} If fetching the whitelist fails.
 */
export async function isUserWhitelisted(userId: string): Promise<boolean> {
    if (!userId) {
        return false;
    }
    const ids = await getWhitelistedIds();
    return ids.has(userId);
}