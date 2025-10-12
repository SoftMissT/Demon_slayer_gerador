import React from 'react';
import type { PromptGenerationResult } from '../types';
import { PromptCard } from './PromptCard';

interface PromptResultDisplayProps {
  result: PromptGenerationResult;
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
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