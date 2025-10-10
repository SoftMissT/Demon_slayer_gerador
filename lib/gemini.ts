
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

/**
 * Initializes and returns a singleton instance of the GoogleGenAI client.
 * Throws an error if the API key is not found in environment variables.
 */
export const getAiClient = (): GoogleGenAI => {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        throw new Error("A variável de ambiente API_KEY não está definida.");
    }

    if (!aiClient) {
        // FIX: Per coding guidelines, initialize with a named apiKey parameter.
        aiClient = new GoogleGenAI({ apiKey });
    }

    return aiClient;
};
