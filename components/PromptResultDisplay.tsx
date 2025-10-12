import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { Spinner } from './ui/Spinner';
import type { PromptGenerationResult } from '../types';

interface PromptResultDisplayProps {
  result: PromptGenerationResult;
  onRefine: (promptToRefine: string, modelType: 'midjourney' | 'gpt') => Promise<void>;
}

const PromptCard: React.FC<{ 
    title: string; 
    prompt: string;
    modelType: 'midjourney' | 'gpt';
    onRefine: (promptToRefine: string, modelType: 'midjourney' | 'gpt') => Promise<void>;
    className?: string;
}> = ({ title, prompt, modelType, onRefine, className }) => {
    const [copied, setCopied] = useState(false);
    const [isRefining, setIsRefining] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleRefineClick = async () => {
        setIsRefining(true);
        try {
            await onRefine(prompt, modelType);
        } catch (error) {
            // Error is handled by the parent component
            console.error("Refinement failed:", error);
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <Card className={`prompt-card flex flex-col ${className}`}>
            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h3 className="text-lg font-bold text-white font-gangofthree">{title}</h3>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={handleRefineClick} disabled={isRefining}>
                        {isRefining ? <Spinner size="sm" /> : <MagicWandIcon className="w-5 h-5" />}
                        {isRefining ? 'Refinando...' : 'Refinar com DeepSeek'}
                    </Button>
                    <Button variant="ghost" onClick={handleCopy} disabled={isRefining}>
                        {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                </div>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-md text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto flex-grow">
                <code>{prompt}</code>
            </div>
        </Card>
    );
};

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ result, onRefine }) => {
  return (
    <div className="space-y-6">
        <PromptCard title="Prompt para Midjourney" prompt={result.midjourneyPrompt} modelType="midjourney" onRefine={onRefine} className="model-midjourney" />
        <PromptCard title="Prompt para DALL-E / GPT" prompt={result.gptPrompt} modelType="gpt" onRefine={onRefine} className="model-gpt" />
    </div>
  );
};