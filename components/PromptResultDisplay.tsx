import React from 'react';
import type { PromptGenerationResult } from '../types';
import { PromptCard } from './PromptCard';

interface PromptResultDisplayProps {
    results: PromptGenerationResult;
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ results }) => {
    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto inner-scroll pr-2">
            {results.midjourneyPrompt && (
                <PromptCard model="midjourney" prompt={results.midjourneyPrompt} />
            )}
            {results.gptPrompt && (
                <PromptCard model="gpt" prompt={results.gptPrompt} />
            )}
            {results.geminiPrompt && (
                <PromptCard model="gemini" prompt={results.geminiPrompt} />
            )}
        </div>
    );
};
