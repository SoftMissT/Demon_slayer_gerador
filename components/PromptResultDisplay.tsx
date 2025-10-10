
import React, { useState } from 'react';
import type { PromptResponse } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface PromptResultDisplayProps {
  response: PromptResponse;
}

const PromptCard: React.FC<{ engine: string; prompt: string }> = ({ engine, prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-bold text-sm text-indigo-400 capitalize">{engine}</h5>
        <Button variant="ghost" className="!p-1 !h-auto" onClick={handleCopy}>
          {copied ? <ClipboardCheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
          <span className="ml-2 text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
        </Button>
      </div>
      <p className="text-xs text-gray-300 font-mono bg-gray-900 p-2 rounded">{prompt || 'N/A'}</p>
    </div>
  );
};

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ response }) => {
    const [allCopied, setAllCopied] = useState(false);

    const handleCopyAll = () => {
        const { prompts, references } = response;
        const allText = `PROMPTS GERADOS PARA: "${response.query}"\n\n`
            + Object.entries(prompts).map(([k, v]) => `${k.toUpperCase()}:\n${v}`).join("\n\n")
            + "\n\n--- REFERÊNCIAS ---\n" 
            + (references.length ? references.map(r => `- ${r.title}: ${r.url}`).join("\n") : "Nenhuma referência encontrada.");
        
        navigator.clipboard.writeText(allText);
        setAllCopied(true);
        setTimeout(() => setAllCopied(false), 2000);
    };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-indigo-400 font-gangofthree">Resultados dos Prompts</h2>
        <Button onClick={handleCopyAll}>
             {allCopied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
             {allCopied ? 'Tudo Copiado!' : 'Copiar Tudo'}
        </Button>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-lg mb-4 flex items-center gap-3">
        <AlertTriangleIcon className="w-6 h-6 flex-shrink-0" />
        <p className="text-sm">
            <strong>AVISO:</strong> Este serviço <strong>NÃO gera imagens</strong>. Ele cria e entrega PROMPTS prontos para serem usados em outras IAs de imagem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PromptCard engine="Midjourney" prompt={response.prompts.midjourney} />
        <PromptCard engine="Gemini" prompt={response.prompts.gemini} />
        <PromptCard engine="Copilot" prompt={response.prompts.copilot} />
        <PromptCard engine="GPT" prompt={response.prompts.gpt} />
      </div>

      {response.references && response.references.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-bold text-indigo-400 mb-2 font-gangofthree">Referências e Inspirações</h3>
          <div className="space-y-2">
            {response.references.map((ref, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:underline">
                  {ref.title}
                </a>
                <p className="text-xs text-gray-500 mt-1">Fonte: {ref.source}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
