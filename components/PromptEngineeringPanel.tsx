
import React, { useState, useCallback, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { MidjourneyParameters } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParameters } from './GeminiParameters';
import { PromptResultDisplay } from './PromptResultDisplay';
import { generatePrompts } from '../lib/client/orchestrationService';
import useLocalStorage from '../hooks/useLocalStorage';
import type { 
    AlchemyHistoryItem, 
    PromptGenerationResult, 
    MidjourneyParameters as MidjourneyParams,
    GptParameters as GptParams,
    GeminiParameters as GeminiParams
} from '../types';
import { RefreshIcon } from './icons/RefreshIcon';
import { DiscordIcon } from './icons/DiscordIcon';


const INITIAL_MJ_PARAMS: MidjourneyParams = {
    aspectRatio: { value: '16:9', active: true },
    version: { value: '7', active: false },
    style: { value: 'raw', active: false },
    stylize: { value: 700, active: true },
    chaos: { value: 0, active: false },
    quality: { value: 1, active: false },
    weird: { value: 0, active: false },
    artStyle: { value: 'anime_manga', active: true },
    lighting: { value: 'cinematica', active: true },
    colorPalette: { value: 'vibrante', active: true },
    composition: { value: 'dynamic_angle', active: true },
    detailLevel: { value: 'detalhado', active: true },
};

const INITIAL_GPT_PARAMS: GptParams = {
    tone: 'cinematic',
    style: 'concept_art',
    composition: 'dynamic_angle',
};

const INITIAL_GEMINI_PARAMS: GeminiParams = {
    artStyle: 'anime_manga',
    lighting: 'cinematica',
    colorPalette: 'vibrante',
    composition: 'dynamic_angle',
    detailLevel: 'detalhado',
};


interface PromptEngineeringPanelProps {
    isAuthenticated: boolean;
    onLoginClick: () => void;
    history: AlchemyHistoryItem[];
    setHistory: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
    favorites: AlchemyHistoryItem[];
    onToggleFavorite: (item: AlchemyHistoryItem) => void;
    itemToLoad: AlchemyHistoryItem | null;
    onItemLoaded: () => void;
}


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
    // Input state
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');

    const [isMjEnabled, setIsMjEnabled] = useState(true);
    const [mjParams, setMjParams] = useState<MidjourneyParams>(INITIAL_MJ_PARAMS);

    const [isGptEnabled, setIsGptEnabled] = useState(true);
    const [gptParams, setGptParams] = useState<GptParams>(INITIAL_GPT_PARAMS);

    const [isGeminiEnabled, setIsGeminiEnabled] = useState(true);
    const [geminiParams, setGeminiParams] = useState<GeminiParams>(INITIAL_GEMINI_PARAMS);

    // API call state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PromptGenerationResult | null>(null);
    const [currentHistoryItem, setCurrentHistoryItem] = useState<AlchemyHistoryItem | null>(null);

    const isFavorite = currentHistoryItem ? favorites.some(fav => fav.id === currentHistoryItem.id) : false;

    const handleToggleCurrentFavorite = useCallback(() => {
        if (currentHistoryItem) {
            onToggleFavorite(currentHistoryItem);
        }
    }, [currentHistoryItem, onToggleFavorite]);
    
    useEffect(() => {
        if (itemToLoad) {
            const { inputs, result: loadedResult } = itemToLoad;
            setBasePrompt(inputs.basePrompt);
            setNegativePrompt(inputs.negativePrompt);
            setMjParams(inputs.mjParams);
            setIsMjEnabled(inputs.isMjEnabled);
            setGptParams(inputs.gptParams);
            setIsGptEnabled(inputs.isGptEnabled);
            setGeminiParams(inputs.geminiParams);
            setIsGeminiEnabled(inputs.isGeminiEnabled);
            setResult(loadedResult);
            setCurrentHistoryItem(itemToLoad);
            onItemLoaded();
        }
    }, [itemToLoad, onItemLoaded]);


    const handleReset = () => {
        setBasePrompt('');
        setNegativePrompt('');
        setMjParams(INITIAL_MJ_PARAMS);
        setIsMjEnabled(true);
        setGptParams(INITIAL_GPT_PARAMS);
        setIsGptEnabled(true);
        setGeminiParams(INITIAL_GEMINI_PARAMS);
        setIsGeminiEnabled(true);
        setResult(null);
        setCurrentHistoryItem(null);
        setError(null);
    };

    const handleGenerate = useCallback(async () => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        if (!basePrompt.trim()) {
            setError("O prompt base não pode estar vazio.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setCurrentHistoryItem(null);

        try {
            const generatedResult = await generatePrompts({
                basePrompt,
                negativePrompt,
                mjParams,
                gptParams,
                geminiParams,
                generateMidjourney: isMjEnabled,
                generateGpt: isGptEnabled,
                generateGemini: isGeminiEnabled,
            });

            const newHistoryItem: AlchemyHistoryItem = {
                id: `alchemy_${Date.now()}`,
                createdAt: new Date().toISOString(),
                inputs: {
                    basePrompt,
                    negativePrompt,
                    mjParams,
                    gptParams,
                    geminiParams,
                    isMjEnabled,
                    isGptEnabled,
                    isGeminiEnabled,
                },
                result: generatedResult,
            };
            
            setResult(generatedResult);
            setCurrentHistoryItem(newHistoryItem);
            setHistory(prev => [newHistoryItem, ...prev].slice(0, 100));

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [
        basePrompt, negativePrompt, mjParams, gptParams, geminiParams, 
        isMjEnabled, isGptEnabled, isGeminiEnabled, 
        setHistory, isAuthenticated, onLoginClick
    ]);

    const isGenerateDisabled = isLoading || !basePrompt.trim() || (!isMjEnabled && !isGptEnabled && !isGeminiEnabled);

    return (
        <div className="h-full relative">
            {!isAuthenticated && (
                 <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-8 rounded-lg">
                    <h3 className="text-2xl font-bold font-gangofthree text-white mb-4">Acesso Restrito</h3>
                    <p className="text-gray-300 mb-6">Por favor, entre com sua conta do Discord para usar a Alquimia.</p>
                    <Button onClick={onLoginClick} className="!w-auto !flex-row !gap-2 !px-6 !py-3 !text-base">
                        <DiscordIcon className="w-6 h-6" />
                        Entrar com Discord
                    </Button>
                </div>
            )}
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 h-full ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                
                {/* Left Panel: Controls */}
                <div className="flex flex-col h-full">
                    <Card className="forge-panel flex-grow flex flex-col p-4">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white font-gangofthree">CALDEIRÃO DO ALQUIMISTA</h2>
                            <Button variant="secondary" size="sm" onClick={handleReset} title="Limpar tudo">
                                <RefreshIcon className="w-4 h-4" />
                                Limpar
                            </Button>
                        </div>
                        <div className="inner-scroll flex-grow pr-2 -mr-2 space-y-6">
                            <div className="space-y-4">
                                <TextArea 
                                    label="Prompt Base"
                                    value={basePrompt}
                                    onChange={(e) => setBasePrompt(e.target.value)}
                                    placeholder="Ex: um caçador de demônios com uma armadura de samurai feita de obsidiana..."
                                    rows={4}
                                    disabled={isLoading}
                                    tooltip="Sua ideia principal. Descreva o que você quer ver na imagem."
                                />
                                <TextArea 
                                    label="Prompt Negativo (Opcional)"
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    placeholder="Ex: sem texto, baixa qualidade, deformado..."
                                    rows={2}
                                    disabled={isLoading}
                                    tooltip="Elementos que você quer evitar na imagem final."
                                />
                            </div>
                            <div className="space-y-6">
                                <MidjourneyParameters params={mjParams} onParamsChange={setMjParams} enabled={isMjEnabled} onEnabledChange={setIsMjEnabled} />
                                <GptStructuredBuilder params={gptParams} onParamsChange={setGptParams} enabled={isGptEnabled} onEnabledChange={setIsGptEnabled} />
                                <GeminiParameters params={geminiParams} onParamsChange={setGeminiParams} enabled={isGeminiEnabled} onEnabledChange={setIsGeminiEnabled} />
                            </div>
                        </div>
                        <div className="mt-auto pt-6">
                            <Button onClick={handleGenerate} disabled={isGenerateDisabled} className="alchemist-button w-full">
                                <MagicWandIcon className="w-5 h-5" />
                                {isLoading ? 'Destilando Prompts...' : 'Destilar Prompts'}
                            </Button>
                        </div>
                    </Card>
                </div>
                
                {/* Right Panel: Results */}
                 <div className="flex flex-col h-full gap-6">
                    <div className="flex-grow min-h-0">
                        <Card className="forge-panel !p-4 h-full flex flex-col">
                            <h2 className="text-xl font-bold text-white font-gangofthree mb-4 flex-shrink-0">CRISTAL DE VISÃO</h2>
                            <div className="inner-scroll flex-grow pr-2 -mr-2">
                                {isLoading && <div className="flex items-center justify-center h-full"><AlchemyLoadingIndicator /></div>}
                                {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
                                {!isLoading && !result && (
                                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                        <MagicWandIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                                        <h3 className="text-lg font-semibold text-gray-400">A alquimia aguarda.</h3>
                                        <p>Seus prompts gerados aparecerão aqui.</p>
                                    </div>
                                )}
                                {result && (
                                    <PromptResultDisplay 
                                        result={result} 
                                        onToggleFavorite={handleToggleCurrentFavorite}
                                        isFavorite={isFavorite}
                                    />
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
