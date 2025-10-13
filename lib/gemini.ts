

import { GoogleGenAI } from "@google/genai";

/**
 * Initializes and returns an instance of the GoogleGenAI client.
 * Uses a client-provided API key if available, otherwise falls back to the environment variable.
 * Returns null and logs an error if no API key is found.
 */
// FIX: Updated function to accept an optional client-provided API key to resolve the argument mismatch error in `pages/api/generateImage.ts`. This allows the user-provided key feature to function as intended.
export const getAiClient = (clientApiKey?: string): GoogleGenAI | null => {
    const apiKey = clientApiKey || process.env.DEV_GEMINI_KEY;

    if (!apiKey) {
        console.error("Nenhuma chave de API do Gemini foi encontrada no ambiente do servidor ou fornecida pelo cliente.");
        return null;
    }

    return new GoogleGenAI({ apiKey });
};
