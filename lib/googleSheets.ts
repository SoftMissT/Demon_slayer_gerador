// FIX: Implemented Google Sheets service to handle user whitelisting and logging,
// resolving module and import errors in `pages/api/generateContent.ts` and `pages/api/auth/discord/callback.ts`.
import { google } from 'googleapis';
import type { GeneratedItem, User } from '../types';

// Function to get authenticated Google Sheets client
const getSheetsClient = () => {
    // FIX: Align environment variable names with README.md for consistency and to fix deployment configuration errors.
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    // Ensure environment variables are set
    if (!privateKey || !clientEmail) {
        console.error('Google Sheets API credentials are not set in environment variables.');
        return null;
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            // The private key needs to be parsed correctly as it's a string from env var
            private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
};

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
// FIX: Changed sheet name from 'Whitelist' to 'discord_id' and range from column A to B to match the setup instructions in README.md, ensuring the user whitelist is read correctly.
const WHITELIST_SHEET_NAME = 'discord_id';

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
            // FIX: Changed sheet name from 'Whitelist' to 'discord_id' and range from column A to B to match the setup instructions in README.md, ensuring the user whitelist is read correctly.
            range: `${WHITELIST_SHEET_NAME}!B:B`,
        });

        const rows = response.data.values;
        if (rows) {
            // Flatten array of arrays and check for inclusion, skipping the header row.
            return rows.slice(1).flat().includes(userId);
        }

        return false;
    } catch (error: any) {
        console.error('Error checking whitelist:', error);
        // FIX: Added specific error handling to provide a more helpful message if the sheet name is wrong, a common setup mistake.
        if (error.message.includes('Unable to parse range')) {
             throw new Error(`Ocorreu um erro ao verificar a permissão de acesso. Detalhes: A aba da planilha com o nome "${WHITELIST_SHEET_NAME}" não foi encontrada. Verifique se a planilha foi configurada conforme o README.`);
        }
        // Propagate a more user-friendly error message
        throw new Error(`Ocorreu um erro ao verificar a permissão de acesso. Detalhes: ${error.message}`);
    }
};
