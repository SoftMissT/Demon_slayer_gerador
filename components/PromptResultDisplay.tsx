
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import type { PromptGenerationResult } from '../types';

interface PromptResultDisplayProps {
  result: PromptGenerationResult;
}

const PromptCard: React.FC<{ title: string; prompt: string }> = ({ title, prompt }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-white font-gangofthree">{title}</h3>
                <Button variant="ghost" onClick={handleCopy}>
                    {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                </Button>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-md text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto flex-grow">
                <code>{prompt}</code>
            </div>
        </Card>
    );
};

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PromptCard title="Prompt para Midjourney" prompt={result.midjourneyPrompt} />
            <PromptCard title="Prompt para DALL-E / GPT" prompt={result.gptPrompt} />
        </div>
        
        {result.webSearchQueries && result.webSearchQueries.length > 0 && (
            <Card>
                 <h3 className="text-lg font-bold text-white font-gangofthree mb-3">Fontes da Web Utilizadas</h3>
                 <div className="bg-blue-900/30 border border-blue-700 text-blue-200 p-3 rounded-lg flex gap-3 text-sm">
                    <AlertTriangleIcon className="w-8 h-8 flex-shrink-0 text-blue-400" />
                    <p>A IA usou o Google Search para se basear em informações da web. As fontes a seguir foram consultadas para gerar os prompts. É recomendado verificar os links para mais contexto.</p>
                 </div>
                 <ul className="mt-3 space-y-2">
                    {result.webSearchQueries.map((source, index) => (
                        <li key={index} className="text-sm">
                           <a 
                             href={source.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-indigo-400 hover:text-indigo-300 hover:underline break-all"
                           >
                            [{index + 1}] {source.title || source.uri}
                           </a>
                        </li>
                    ))}
                 </ul>
            </Card>
        )}
    </div>
  );
};
