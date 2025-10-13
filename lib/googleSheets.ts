// FIX: Implemented Google Sheets service to handle user whitelisting and logging,
// resolving module and import errors in `pages/api/generateContent.ts` and `pages/api/auth/discord/callback.ts`.
import { google } from 'googleapis';
import type { GeneratedItem, User } from '../types';

// Function to get authenticated Google Sheets client
const getSheetsClient = () => {
    // Ensure environment variables are set
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
        console.error('Google Sheets API credentials are not set in environment variables.');
        return null;
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            // The private key needs to be parsed correctly as it's a string from env var
            private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
};

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const WHITELIST_SHEET_NAME = 'Whitelist'; // Assuming a sheet name
const LOG_SHEET_NAME = 'GenerationLog';   // Assuming a sheet name

/**
 * Checks if a user's Discord ID is in the whitelist spreadsheet.
 * @param userId - The Discord ID of the user to check.
 * @returns A promise that resolves to true if the user is whitelisted, false otherwise.
 */
export const isUserWhitelisted = async (userId: string): Promise<boolean> => {
    try {
        const sheets = getSheetsClient();
        if (!sheets || !SPREADSHEET_ID) {
            console.error('Google Sheets client or Spreadsheet ID is not configured.');
            // This error will be caught by the API route and shown to the user.
            throw new Error("A configuração da planilha do Google para verificação de acesso não foi encontrada no servidor.");
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${WHITELIST_SHEET_NAME}!A:A`, // Assuming IDs are in column A
        });

        const rows = response.data.values;
        if (rows) {
            // Flatten array of arrays and check for inclusion
            return rows.flat().includes(userId);
        }

        return false;
    } catch (error: any) {
        console.error('Error checking whitelist:', error);
        // Propagate a more user-friendly error message
        throw new Error(`Ocorreu um erro ao verificar a permissão de acesso. Detalhes: ${error.message}`);
    }
};

/**
 * Logs a generated item to a Google Sheet.
 * This is a non-blocking, fire-and-forget function. Errors are logged to the console.
 * @param item - The generated item to log.
 * @param user - The user who generated the item (optional).
 */
export const logGenerationToSheet = async (item: GeneratedItem, user?: User | null): Promise<void> => {
    try {
        const sheets = getSheetsClient();
         if (!sheets || !SPREADSHEET_ID) {
            console.error('Google Sheets client or Spreadsheet ID is not configured for logging.');
            return;
        }

        const timestamp = new Date().toISOString();
        const userId = user?.id || 'N/A';
        const username = user?.username || 'N/A';
        
        // Prepare a row with key information for logging.
        const row = [
            timestamp,
            item.id,
            userId,
            username,
            item.categoria,
            ('title' in item && item.title) || item.nome,
            item.descricao_curta,
            JSON.stringify(item.provenance || []), // Log the AI pipeline
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${LOG_SHEET_NAME}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });
    } catch (error) {
        console.error('Error logging generation to Google Sheet:', error);
    }
};
