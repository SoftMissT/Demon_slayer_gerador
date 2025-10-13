import React, { useState, useEffect, useCallback } from 'react';
import type { AlchemyHistoryItem, GptParameters, MidjourneyParameters, GeminiParameters, PromptGenerationResult, FavoriteItem } from '../types';
// FIX: Updated component import to use the new name `MidjourneyParametersComponent` after it was renamed to resolve a TypeScript error.
import { MidjourneyParametersComponent } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
// FIX: Updated component import to use the new name `GeminiParametersComponent` after it was renamed to resolve a TypeScript error.
import { GeminiParametersComponent } from './GeminiParameters';
import { PromptResultDisplay } from './PromptResultDisplay';
import { ImageGenerationPanel } from './ImageGenerationPanel';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { Checkbox } from './ui/Checkbox';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { generatePrompts } from '../lib/client/orchestrationService';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { AuthOverlay } from './AuthOverlay';

const INITIAL_MJ_PARAMS: MidjourneyParameters = {
    aspectRatio: { value: "16:9", active: true },
    version: { value: "6", active: true },
    style: { value: "raw", active: false },
    stylize: { value: 500, active: false },
    chaos: { value: 0, active: false },
    quality: { value: 1, active: false },
    weird: { value: 0, active: false },
    artStyle: { value: "Anime/Manga", active: true },
    lighting: { value: "Cinematic Lighting", active: true },
    colorPalette: { value: "Vibrant", active: true },
    composition: { value: "Dynamic Angle", active: true },
    detailLevel: { value: "Detailed", active: true },
};

const INITIAL_GPT_PARAMS: GptParameters = {
    tone: "Cinematic",
    style: "Concept Art",
    composition: "Dynamic Angle",
};

const INITIAL_GEMINI_PARAMS: GeminiParameters = {
    artStyle: "Anime/Manga",
    lighting: "Cinematic Lighting",
    colorPalette: "Vibrant",
    composition: "Dynamic Angle",
    detailLevel: "Detailed",
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

export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({
    isAuthenticated,
    onLoginClick,
    history, setHistory, favorites, onToggleFavorite, itemToLoad, onItemLoaded
}) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    
    const [mjParams, setMjParams] = useState<MidjourneyParameters>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>(INITIAL_GEMINI_PARAMS);
    
    const [isMjEnabled, setIsMjEnabled] = useState(true);
    const [isGptEnabled, setIsGptEnabled] = useState(true);
    const [isGeminiEnabled, setIsGeminiEnabled] = useState(true);
    
    const [result, setResult] = useState<PromptGenerationResult | null>(null);
    const [currentHistoryItem, setCurrentHistoryItem] = useState<AlchemyHistoryItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (itemToLoad) {
            setBasePrompt(itemToLoad.inputs.basePrompt);
            setNegativePrompt(itemToLoad.inputs.negativePrompt);
            setMjParams(itemToLoad.inputs.mjParams);
            setGptParams(itemToLoad.inputs.gptParams);
            setGeminiParams(itemToLoad.inputs.geminiParams);
            setIsMjEnabled(itemToLoad.inputs.isMjEnabled);
            setIsGptEnabled(itemToLoad.inputs.isGptEnabled);
            setIsGeminiEnabled(itemToLoad.inputs.isGeminiEnabled);
            setResult(itemToLoad.result);
            setCurrentHistoryItem(itemToLoad);
            onItemLoaded();
        }
    }, [itemToLoad, onItemLoaded]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setCurrentHistoryItem(null);

        try {
            const newResult = await generatePrompts({
                basePrompt,
                negativePrompt,
                mjParams,
                gptParams,
                geminiParams,
                generateMidjourney: isMjEnabled,
                generateGpt: isGptEnabled,
                generateGemini: isGeminiEnabled,
            });
            setResult(newResult);

            const newHistoryItem: AlchemyHistoryItem = {
                id: `alch_${Date.now()}`,
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
                result: newResult,
            };
            setCurrentHistoryItem(newHistoryItem);
            setHistory(prev => [newHistoryItem, ...prev].slice(0, 100));

        } catch (err: any) {
            setError(err.message || "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleFavorite = useCallback(() => {
        if (currentHistoryItem) {
            onToggleFavorite(currentHistoryItem);
        }
    }, [currentHistoryItem, onToggleFavorite]);

    const isFavorite = currentHistoryItem ? favorites.some(fav => fav.id === currentHistoryItem.id) : false;

    return (
        <div className="h-full relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} />}
            <div className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 h-full ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                {/* Column 1: Input & Parameters */}
                <div className="col-span-1 2xl:col-span-1 flex flex-col gap-6">
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 flex flex-col gap-4">
                        <h2 className="text-xl font-bold font-gangofthree text-white">Alquimia de Prompts</h2>
                        <TextArea
                            label="Caldeirão (Ideia Base)"
                            value={basePrompt}
                            onChange={(e) => setBasePrompt(e.target.value)}
                            placeholder="Ex: caçador de demônios com armadura de samurai de obsidiana..."
                            rows={4}
                        />
                        <TextArea
                            label="Filtro (Prompt Negativo)"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="Ex: baixa resolução, mãos deformadas, texto..."
                            rows={2}
                        />
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-400">Modelos a Otimizar:</p>
                            <div className="flex items-center gap-4">
                            <Checkbox label="Midjourney" checked={isMjEnabled} onChange={(e) => setIsMjEnabled(e.target.checked)} />
                            <Checkbox label="GPT" checked={isGptEnabled} onChange={(e) => setIsGptEnabled(e.target.checked)} />
                            <Checkbox label="Gemini" checked={isGeminiEnabled} onChange={(e) => setIsGeminiEnabled(e.target.checked)} />
                            </div>
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading || !basePrompt.trim()} className="w-full alchemist-button">
                            <MagicWandIcon className="w-5 h-5" />
                            {isLoading ? 'Destilando...' : 'Destilar Prompts'}
                        </Button>
                    </div>

                    {isMjEnabled && <MidjourneyParametersComponent params={mjParams} setParams={setMjParams} />}
                    {isGptEnabled && <GptStructuredBuilder params={gptParams} setParams={setGptParams} />}
                    {isGeminiEnabled && <GeminiParametersComponent params={geminiParams} setParams={setGeminiParams} />}
                </div>

                {/* Column 2: Results */}
                <div className="col-span-1 2xl:col-span-2 flex flex-col gap-6">
                    <div className="flex-grow flex flex-col">
                        {isLoading && (
                            <div className="flex-grow flex items-center justify-center">
                                <AlchemyLoadingIndicator />
                            </div>
                        )}
                        {!isLoading && result && (
                            <PromptResultDisplay 
                                result={result}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={isFavorite}
                            />
                        )}
                        {!isLoading && !result && (
                            <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-8">
                                <MagicWandIcon className="w-16 h-16 mb-4" />
                                <h3 className="text-xl font-bold text-white">Resultados da Alquimia</h3>
                                <p className="mt-2">Seus prompts otimizados aparecerão aqui.</p>
                            </div>
                        )}
                    </div>
                    {result?.geminiPrompt && (
                        <div className="flex-shrink-0">
                            <ImageGenerationPanel 
                                initialPrompt={result.geminiPrompt} 
                                mjParams={mjParams}
                                gptParams={gptParams}
                            />
                        </div>
                    )}
                </div>
            </div>
             {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
        </div>
    );
};