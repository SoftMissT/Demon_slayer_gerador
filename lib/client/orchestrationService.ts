import type { FilterState, GeneratedItem, MidjourneyParameters, GptParameters, GeminiParameters, PromptGenerationResult } from '../../types';

/**
 * Calls the backend API to orchestrate the generation of a new item.
 * @param filters - The current filter state.
 * @param promptModifier - An optional, high-priority instruction.
 * @returns A promise that resolves to the generated item.
 */
export const orchestrateGeneration = async (filters: FilterState, promptModifier?: string): Promise<GeneratedItem> => {
    const response = await fetch('/api/generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters, promptModifier }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    return response.json();
};

// Client-side prompt generation request
interface GeneratePromptsRequest {
    basePrompt: string;
    mjParams?: MidjourneyParameters;
    gptParams: GptParameters;
    geminiParams: GeminiParameters;
    generateMidjourney: boolean;
    generateGpt: boolean;
    generateGemini: boolean;
}

/**
 * Calls the backend API to generate optimized prompts for different AI models.
 * @param request - The prompt generation request parameters.
 * @returns A promise that resolves to the generated prompts.
 */
export const generatePrompts = async (request: GeneratePromptsRequest): Promise<PromptGenerationResult> => {
     const response = await fetch('/api/generatePrompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    return response.json();
};