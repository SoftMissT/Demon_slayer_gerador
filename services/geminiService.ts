
import type { FilterState, GeneratedItem } from '../types';

/**
 * Generates structured content by calling the internal Next.js API route.
 * This keeps the API key secure on the server.
 */
export const generateContent = async (filters: FilterState, count: number = 1, promptModifier?: string): Promise<GeneratedItem[]> => {
    const response = await fetch('/api/generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters, count, promptModifier }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro desconhecido.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
};

// FIX: Add generateImage function to call the image generation API endpoint.
/**
 * Generates an image by calling the internal Next.js API route.
 * This keeps the API key secure on the server.
 */
export const generateImage = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro desconhecido ao gerar a imagem.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl;
};
