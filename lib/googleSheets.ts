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
            throw new Error('Google Sheets API credentials are not correctly configured in environment variables.');
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
        if (rows && rows.length > 0) {
            // Flatten the array of rows, get the first element of each row, and filter out any empty ones.
            const ids = rows.flat().filter(id => id); 
            whitelistedIds = new Set(ids);
        } else {
            // If the sheet is empty, initialize an empty set.
            whitelistedIds = new Set();
        }

        lastFetchTime = Date.now();
        console.log(`Whitelist successfully refreshed. Found ${whitelistedIds.size} authorized IDs.`);
        return whitelistedIds;

    } catch (error) {
        console.error('Failed to fetch whitelist from Google Sheets:', error);
        // If fetching fails, return the last known cache to prevent a total service outage.
        // If no cache exists, return an empty set to fail safely (deny access).
        return whitelistedIds || new Set();
    }
}

/**
 * Checks if a given Discord user ID is present in the Google Sheets whitelist.
 * @param {string} userId - The Discord user ID to verify.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is whitelisted, and false otherwise.
 */
export async function isUserWhitelisted(userId: string): Promise<boolean> {
    if (!userId) {
        return false;
    }
    const ids = await getWhitelistedIds();
    return ids.has(userId);
}
