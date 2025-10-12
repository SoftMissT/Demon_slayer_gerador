import React from 'react';
import type { PromptGenerationResult } from '../types';
import { PromptCard } from './PromptCard';

interface PromptResultDisplayProps {
  result: PromptGenerationResult;
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ result }) => {
  return (
    <>
        <PromptCard 
            model="midjourney"
            prompt={result.midjourneyPrompt} 
        />
        <PromptCard 
            model="gpt"
            prompt={result.gptPrompt} 
        />
    </>
  );
};