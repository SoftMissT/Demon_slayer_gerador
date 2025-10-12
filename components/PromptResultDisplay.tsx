

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import type { PromptGenerationResult } from '../types';
import { MidjourneyIcon } from './icons/MidjourneyIcon';
import { GptIcon } from './icons/GptIcon';

interface PromptResultDisplayProps {
  result: PromptGenerationResult;
}

interface PromptCardProps {
    title: string;
    prompt: string;
    className?: string;
    icon: React.ReactNode;
}

const PromptCard: React.FC<PromptCardProps> = ({ title, prompt, className, icon }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <Card className={`prompt-card flex flex-col ${className} !p-4`}>
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-lg font-bold text-white font-gangofthree">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={handleCopy}>
                        {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                </div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-md text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto flex-grow font-mono">
                <code>{prompt}</code>
            </div>
        </Card>
    );
};

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6">
        <PromptCard 
            title="Prompt para Midjourney" 
            prompt={result.midjourneyPrompt} 
            className="model-midjourney"
            icon={<MidjourneyIcon className="w-6 h-6 text-alchemy-gold" />}
        />
        <PromptCard 
            title="Prompt para DALL-E / GPT" 
            prompt={result.gptPrompt} 
            className="model-gpt"
            icon={<GptIcon className="w-6 h-6 text-crystal-blue" />}
        />
    </div>
  );
};