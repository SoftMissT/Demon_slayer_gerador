
import OpenAI from 'openai';

let aiClient: OpenAI | null = null;

/**
 * Initializes and returns a singleton instance of the OpenAI client.
 * Returns null and logs an error if the API key is not found.
 */
export const getOpenAiClient = (): OpenAI | null => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error("A variável de ambiente OPENAI_API_KEY não está definida.");
        return null;
    }

    if (!aiClient) {
        aiClient = new OpenAI({ apiKey });
    }

    return aiClient;
};
