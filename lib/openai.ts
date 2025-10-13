
import OpenAI from 'openai';

/**
 * Initializes and returns an instance of the OpenAI client.
 * Uses the environment variable for the API key.
 * Returns null and logs an error if no API key is found.
 */
export const getOpenAiClient = (): OpenAI | null => {
    const apiKey = process.env.DEV_OPENAI_KEY;

    if (!apiKey) {
        console.warn("Nenhuma chave de API da OpenAI foi encontrada no ambiente do servidor. A etapa de polimento será ignorada.");
        return null;
    }

    return new OpenAI({ apiKey });
};
