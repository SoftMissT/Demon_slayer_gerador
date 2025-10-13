import React from 'react';
import type { PromptGenerationResult, AlchemyHistoryItem } from '../types';
import { PromptCard } from './PromptCard';
import { Button } from './ui/Button';
import { RefreshIcon } from './icons/RefreshIcon';
import { StarIcon } from './icons/StarIcon';

interface PromptResultDisplayProps {
    results: PromptGenerationResult;
    inputs: AlchemyHistoryItem['inputs'];
    onRegenerate: () => void;
    onFavorite: (item: AlchemyHistoryItem) => void;
    isFavorited: boolean;
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ results, inputs, onRegenerate, onFavorite, isFavorited }) => {
    
    const handleFavoriteClick = () => {
        const item: AlchemyHistoryItem = {
            id: `alchemy_${Date.now()}`,
            createdAt: new Date().toISOString(),
            inputs,
            outputs: results,
        };
        onFavorite(item);
    };

    return (
        <div className="flex flex-col h-full gap-4">
             <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 flex-shrink-0">
                <h2 className="text-xl font-bold font-gangofthree text-white">Prompts Destilados</h2>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={onRegenerate}>
                        <RefreshIcon className="w-4 h-4"/> Regenerar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleFavoriteClick}>
                        <StarIcon className="w-4 h-4" filled={isFavorited}/> {isFavorited ? 'Salvo' : 'Salvar'}
                    </Button>
                </div>
            </div>
            <div className="flex-grow grid grid-cols-1 gap-4 overflow-y-auto">
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
        </div>
    );
};
