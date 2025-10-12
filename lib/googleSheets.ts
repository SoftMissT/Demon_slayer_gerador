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
        console.log(`Whitelist successfully refreshed. Found ${whitelistedIds.size} authorized IDs.`);
        return whitelistedIds;

    } catch (error: any) {
        console.error('Failed to fetch whitelist from Google Sheets:', error);
        // Re-throw a more user-friendly error to be caught by the API route.
        // This helps distinguish between a config error and a user not being on the list.
        throw new Error('Falha ao buscar a lista de autorização. Verifique se as variáveis de ambiente do Google Sheets estão corretas e se a planilha foi compartilhada com o email da conta de serviço.');
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