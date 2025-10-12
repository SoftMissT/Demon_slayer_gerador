

import React, { useState, useCallback, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { MidjourneyParameters } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { PromptResultDisplay } from './PromptResultDisplay';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { GeminiParameters } from './GeminiParameters';
import type { MidjourneyParameters as MidjourneyParams, GptParameters as GptParams, GeminiParameters as GeminiParams, PromptGenerationResult } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';
import { Select } from './ui/Select';
import { RefreshIcon } from './icons/RefreshIcon';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';

const INITIAL_MJ_PARAMS: MidjourneyParams = {
    aspectRatio: { value: '4:7', active: true },
    version: { value: 'Niji 6', active: true },
    style: { value: 'raw', active: true },
    stylize: { value: 100, active: false },
    chaos: { value: 0, active: false },
    quality: { value: 1, active: false },
    weird: { value: 0, active: false },
    // Defaults from Gemini/GPT params
    artStyle: { value: 'anime_manga', active: false },
    lighting: { value: 'cinematica', active: false },
    colorPalette: { value: 'vibrante', active: false },
    composition: { value: 'retrato', active: false },
    detailLevel: { value: 'detalhado', active: false },
};

const INITIAL_GPT_PARAMS: GptParams = {
    tone: 'cinematic',
    style: 'illustration',
    composition: 'close_up',
};

const INITIAL_GEMINI_PARAMS: GeminiParams = {
    artStyle: 'anime_manga',
    lighting: 'cinematica',
    colorPalette: 'vibrante',
    composition: 'retrato',
    detailLevel: 'detalhado',
};

interface AlchemyPreset {
    name: string;
    basePrompt: string;
    negativePrompt: string;
    mjParams: MidjourneyParams;
    gptParams: GptParams;
    geminiParams: GeminiParams;
    isMjEnabled: boolean;
    isGptEnabled: boolean;
    isGeminiEnabled: boolean;
}

export const PromptEngineeringPanel: React.FC = () => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MidjourneyParams>(INITIAL_MJ_PARAMS);
    const [isMjEnabled, setIsMjEnabled] = useState(true);
    const [gptParams, setGptParams] = useState<GptParams>(INITIAL_GPT_PARAMS);
    const [isGptEnabled, setIsGptEnabled] = useState(true);
    const [geminiParams, setGeminiParams] = useState<GeminiParams>(INITIAL_GEMINI_PARAMS);
    const [isGeminiEnabled, setIsGeminiEnabled] = useState(true);
    
    const [result, setResult] = useState<PromptGenerationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [presets, setPresets] = useLocalStorage<AlchemyPreset[]>('kimetsu-alchemy-presets', []);
    const [selectedPreset, setSelectedPreset] = useState<string>('');

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        
        try {
            const response = await fetch('/api/generatePrompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    basePrompt: `Tópico Principal: ${basePrompt}. Evitar: ${negativePrompt || 'Nenhum'}.`,
                    mjParams,
                    gptParams,
                    geminiParams,
                    generateMidjourney: isMjEnabled,
                    generateGpt: isGptEnabled,
                    generateGemini: isGeminiEnabled,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao gerar os prompts.');
            }

            const data = await response.json();
            setResult(data.result);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [basePrompt, negativePrompt, mjParams, gptParams, geminiParams, isMjEnabled, isGptEnabled, isGeminiEnabled]);

    const handleSavePreset = useCallback(() => {
        const name = prompt("Digite um nome para o preset:");
        if (name && name.trim()) {
            if (presets.some(p => p.name === name.trim())) {
                alert('Já existe um preset com este nome.');
                return;
            }
            const newPreset: AlchemyPreset = { 
                name: name.trim(), 
                basePrompt, 
                negativePrompt,
                mjParams, 
                gptParams, 
                geminiParams,
                isMjEnabled,
                isGptEnabled,
                isGeminiEnabled
            };
            setPresets(prev => [...prev, newPreset].sort((a, b) => a.name.localeCompare(b.name)));
            setSelectedPreset(name.trim());
        }
    }, [basePrompt, negativePrompt, mjParams, gptParams, geminiParams, isMjEnabled, isGptEnabled, isGeminiEnabled, presets, setPresets]);

    const handlePresetChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        setSelectedPreset(name);
        if (name) {
            const preset = presets.find(p => p.name === name);
            if (preset) {
                setBasePrompt(preset.basePrompt);
                setNegativePrompt(preset.negativePrompt || '');
                setMjParams(preset.mjParams);
                setGptParams(preset.gptParams);
                setGeminiParams(preset.geminiParams);
                setIsMjEnabled(preset.isMjEnabled);
                setIsGptEnabled(preset.isGptEnabled);
                setIsGeminiEnabled(preset.isGeminiEnabled);
            }
        }
    }, [presets]);

    const handleDeletePreset = useCallback(() => {
        if (selectedPreset && window.confirm(`Tem certeza que deseja deletar o preset "${selectedPreset}"?`)) {
            setPresets(prev => prev.filter(p => p.name !== selectedPreset));
            setSelectedPreset('');
        }
    }, [selectedPreset, setPresets]);

    const handleResetAll = () => {
        setBasePrompt('');
        setNegativePrompt('');
        setMjParams(INITIAL_MJ_PARAMS);
        setGptParams(INITIAL_GPT_PARAMS);
        setGeminiParams(INITIAL_GEMINI_PARAMS);
        setIsMjEnabled(true);
        setIsGptEnabled(true);
        setIsGeminiEnabled(true);
        setResult(null);
        setSelectedPreset('');
    };

    const handleClearIdea = () => {
        setBasePrompt('');
        setNegativePrompt('');
    };
    
    const isGenerationDisabled = isLoading || !basePrompt.trim() || (!isMjEnabled && !isGptEnabled && !isGeminiEnabled);

    return (
        <div className="alchemy-interface h-full flex flex-col gap-6">
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
                {/* Left Column */}
                <div className="flex flex-col gap-0 min-h-0">
                    <div className="inner-scroll flex-grow pr-2 -mr-2 space-y-6">
                        <Card className="flex-grow flex flex-col p-4 md:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white font-gangofthree">Caldeirão</h2>
                                <button className="alchemy-clear-button" onClick={handleClearIdea}>
                                    <RefreshIcon className="w-4 h-4" />
                                    <span>Limpar Tela</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <TextArea label="Tópico Principal / Ideia" value={basePrompt} onChange={(e) => setBasePrompt(e.target.value)} placeholder="Ex: um caçador de onis com uma máscara de raposa..." rows={5} disabled={isLoading}/>
                                <TextArea label="Prompt Negativo (O que evitar)" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Ex: texto, blur, baixa qualidade, cartoon" rows={2} disabled={isLoading}/>
                            </div>
                        </Card>
                        <Card className="p-4 md:p-6">
                            <h3 className="text-lg font-bold text-white font-gangofthree mb-3">Presets da Alquimia</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex-grow">
                                    <Select label="" value={selectedPreset} onChange={handlePresetChange}>
                                        <option value="">Carregar preset...</option>
                                        {presets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                    </Select>
                                </div>
                                <Button variant="secondary" size="sm" onClick={handleSavePreset} className="!p-2" title="Salvar filtros atuais como um preset"><SaveIcon className="w-5 h-5" /></Button>
                                {selectedPreset && <Button variant="danger" size="sm" onClick={handleDeletePreset} className="!p-2" title="Deletar preset selecionado"><TrashIcon className="w-5 h-5" /></Button>}
                            </div>
                        </Card>
                        <Card className="p-4 md:p-6"><GptStructuredBuilder params={gptParams} onParamsChange={setGptParams} enabled={isGptEnabled} onEnabledChange={setIsGptEnabled} /></Card>
                        <Card className="p-4 md:p-6"><GeminiParameters params={geminiParams} onParamsChange={setGeminiParams} enabled={isGeminiEnabled} onEnabledChange={setIsGeminiEnabled} /></Card>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6 min-h-0">
                    <div className="inner-scroll flex-grow pr-2 -mr-2 space-y-6">
                        <Card className="p-4 md:p-6"><MidjourneyParameters params={mjParams} onParamsChange={setMjParams} enabled={isMjEnabled} onEnabledChange={setIsMjEnabled} /></Card>
                        
                        {(isLoading || result) && (
                            <div className="results-container">
                                {isLoading ? (
                                    <Card className="flex items-center justify-center p-6">
                                        <AlchemyLoadingIndicator />
                                    </Card>
                                ) : result ? (
                                    <PromptResultDisplay result={result} />
                                ) : null}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-shrink-0">
                        <Card className="p-4 md:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <Button variant="secondary" onClick={handleResetAll} disabled={isLoading}>Resetar Tudo</Button>
                                <Button onClick={handleGenerate} disabled={isGenerationDisabled} className="alchemist-button flex-grow">
                                    <MagicWandIcon className="w-5 h-5" />
                                    {isLoading ? 'Destilando...' : 'Gerar Prompts'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};