

import React, { useState, useCallback, useMemo } from 'react';
import type { MidjourneyParameters, GptParameters, GeminiParameters, PromptGenerationResult, AlchemyHistoryItem, User } from '../types';
import { AuthOverlay } from './AuthOverlay';
import { MidjourneyParametersComponent } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParametersComponent } from './GeminiParameters';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { TextInput } from './ui/TextInput';
import { Switch } from './ui/Switch';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { generatePrompts } from '../lib/client/orchestrationService';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { PromptResultDisplay } from './PromptResultDisplay';
import { ImageGenerationPanel } from './ImageGenerationPanel';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
// FIX: Added missing import for the Card component.
import { Card } from './ui/Card';

interface PromptEngineeringPanelProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  history: AlchemyHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
  favorites: AlchemyHistoryItem[];
  setFavorites: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
}

const INITIAL_MJ_PARAMS: MidjourneyParameters = {
  aspectRatio: { value: "16:9", active: true },
  version: { value: "6.0", active: true },
  style: { value: "raw", active: false },
  stylize: { value: 250, active: true },
  chaos: { value: 0, active: false },
  weird: { value: 0, active: false },
  // Descriptive params
  artStyle: { value: "cinematic", active: false },
  lighting: { value: "dramatic lighting", active: false },
  colorPalette: { value: "vibrant colors", active: false },
  composition: { value: "dynamic angle", active: false },
  detailLevel: { value: "ultra detailed", active: false },
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


export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({
    isAuthenticated,
    onLoginClick,
    history,
    setHistory,
    favorites,
    setFavorites,
}) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MidjourneyParameters>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>(INITIAL_GEMINI_PARAMS);
    
    const [generateMidjourney, setGenerateMidjourney] = useState(true);
    const [generateGpt, setGenerateGpt] = useState(true);
    const [generateGemini, setGenerateGemini] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<PromptGenerationResult | null>(null);
    
    const [lastGeneration, setLastGeneration] = useState<AlchemyHistoryItem | null>(null);

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
        setResults(null);
        
        const requestData = {
            basePrompt,
            negativePrompt,
            mjParams,
            gptParams,
            geminiParams,
            generateMidjourney,
            generateGpt,
            generateGemini,
        };

        try {
            const generatedPrompts = await generatePrompts(requestData);
            setResults(generatedPrompts);
            
            const historyItem: AlchemyHistoryItem = {
                id: `alchemy_${Date.now()}`,
                createdAt: new Date().toISOString(),
                inputs: requestData,
                outputs: generatedPrompts,
            };
            setHistory(prev => [historyItem, ...prev].slice(0, 100));
            setLastGeneration(historyItem);
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    }, [
        basePrompt, negativePrompt, mjParams, gptParams, geminiParams, 
        generateMidjourney, generateGpt, generateGemini, 
        isAuthenticated, onLoginClick, setHistory
    ]);

    const isFavorited = useMemo(() => {
        if (!lastGeneration) return false;
        return favorites.some(fav => fav.id === lastGeneration.id);
    }, [favorites, lastGeneration]);

    const handleToggleFavorite = useCallback((item: AlchemyHistoryItem) => {
        setFavorites(prev => {
            const isFav = prev.some(fav => fav.id === item.id);
            if (isFav) {
                return prev.filter(fav => fav.id !== item.id);
            }
            return [item, ...prev];
        });
    }, [setFavorites]);
    
    return (
        <div className="h-full relative">
             {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} />}
             <div className={`grid grid-cols-1 lg:grid-cols-2 h-full gap-2 ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                
                {/* Left Panel: Inputs & Parameters */}
                <div className="flex flex-col gap-4 h-full overflow-y-auto inner-scroll p-2 -m-2">
                    <Card className="!p-4 flex-shrink-0">
                         <h2 className="text-xl font-bold font-gangofthree text-white mb-4">Ingredientes do Prompt</h2>
                         <div className="space-y-4">
                            <TextArea 
                                label="Prompt Base"
                                value={basePrompt}
                                onChange={e => setBasePrompt(e.target.value)}
                                placeholder="Ex: Um caçador de demônios em uma floresta de bambu sob a lua cheia"
                                rows={3}
                                tooltip="A ideia central da sua imagem."
                            />
                             <TextInput
                                label="Prompt Negativo (Opcional)"
                                value={negativePrompt}
                                onChange={e => setNegativePrompt(e.target.value)}
                                placeholder="Ex: texto, blur, baixa qualidade"
                                tooltip="Elementos que você quer evitar na imagem."
                            />
                         </div>
                    </Card>
                    
                    <div className="flex-shrink-0">
                         <h3 className="text-lg font-bold font-gangofthree text-white mb-2 ml-1">Modelos para Destilar</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-gray-900/50 rounded-lg">
                            <Switch label="Midjourney" checked={generateMidjourney} onChange={e => setGenerateMidjourney(e.target.checked)}/>
                            <Switch label="GPT / DALL-E" checked={generateGpt} onChange={e => setGenerateGpt(e.target.checked)}/>
                            <Switch label="Gemini" checked={generateGemini} onChange={e => setGenerateGemini(e.target.checked)}/>
                         </div>
                    </div>
                    
                    {generateMidjourney && <MidjourneyParametersComponent params={mjParams} setParams={setMjParams} />}
                    {generateGpt && <GptStructuredBuilder params={gptParams} setParams={setGptParams} />}
                    {generateGemini && <GeminiParametersComponent params={geminiParams} setParams={setGeminiParams} />}

                     <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !basePrompt.trim()} 
                        className="alchemist-button w-full mt-auto flex-shrink-0 sticky bottom-0"
                    >
                        <MagicWandIcon className="w-5 h-5"/>
                        {isLoading ? 'Destilando...' : 'Destilar Prompts'}
                    </Button>
                </div>

                {/* Right Panel: Results & Image Generation */}
                <div className="flex flex-col gap-4 h-full overflow-y-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full"><AlchemyLoadingIndicator /></div>
                    ) : results ? (
                        <div className="flex flex-col h-full gap-4">
                            <div className="flex-grow min-h-0">
                                <PromptResultDisplay 
                                    results={results}
                                    inputs={{ basePrompt, negativePrompt, mjParams, gptParams, geminiParams }}
                                    onRegenerate={handleGenerate}
                                    onFavorite={handleToggleFavorite}
                                    isFavorited={isFavorited}
                                />
                            </div>
                            <div className="flex-grow min-h-0">
                                <ImageGenerationPanel
                                    initialPrompt={results.geminiPrompt || results.gptPrompt || basePrompt}
                                    mjParams={mjParams}
                                    gptParams={gptParams}
                                />
                            </div>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <MagicWandIcon className="w-16 h-16 mb-6 text-gray-600" />
                            <h2 className="text-2xl font-bold font-gangofthree text-white">Alquimista de Prompts</h2>
                            <p className="text-gray-400 mt-2 max-w-md">Preencha os ingredientes à esquerda e clique em "Destilar" para criar prompts otimizados para diferentes IAs de imagem. Os resultados aparecerão aqui.</p>
                        </div>
                    )}
                </div>

             </div>
             <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};