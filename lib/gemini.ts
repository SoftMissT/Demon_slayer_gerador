
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

/**
 * Returns a singleton instance of the GoogleGenAI client.
 * Throws an error if the API key is not set in environment variables.
 */
export const getAiClient = (): GoogleGenAI => {
    // FIX: Retrieve API key from `process.env.API_KEY` as per guidelines.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        throw new Error("Nenhuma variável de ambiente de API Key (API_KEY) foi definida.");
    }

    if (!aiClient) {
        // FIX: Initialize GoogleGenAI with a named apiKey parameter.
        aiClient = new GoogleGenAI({ apiKey });
    }

    return aiClient;
};
