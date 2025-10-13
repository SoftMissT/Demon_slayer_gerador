
import { GoogleGenAI } from "@google/genai";

/**
 * Initializes and returns an instance of the GoogleGenAI client.
 * Uses an override API key if provided, otherwise falls back to the environment variable.
 * Returns null and logs an error if no API key is found.
 * @param apiKeyOverride - An optional API key to use instead of the one from environment variables.
 */
export const getAiClient = (apiKeyOverride?: string): GoogleGenAI | null => {
    const apiKey = apiKeyOverride || process.env.API_KEY;

    if (!apiKey) {
        console.error("Nenhuma chave de API do Gemini foi encontrada no ambiente do servidor.");
        return null;
    }

    return new GoogleGenAI({ apiKey });
};
