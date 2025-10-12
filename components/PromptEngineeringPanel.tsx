import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { SparklesIcon } from './icons/SparklesIcon';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { LoadingIndicator } from './LoadingIndicator';
import { MidjourneyParameters } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { PromptResultDisplay } from './PromptResultDisplay';
import type { MidjourneyParameters as MidjourneyParametersType, GptParameters as GptParametersType, PromptGenerationResult } from '../types';

export const PromptEngineeringPanel: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');

    const [mjParams, setMjParams] = useState<MidjourneyParametersType>({
        aspectRatio: { active: true, value: '16:9' },
        chaos: { active: false, value: 0 },
        quality: { active: false, value: 1 },
        style: { active: true, value: 'raw' },
        stylize: { active: true, value: 100 },
        weird: { active: false, value: 0 },
        version: { active: true, value: '6' }
    });
    
    const [mjParamsEnabled, setMjParamsEnabled] = useState(true);

    const [gptParams, setGptParams] = useState<GptParametersType>({
        tone: 'cinematic',
        style: 'concept_art',
        composition: 'dynamic_angle'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PromptGenerationResult | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Por favor, insira um tópico para a imagem.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        const activeMjParams: { [key: string]: any } = {};
        if (mjParamsEnabled) {
            for (const key in mjParams) {
                const param = mjParams[key as keyof MidjourneyParametersType];
                if (param.active) {
                    activeMjParams[key] = param.value;
                }
            }
        }

        try {
            const response = await fetch('/api/generatePrompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    negativePrompt,
                    mjParams: activeMjParams,
                    gptParams,
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao gerar prompts.');
            }
            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* --- Coluna 1: Entradas --- */}
                <div className="md:sticky md:top-28 space-y-6">
                    <Card>
                        <h2 className="text-2xl font-bold text-white mb-2 font-gangofthree">Mago dos prompts</h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Descreva sua ideia, ajuste os parâmetros e deixe o Alquimista construir prompts otimizados para Midjourney e DALL-E.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tópico / Ideia Principal</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Ex: Um caçador de demônios ciborgue em uma Tóquio chuvosa de neon, segurando uma katana de energia..."
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Prompt Negativo (o que evitar)</label>
                                <input
                                    type="text"
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    placeholder="Ex: texto, marca d'água, baixa resolução, feio"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <MidjourneyParameters 
                            params={mjParams} 
                            onParamsChange={setMjParams} 
                            enabled={mjParamsEnabled}
                            onEnabledChange={setMjParamsEnabled}
                        />
                    </Card>

                    <Card>
                        <GptStructuredBuilder params={gptParams} onParamsChange={setGptParams} />
                    </Card>
                    
                    <div className="flex justify-end">
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
                            <SparklesIcon className="w-5 h-5" />
                            {isLoading ? 'Gerando...' : 'Gerar Prompts'}
                        </Button>
                    </div>
                </div>

                {/* --- Coluna 2: Saídas --- */}
                <div className="space-y-6">
                    {isLoading && (
                        <div className="flex justify-center pt-10">
                            <LoadingIndicator text="Construindo prompts épicos..." duration={15} />
                        </div>
                    )}
                    
                    {result && <PromptResultDisplay result={result} />}
                </div>
            </div>

            {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
        </>
    );
};