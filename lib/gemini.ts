
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

/**
 * Initializes and returns a singleton instance of the GoogleGenAI client.
 * Returns null and logs an error if the API key is not found.
 */
export const getAiClient = (): GoogleGenAI | null => {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error("A variável de ambiente API_KEY não está definida.");
        return null;
    }

    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey });
    }

    return aiClient;
};