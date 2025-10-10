
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import type { PromptResponse } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { PromptResultDisplay } from './PromptResultDisplay';

const PromptEngineeringPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PromptResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generatePrompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao gerar os prompts.');
      }

      const data: PromptResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <Card>
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold mb-2 text-indigo-400 font-gangofthree">Gerador de Prompts para IAs Visuais</h2>
          <p className="text-sm text-gray-400 mb-4">
            Descreva a cena, personagem ou objeto que você imagina. O sistema criará prompts otimizados para diversas plataformas de IA.
          </p>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md p-2 text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Ex: Uma samurai jovem em armadura estilizada, chuva fina, neon vermelho e azul refletido no aço..."
            disabled={isLoading}
          />
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? <><Spinner size="sm" /> Gerando...</> : <><SparklesIcon className="w-5 h-5"/> Gerar Prompts</>}
            </Button>
          </div>
        </form>
      </Card>
      
      {error && (
        <div className="bg-red-800 border border-red-600 text-white px-4 py-3 rounded-lg text-center" role="alert">
            {error}
        </div>
      )}

      {isLoading && !result && (
         <Card className="flex flex-col items-center justify-center gap-4 py-16">
            <Spinner size="lg" />
            <p className="text-gray-400">Criando prompts e buscando referências...</p>
         </Card>
      )}

      {result && (
        <PromptResultDisplay response={result} />
      )}
    </div>
  );
};

export default PromptEngineeringPanel;
