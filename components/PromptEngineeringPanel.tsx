
import React, { useState, useCallback, useMemo } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { RefreshIcon } from './icons/RefreshIcon';
import { MidjourneyParameters } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { PromptResultDisplay } from './PromptResultDisplay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import type { MidjourneyParameters as MidjourneyParametersType, GptParameters, PromptGenerationResult } from '../types';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { PotionIcon } from './icons/PotionIcon';

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

const Bubble: React.FC<{ style: React.CSSProperties }> = ({ style }) => <div className="bubble" style={style} />;

export const PromptEngineeringPanel: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParamsEnabled, setMjParamsEnabled] = useState(false);
    const [mjParams, setMjParams] = useState<MidjourneyParametersType>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);

    const [result, setResult] = useState<PromptGenerationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bubbles = useMemo(() => Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 20 + 5;
        const style = {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
        };
        return <Bubble key={i} style={style} />;
    }), []);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        const activeMjParams: { [key: string]: any } = {};
        if (mjParamsEnabled) {
            for (const key in mjParams) {
                const paramKey = key as keyof MidjourneyParametersType;
                const param = mjParams[paramKey];
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
                    gptParams
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao gerar prompts.');
            }

            const data: PromptGenerationResult = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleReset = () => {
        setTopic('');
        setNegativePrompt('');
        setMjParams(INITIAL_MJ_PARAMS);
        setGptParams(INITIAL_GPT_PARAMS);
        setMjParamsEnabled(false);
        setResult(null);
        setError(null);
    };

    return (
        <div className="space-y-6 relative h-full">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                {bubbles}
            </div>
            <div className="relative z-10">
                {/* User Inputs & Parameters */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left Column: Topic and Negative Prompt */}
                    <Card className="p-6 parameter-card">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tópico Principal / Ideia</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Ex: Um caçador de demônios samurai, com uma armadura steampunk, em uma floresta de bambu cyberpunk..."
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white h-48 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Prompt Negativo (O que evitar)</label>
                                <input
                                    type="text"
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    placeholder="Ex: texto, blur, baixa qualidade, cartoon"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                                />
                            </div>
                        </div>
                    </Card>
                    
                    {/* Right Column: AI Parameters */}
                    <div className="space-y-6">
                        <Card className="p-6 parameter-card">
                            <MidjourneyParameters 
                                params={mjParams} 
                                onParamsChange={setMjParams} 
                                enabled={mjParamsEnabled}
                                onEnabledChange={setMjParamsEnabled}
                            />
                        </Card>
                        
                        <Card className="p-6 parameter-card">
                            <GptStructuredBuilder params={gptParams} onParamsChange={setGptParams} />
                        </Card>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="ghost" onClick={handleReset} disabled={isLoading}>
                        <RefreshIcon className="w-5 h-5" /> Resetar
                    </Button>
                    <Button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="alchemist-button">
                        <PotionIcon className="w-5 h-5" />
                        {isLoading ? 'Gerando...' : 'Gerar Prompts'}
                    </Button>
                </div>

                {/* Results Section */}
                <div className="mt-6">
                    {isLoading && (
                        <div className="flex justify-center pt-4">
                            <AlchemyLoadingIndicator />
                        </div>
                    )}
                    
                    {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}

                    {result && !isLoading && (
                        <div className="animate-fade-in-up">
                            <PromptResultDisplay result={result} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
