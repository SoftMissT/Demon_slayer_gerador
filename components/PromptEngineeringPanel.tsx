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
import type { MidjourneyParameters as MidjourneyParams, GptParameters as GptParams, GeminiParameters as GeminiParams, PromptGenerationResult, AlchemyHistoryItem, FavoriteItem } from '../types';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';
import { Select } from './ui/Select';
import { RefreshIcon } from './icons/RefreshIcon';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { generatePrompts } from '../lib/client/orchestrationService';
import { DiscordIcon } from './icons/DiscordIcon';
import { v4 as uuidv4 } from 'uuid';

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

type AlchemyPreset = AlchemyHistoryItem['inputs'] & {
    name: string;
};

interface PromptEngineeringPanelProps {
    isAuthenticated: boolean;
    onLoginClick: () => void;
    history: AlchemyHistoryItem[];
    setHistory: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
    favorites: AlchemyHistoryItem[];
    onToggleFavorite: (item: FavoriteItem) => void;
    itemToLoad: AlchemyHistoryItem | null;
    onItemLoaded: () => void;
}

const AuthOverlay: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <h3 className="text-2xl font-bold font-gangofthree text-white mb-4">Acesso Restrito</h3>
        <p className="text-gray-300 mb-6">Por favor, entre com sua conta do Discord para usar a Alquimia.</p>
        <Button onClick={onLoginClick} className="!w-auto !flex-row !gap-2 !px-6 !py-3 !text-base">
            <DiscordIcon className="w-6 h-6" />
            Entrar com Discord
        </Button>
    </div>
);

export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({
    isAuthenticated,
    onLoginClick,
    history,
    setHistory,
    favorites,
    onToggleFavorite,
    itemToLoad,
    onItemLoaded,
}) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MidjourneyParams>(INITIAL_MJ_PARAMS);
    const [isMjEnabled, setIsMjEnabled] = useState(true);
    const [gptParams, setGptParams] = useState<GptParams>(INITIAL_GPT_PARAMS);
    const [isGptEnabled, setIsGptEnabled] = useState(true);
    const [geminiParams, setGeminiParams] = useState<GeminiParams>(INITIAL_GEMINI_PARAMS);
    const [isGeminiEnabled, setIsGeminiEnabled] = useState(true);
    
    const [result, setResult] = useState<PromptGenerationResult | null>(null);
    const [lastGeneration, setLastGeneration] = useState<AlchemyHistoryItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [presets, setPresets] = useState<AlchemyPreset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string>('');
    
    const loadState = useCallback((state: AlchemyHistoryItem['inputs']) => {
        setBasePrompt(state.basePrompt);
        setNegativePrompt(state.negativePrompt);
        setMjParams(state.mjParams);
        setGptParams(state.gptParams);
        setGeminiParams(state.geminiParams);
        setIsMjEnabled(state.isMjEnabled);
        setIsGptEnabled(state.isGptEnabled);
        setIsGeminiEnabled(state.isGeminiEnabled);
    }, []);

    useEffect(() => {
        if(itemToLoad) {
            loadState(itemToLoad.inputs);
            setResult(itemToLoad.result);
            setLastGeneration(itemToLoad);
            onItemLoaded();
        }
    }, [itemToLoad, loadState, onItemLoaded]);

    const handleGenerate = useCallback(async () => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setLastGeneration(null);
        
        try {
            const inputs = {
                basePrompt, negativePrompt, mjParams, gptParams, geminiParams, isMjEnabled, isGptEnabled, isGeminiEnabled
            };
            const data = await generatePrompts({
                basePrompt: `Tópico Principal: ${basePrompt}. Evitar: ${negativePrompt || 'Nenhum'}.`,
                mjParams,
                gptParams,
                geminiParams,
                generateMidjourney: isMjEnabled,
                generateGpt: isGptEnabled,
                generateGemini: isGeminiEnabled,
            });

            const historyEntry: AlchemyHistoryItem = {
                id: uuidv4(),
                createdAt: new Date().toISOString(),
                inputs,
                result: data,
            };

            setResult(data);
            setLastGeneration(historyEntry);
            setHistory(prev => [historyEntry, ...prev].slice(0, 100));

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [basePrompt, negativePrompt, mjParams, gptParams, geminiParams, isMjEnabled, isGptEnabled, isGeminiEnabled, isAuthenticated, onLoginClick, setHistory]);

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
        setLastGeneration(null);
        setSelectedPreset('');
    };

    const handleClearIdea = () => {
        setBasePrompt('');
        setNegativePrompt('');
    };
    
    const isGenerationDisabled = !basePrompt.trim() || (!isMjEnabled && !isGptEnabled && !isGeminiEnabled);

    const handleGenerateClick = () => {
        if (isLoading) return;
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        if (!isGenerationDisabled) {
            handleGenerate();
        }
    };

    return (
        <div className="alchemy-interface h-full flex flex-col gap-6 relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} />}
            <div className={`h-full flex flex-col ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                <ErrorDisplay message={error} onDismiss={() => setError(null)} />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow min-h-0">
                    {/* Column 1: Inputs & Actions */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card className="flex-grow flex flex-col p-4 md:p-6 forge-panel">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white font-gangofthree">Caldeirão</h2>
                                <button className="button" onClick={handleClearIdea}>
                                    <RefreshIcon className="w-4 h-4" />
                                    <span>Limpar Ideia</span>
                                </button>
                            </div>
                            <div className="space-y-4 flex-grow flex flex-col">
                                <TextArea label="Tópico Principal / Ideia" value={basePrompt} onChange={(e) => setBasePrompt(e.target.value)} placeholder="Ex: um caçador de onis com uma máscara de raposa..." rows={5} disabled={isLoading} className="flex-grow"/>
                                <TextArea label="Prompt Negativo (O que evitar)" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Ex: texto, blur, baixa qualidade, cartoon" rows={2} disabled={isLoading}/>
                            </div>
                        </Card>
                        <Card className="p-4 md:p-6 flex-shrink-0 forge-panel">
                             <div className="flex items-center justify-between gap-4">
                                <button onClick={handleResetAll} disabled={isLoading} className="button w-40">Resetar Tudo</button>
                                <button onClick={handleGenerateClick} disabled={isLoading || isGenerationDisabled} className="button flex-grow">
                                    <MagicWandIcon className="w-5 h-5" />
                                    {isLoading ? 'Destilando...' : 'Gerar Prompts'}
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Column 2: Parameters */}
                    <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
                         <div className="inner-scroll flex-grow pr-2 -mr-2 space-y-6">
                            <Card className="p-4 md:p-6 forge-panel"><GptStructuredBuilder params={gptParams} onParamsChange={setGptParams} enabled={isGptEnabled} onEnabledChange={setIsGptEnabled} /></Card>
                            <Card className="p-4 md:p-6 forge-panel"><GeminiParameters params={geminiParams} onParamsChange={setGeminiParams} enabled={isGeminiEnabled} onEnabledChange={setIsGeminiEnabled} /></Card>
                            <Card className="p-4 md:p-6 forge-panel"><MidjourneyParameters params={mjParams} onParamsChange={setMjParams} enabled={isMjEnabled} onEnabledChange={setIsMjEnabled} /></Card>
                        </div>
                    </div>
                    
                    {/* Column 3: Results */}
                    <div className="lg:col-span-4 flex flex-col min-h-0">
                        <div className="inner-scroll flex-grow pr-2 -mr-2">
                             {(isLoading || result) && (
                                <div className="results-container">
                                    {isLoading ? (
                                        <Card className="flex items-center justify-center p-6 forge-panel">
                                            <AlchemyLoadingIndicator />
                                        </Card>
                                    ) : result ? (
                                        <PromptResultDisplay 
                                            result={result}
                                            onToggleFavorite={lastGeneration ? () => onToggleFavorite(lastGeneration) : undefined}
                                            isFavorite={lastGeneration ? favorites.some(f => f.id === lastGeneration.id) : false}
                                        />
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};