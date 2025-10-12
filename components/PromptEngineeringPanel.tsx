
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

const INITIAL_MJ_PARAMS: MidjourneyParams = {
    aspectRatio: { value: '1:1', active: false },
    version: { value: '6', active: false },
    style: { value: 'raw', active: false },
    stylize: { value: 100, active: false },
    chaos: { value: 0, active: false },
    quality: { value: 1, active: false },
    weird: { value: 0, active: false },
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
    mjParams: MidjourneyParams;
    gptParams: GptParams;
    geminiParams: GeminiParams;
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
    const [loaderText, setLoaderText] = useState('Gerando prompts...');

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setLoaderText('Destilando Magia...');
        
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
            const newPreset: AlchemyPreset = { name: name.trim(), basePrompt, mjParams, gptParams, geminiParams };
            setPresets(prev => [...prev, newPreset].sort((a, b) => a.name.localeCompare(b.name)));
            setSelectedPreset(name.trim());
        }
    }, [basePrompt, mjParams, gptParams, geminiParams, presets, setPresets]);

    const handlePresetChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        setSelectedPreset(name);
        if (name) {
            const preset = presets.find(p => p.name === name);
            if (preset) {
                setBasePrompt(preset.basePrompt);
                setMjParams(preset.mjParams);
                setGptParams(preset.gptParams);
                setGeminiParams(preset.geminiParams);
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                <div className="flex flex-col gap-6">
                     <Card className="flex-grow flex flex-col p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-white font-gangofthree">Caldeirão</h2>
                             <Button variant="ghost" size="sm" onClick={handleClearIdea}>
                                <RefreshIcon className="w-4 h-4" />
                                Limpar Ideia
                             </Button>
                        </div>
                         <div className="space-y-4">
                            <TextArea label="Tópico Principal / Ideia" value={basePrompt} onChange={(e) => setBasePrompt(e.target.value)} placeholder="Ex: um caçador de onis com uma máscara de raposa..." rows={3} disabled={isLoading}/>
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
                     <div className="inner-scroll flex-grow pr-2 -mr-2 space-y-6">
                         <Card className="p-4 md:p-6"><GptStructuredBuilder params={gptParams} onParamsChange={setGptParams} enabled={isGptEnabled} onEnabledChange={setIsGptEnabled} /></Card>
                         <Card className="p-4 md:p-6"><GeminiParameters params={geminiParams} onParamsChange={setGeminiParams} enabled={isGeminiEnabled} onEnabledChange={setIsGeminiEnabled} /></Card>
                     </div>
                </div>
                <div className="flex flex-col gap-6">
                    <Card className="p-4 md:p-6"><MidjourneyParameters params={mjParams} onParamsChange={setMjParams} enabled={isMjEnabled} onEnabledChange={setIsMjEnabled} /></Card>
                    <div className="mt-auto">
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

            {(isLoading || result) && (
                 <div className="results-container mt-6">
                    {isLoading ? (
                        <Card className="flex items-center justify-center h-64">
                             <div className="🤚">
                                <div className="👉"></div>
                                <div className="👉"></div>
                                <div className="👉"></div>
                                <div className="👉"></div>
                                <div className="🌴"></div>		
                                <div className="👍"></div>
                            </div>
                        </Card>
                    ) : result ? (
                        <PromptResultDisplay result={result} />
                    ) : null}
                </div>
            )}
        </div>
    );
};
