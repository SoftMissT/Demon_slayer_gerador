
import OpenAI from 'openai';

/**
 * Initializes and returns an instance of the OpenAI client.
 * Uses an override API key if provided, otherwise falls back to the environment variable.
 * Returns null and logs an error if no API key is found.
 * @param apiKeyOverride - An optional API key to use instead of the one from environment variables.
 */
export const getOpenAiClient = (apiKeyOverride?: string): OpenAI | null => {
    const apiKey = apiKeyOverride || process.env.DEV_OPENAI_KEY;

    if (!apiKey) {
        console.warn("Nenhuma chave de API da OpenAI foi encontrada no ambiente do servidor. A etapa de polimento será ignorada.");
        return null;
    }

    return new OpenAI({ apiKey });
};