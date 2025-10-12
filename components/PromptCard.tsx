import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { MidjourneyIcon } from './icons/MidjourneyIcon';
import { GptIcon } from './icons/GptIcon';

interface PromptCardProps {
    model: 'midjourney' | 'gpt';
    prompt: string;
}

export const PromptCard: React.FC<PromptCardProps> = ({ model, prompt }) => {
    const [copied, setCopied] = useState(false);

    const modelConfig = {
        midjourney: {
            title: "Prompt para Midjourney",
            className: "model-midjourney",
            icon: <MidjourneyIcon className="w-6 h-6 text-alchemy-gold" />
        },
        gpt: {
            title: "Prompt para DALL-E / GPT",
            className: "model-gpt",
            icon: <GptIcon className="w-6 h-6 text-crystal-blue" />
        }
    };

    const config = modelConfig[model];

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <Card className={`prompt-card flex flex-col ${config.className} !p-4 h-full`}>
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {config.icon}
                    <h3 className="text-lg font-bold text-white font-gangofthree">{config.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={handleCopy}>
                        {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                </div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-md text-sm text-gray-300 whitespace-pre-wrap overflow-auto flex-grow font-mono">
                <code>{prompt}</code>
            </div>
        </Card>
    );
};
