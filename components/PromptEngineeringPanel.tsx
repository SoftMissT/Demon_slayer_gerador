import React, { useState, useCallback } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MidjourneyParameters } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { PromptResultDisplay } from './PromptResultDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { MagicWandIcon } from './icons/MagicWandIcon';
import type { MidjourneyParameters as MidjourneyParametersType, GptParameters, PromptGenerationResult } from '../types';

interface PromptEngineeringPanelProps {
    onError: (message: string | null) => void;
}

const INITIAL_MJ_PARAMS: MidjourneyParametersType = {
  aspectRatio: { active: false, value: '1:1' },
  chaos: { active: false, value: 0 },
  quality: { active: false, value: 1 },
  style: { active: false, value: 'raw' },
  stylize: { active: false, value: 100 },
  weird: { active: false, value: 0 },
  version: { active: false, value: '6' },
};

const INITIAL_GPT_PARAMS: GptParameters = {
  tone: 'cinematic',
  style: 'illustration',
  composition: 'full_shot',
};

export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({ onError }) => {
    const [topic, setTopic] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParamsEnabled, setMjParamsEnabled] = useState(true);
    const [mjParams, setMjParams] = useState<MidjourneyParametersType>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PromptGenerationResult | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) {
            onError("Por favor, insira um tópico para gerar os prompts.");
            return;
        }

        setIsLoading(true);
        setResult(null);
        onError(null);

        const activeMjParams = Object.entries(mjParams).reduce((acc, [key, param]) => {
            if (param.active) {
                acc[key as keyof MidjourneyParametersType] = param.value;
            }
            return acc;
        }, {} as Partial<Record<keyof MidjourneyParametersType, any>>);

        try {
            const response = await fetch('/api/generatePrompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    negativePrompt,
                    mjParams: mjParamsEnabled ? activeMjParams : {},
                    gptParams,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ocorreu um erro desconhecido.');
            }

            const data: PromptGenerationResult = await response.json();
            setResult(data);
        } catch (error: any) {
            onError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [topic, negativePrompt, mjParams, mjParamsEnabled, gptParams, onError]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <Card className="p-6">
                <h2 className="text-2xl font-bold text-white font-gangofthree mb-2">Alquimia de Prompts</h2>
                <p className="text-gray-400 mb-6">Descreva sua ideia e a IA irá transmutá-la em prompts poderosos para Midjourney e DALL-E/GPT.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tópico Principal</label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ex: um caçador de demônios samurai cibernético, com uma katana de neon, em uma megacidade chuvosa..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm resize-y"
                            rows={3}
                            disabled={isLoading}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Prompt Negativo (O que evitar?)</label>
                        <input
                            type="text"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="Ex: sem texto, baixa qualidade, cartoon"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-700 my-6"></div>

                <MidjourneyParameters 
                    params={mjParams} 
                    onParamsChange={setMjParams}
                    enabled={mjParamsEnabled}
                    onEnabledChange={setMjParamsEnabled}
                />

                <div className="border-t border-gray-700 my-6"></div>

                <GptStructuredBuilder params={gptParams} onParamsChange={setGptParams} />
                
                <div className="mt-8 flex justify-center">
                    <Button onClick={handleGenerate} disabled={isLoading || !topic} className="w-full max-w-xs text-lg py-3 alchemy-button">
                        {isLoading ? 'Transmutando...' : <><MagicWandIcon className="w-6 h-6" /> Alquimizar</>}
                    </Button>
                </div>
            </Card>

            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <AlchemyLoadingIndicator />
                </div>
            )}

            {result && (
                <div className="mt-8">
                    <PromptResultDisplay result={result} />
                </div>
            )}
        </div>
    );
};
