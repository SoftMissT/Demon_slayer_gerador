import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import type { ApiKeys } from '../../App';

export const validateGeminiApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey || !apiKey.startsWith('AI')) return false;
    try {
        const genAI = new GoogleGenAI({ apiKey });
        // Using a lightweight model listing call for validation.
        await genAI.models.list();
        return true;
    } catch (error) {
        console.error("Gemini API Key validation failed:", error);
        return false;
    }
};

export const validateOpenAiApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey || !apiKey.startsWith('sk-')) return false;
    try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        // Listing models is a standard, low-cost way to check API key validity.
        await openai.models.list();
        return true;
    } catch (error) {
        console.error("OpenAI API Key validation failed:", error);
        return false;
    }
};

export const validateDeepSeekApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey || !apiKey.startsWith('sk-')) return false;
    try {
        // The official check is to list models.
        const response = await fetch('https://api.deepseek.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        return response.ok;
    } catch (error) {
        console.error("DeepSeek API Key validation failed:", error);
        return false;
    }
};

interface ValidationResult {
    gemini: boolean;
    openai: boolean;
    deepseek: boolean;
    errors: string[];
}

export const validateAllApiKeys = async (keys: ApiKeys): Promise<ValidationResult> => {
    const errors: string[] = [];
    
    const [geminiValid, openaiValid, deepseekValid] = await Promise.all([
        validateGeminiApiKey(keys.gemini),
        validateOpenAiApiKey(keys.openai),
        validateDeepSeekApiKey(keys.deepseek),
    ]);

    if (!geminiValid) errors.push('Google Gemini');
    if (!openaiValid) errors.push('OpenAI');
    if (!deepseekValid) errors.push('DeepSeek');

    return {
        gemini: geminiValid,
        openai: openaiValid,
        deepseek: deepseekValid,
        errors: errors,
    };
};
