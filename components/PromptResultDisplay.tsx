import React from 'react';
import type { PromptGenerationResult } from '../types';
import { PromptCard } from './PromptCard';
import { StarIcon } from './icons/StarIcon';
import { Tooltip } from './ui/Tooltip';

interface PromptResultDisplayProps {
  result: PromptGenerationResult;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ result, onToggleFavorite, isFavorite }) => {
  return (
    <div className="space-y-6">
        {onToggleFavorite !== undefined && (
             <div className="flex justify-end -mb-4">
                <Tooltip text={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}>
                    <button
                        onClick={onToggleFavorite}
                        className="p-2 text-gray-400 hover:text-yellow-400 rounded-full bg-gray-800/50 border border-gray-700"
                        >
                        <StarIcon className="w-5 h-5" filled={isFavorite} />
                    </button>
                </Tooltip>
            </div>
        )}
        {result.midjourneyPrompt && (
            <PromptCard 
                model="midjourney"
                prompt={result.midjourneyPrompt} 
            />
        )}
        {result.gptPrompt && (
            <PromptCard 
                model="gpt"
                prompt={result.gptPrompt} 
            />
        )}
        {result.geminiPrompt && (
            <PromptCard 
                model="gemini"
                prompt={result.geminiPrompt} 
            />
        )}
    </div>
  );
};