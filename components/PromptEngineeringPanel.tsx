
import React, { useState, useCallback, useMemo } from 'react';
import type { 
    AlchemyHistoryItem, 
    FavoriteItem,
    MidjourneyParameters,
    GptParameters,
    GeminiParameters,
    PromptGenerationResult,
    User
} from '../types';
import { AuthOverlay } from './AuthOverlay';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { CauldronIcon } from './icons/CauldronIcon';
import { Checkbox } from './ui/Checkbox';
import { MidjourneyParameters as MidjourneyParametersComponent } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParametersComponent } from './GeminiParameters';
import { ImageGenerationPanel } from './ImageGenerationPanel';
import { PromptResultDisplay } from './PromptResultDisplay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { generatePrompts } from '../lib/client/orchestrationService';
import { Bubbles } from './Bubbles';

// Initial state for parameters
const INITIAL_MJ_PARAMS: MidjourneyParameters = {
    aspectRatio: { active: false, value: '16:9' },
    chaos: { active: false, value: 0 },
    quality: { active: false, value: 1 },
    style: { active: false, value: '' },
    stylize: { active: false, value: 250 },
    version: { active: true, value: '6' },
    weird: { active: false, value: 0 },
    artStyle: { active: false, value: '' },
    lighting: { active: false, value: '' },
    colorPalette: { active: false, value: '' },
    composition: { active: false, value: '' },
    detailLevel: { active: false, value: '' },
};
const INITIAL_GPT_PARAMS: GptParameters = { tone: 'Cinematic', style: 'Concept Art', composition: 'Dynamic Angle' };
const INITIAL_GEMINI_PARAMS: GeminiParameters = { artStyle: 'Anime/Manga', lighting: 'Cinematic Lighting', colorPalette: 'Vibrant', composition: 'Dynamic Angle', detailLevel: 'Detailed' };

interface PromptEngineeringPanelProps {
    isAuthenticated: boolean;
    onLoginClick: () => void;
    history: AlchemyHistoryItem[];
    setHistory: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
    favorites: AlchemyHistoryItem[];
    setFavorites: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
}

export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({
    isAuthenticated,
    onLoginClick,
    history,
    setHistory,
    favorites,
    setFavorites
}) => {
    // Input state
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MidjourneyParameters>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>(INITIAL_GEMINI_PARAMS);

    // Generation state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<PromptGenerationResult | null>(null);

    // Models to generate for
    const [generateFor, setGenerateFor] = useState({
        midjourney: true,
        gpt: true,
        gemini: true
    });

    const handleGenerate = useCallback(async () => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        if (!basePrompt.trim()) {
            setError("Por favor, insira um prompt base para começar a alquimia.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);
        
        try {
            const generated = await generatePrompts({
                basePrompt,
                negativePrompt,
                mjParams,
                gptParams,
                geminiParams,
                generateMidjourney: generateFor.midjourney,
                generateGpt: generateFor.gpt,
                generateGemini: generateFor.gemini,
            });
            setResults(generated);
            // Add to history
            const historyItem: AlchemyHistoryItem = {
                id: `alchemy_${Date.now()}`,
                createdAt: new Date().toISOString(),
                inputs: { basePrompt, negativePrompt, mjParams, gptParams, geminiParams },
                outputs: generated,
            };
            setHistory(prev => [historyItem, ...prev].slice(0, 100));

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido durante a geração do prompt.');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, onLoginClick, basePrompt, negativePrompt, mjParams, gptParams, geminiParams, generateFor, setHistory]);
    
    const handleToggleFavorite = useCallback((itemToToggle: AlchemyHistoryItem) => {
        setFavorites(prev => {
            const isFav = prev.some(item => item.id === itemToToggle.id);
            if (isFav) {
                return prev.filter(item => item.id !== itemToToggle.id);
            } else {
                return [itemToToggle, ...prev];
            }
        });
    }, [setFavorites]);

    const isCurrentResultFavorited = useMemo(() => {
        if (!results) return false;
        // A simple check; more robust would be to check content
        return history.length > 0 && favorites.some(fav => fav.id === history[0].id);
    }, [results, favorites, history]);

    return (
        <div className="h-full relative p-2">
            <Bubbles />
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} />}
            <div className={`h-full grid grid-cols-1 lg:grid-cols-2 gap-4 ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                
                {/* Left Column: Inputs */}
                <div className="flex flex-col gap-2 overflow-y-auto inner-scroll pr-1 pb-4">
                    <div className="alchemist-panel-header">
                        <h2 className="text-xl font-bold font-gangofthree text-white">Laboratório de Alquimia</h2>
                        <div className="magic-flow"></div>
                    </div>

                    <div className="ingredient-flask">
                        <TextArea
                            label="Ingrediente Principal (Prompt Base)"
                            value={basePrompt}
                            onChange={(e) => setBasePrompt(e.target.value)}
                            placeholder="Descreva a cena, personagem ou ideia principal..."
                            rows={4}
                        />
                        <TextArea
                            label="Catalisador Negativo (Opcional)"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="O que você quer evitar na imagem? Ex: texto, mãos feias, baixa qualidade..."
                            rows={2}
                        />
                    </div>
                    
                    <div className="ingredient-flask">
                         <div className="flex items-center gap-4 p-3">
                            <p className="text-sm font-medium text-gray-300">Destilar para:</p>
                            <Checkbox label="Midjourney" checked={generateFor.midjourney} onChange={e => setGenerateFor(f => ({ ...f, midjourney: e.target.checked }))} />
                            <Checkbox label="GPT / DALL-E" checked={generateFor.gpt} onChange={e => setGenerateFor(f => ({ ...f, gpt: e.target.checked }))} />
                            <Checkbox label="Gemini" checked={generateFor.gemini} onChange={e => setGenerateFor(f => ({ ...f, gemini: e.target.checked }))} />
                        </div>
                    </div>

                    {generateFor.midjourney && <div className="ingredient-flask"><MidjourneyParametersComponent params={mjParams} setParams={setMjParams} /></div>}
                    {generateFor.gpt && <div className="ingredient-flask"><GptStructuredBuilder params={gptParams} setParams={setGptParams} /></div>}
                    {generateFor.gemini && <div className="ingredient-flask"><GeminiParametersComponent params={geminiParams} setParams={setGeminiParams} /></div>}
                </div>

                {/* Right Column: Outputs */}
                <div className="flex flex-col gap-2 overflow-y-auto inner-scroll pr-1">
                    <div className="cauldron-container">
                        {isLoading ? (
                            <AlchemyLoadingIndicator />
                        ) : (
                            <>
                            <CauldronIcon className="w-24 h-24 text-gray-400 mb-4 animate-float" />
                            <Button 
                                onClick={handleGenerate} 
                                disabled={!basePrompt.trim()} 
                                className="w-full max-w-xs alchemist-button"
                            >
                                <MagicWandIcon className="w-5 h-5"/>
                                Destilar Prompts
                            </Button>
                            </>
                        )}
                    </div>
                    
                    {results ? (
                        <PromptResultDisplay 
                            results={results}
                            inputs={{ basePrompt, negativePrompt, mjParams, gptParams, geminiParams }}
                            onRegenerate={handleGenerate}
                            onFavorite={handleToggleFavorite}
                            isFavorited={isCurrentResultFavorited}
                        />
                    ) : !isLoading && (
                         <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
                            <h2 className="text-2xl font-bold font-gangofthree text-white">Caldeirão Vazio</h2>
                            <p className="mt-2 max-w-md">Adicione seus ingredientes, ajuste os catalisadores e clique em "Destilar" para criar poções de prompt otimizadas.</p>
                        </div>
                    )}
                    
                    {results?.geminiPrompt && (
                        <ImageGenerationPanel 
                            initialPrompt={results.geminiPrompt} 
                            mjParams={mjParams}
                            gptParams={gptParams}
                        />
                    )}
                </div>
            </div>
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};
