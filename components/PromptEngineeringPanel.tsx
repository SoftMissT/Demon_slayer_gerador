import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthOverlay } from './AuthOverlay';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { MidjourneyParameters } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParametersComponent } from './GeminiParameters';
import { PromptResultDisplay } from './PromptResultDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { Checkbox } from './ui/Checkbox';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { generatePrompts } from '../lib/client/orchestrationService';
import { MagicWandIcon } from './icons/MagicWandIcon';
import type {
    User,
    AlchemyHistoryItem,
    MidjourneyParameters as MJParams,
    GptParameters,
    GeminiParameters,
    PromptGenerationResult
} from '../types';

const INITIAL_MJ_PARAMS: MJParams = {
    aspectRatio: { active: false, value: '16:9' },
    chaos: { active: false, value: 10 },
    quality: { active: false, value: 1 },
    style: { active: false, value: '' },
    stylize: { active: false, value: 250 },
    version: { active: false, value: '6' },
    weird: { active: false, value: 0 },
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
    selectedItem: AlchemyHistoryItem | null;
}

export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({
    isAuthenticated,
    onLoginClick,
    history,
    setHistory,
    favorites,
    setFavorites,
    selectedItem
}) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MJParams>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>(INITIAL_GEMINI_PARAMS);
    
    const [generateMidjourney, setGenerateMidjourney] = useState(true);
    const [generateGpt, setGenerateGpt] = useState(true);
    const [generateGemini, setGenerateGemini] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<PromptGenerationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const latestHistoryItem = useMemo(() => history[0] || null, [history]);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const resultData = await generatePrompts({
                basePrompt,
                negativePrompt,
                mjParams,
                gptParams,
                geminiParams,
                generateMidjourney,
                generateGpt,
                generateGemini,
            });
            setResults(resultData);
            const newHistoryItem: AlchemyHistoryItem = {
                id: `alchemy_${Date.now()}`,
                createdAt: new Date().toISOString(),
                inputs: { basePrompt, negativePrompt, mjParams, gptParams, geminiParams },
                outputs: resultData,
            };
            setHistory(prev => [newHistoryItem, ...prev]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [basePrompt, negativePrompt, mjParams, gptParams, geminiParams, generateMidjourney, generateGpt, generateGemini, setHistory]);

    const handleToggleFavorite = useCallback((item: AlchemyHistoryItem) => {
        setFavorites(prev =>
            prev.some(fav => fav.id === item.id)
                ? prev.filter(fav => fav.id !== item.id)
                : [item, ...prev]
        );
    }, [setFavorites]);
    
    const isFavorited = useMemo(() => {
        if (!latestHistoryItem) return false;
        return favorites.some(fav => fav.id === latestHistoryItem.id);
    }, [favorites, latestHistoryItem]);

    if (!isAuthenticated) {
        return <AuthOverlay onLoginClick={onLoginClick} view="alchemist" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
            {/* Left Panel: Inputs */}
            <div className="flex flex-col h-full bg-gray-900/50 rounded-lg border border-gray-700/50 p-3">
                <div className="overflow-y-auto space-y-4 inner-scroll pr-2">
                    <CollapsibleSection title="Prompt Base" defaultOpen>
                        <div className="space-y-4 p-2">
                            <TextArea label="Ideia Principal" value={basePrompt} onChange={(e) => setBasePrompt(e.target.value)} rows={4} placeholder="Ex: Um caçador de demônios com uma máscara de raposa em uma floresta de bambu..." />
                            <TextArea label="Prompt Negativo (O que evitar)" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={2} placeholder="Ex: texto, logos, má qualidade, deformado" />
                        </div>
                    </CollapsibleSection>
                    
                     <CollapsibleSection title="Modelos Alvo">
                        <div className="p-2 space-y-2">
                            <Checkbox label="Gerar para Midjourney" checked={generateMidjourney} onChange={e => setGenerateMidjourney(e.target.checked)} />
                            <Checkbox label="Gerar para DALL-E / GPT" checked={generateGpt} onChange={e => setGenerateGpt(e.target.checked)} />
                            <Checkbox label="Gerar para Gemini" checked={generateGemini} onChange={e => setGenerateGemini(e.target.checked)} />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Parâmetros Midjourney">
                        <div className="p-2">
                            <MidjourneyParameters params={mjParams} setParams={setMjParams} />
                        </div>
                    </CollapsibleSection>
                    <CollapsibleSection title="Estrutura GPT">
                        <div className="p-2">
                            <GptStructuredBuilder params={gptParams} setParams={setGptParams} />
                        </div>
                    </CollapsibleSection>
                    <CollapsibleSection title="Parâmetros Gemini">
                         <div className="p-2">
                            <GeminiParametersComponent params={geminiParams} setParams={setGeminiParams} />
                        </div>
                    </CollapsibleSection>
                </div>
                <div className="pt-3 border-t border-gray-700/50">
                    <Button onClick={handleGenerate} disabled={isLoading || !basePrompt.trim()} className="w-full alchemist-button" size="lg">
                        <MagicWandIcon className="w-5 h-5" />
                        {isLoading ? 'Destilando...' : 'Destilar Prompts'}
                    </Button>
                </div>
            </div>

            {/* Right Panel: Outputs */}
            <div className="h-full">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center">
                            <AlchemyLoadingIndicator />
                        </motion.div>
                    ) : results ? (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <PromptResultDisplay
                                results={results}
                                inputs={{ basePrompt, negativePrompt, mjParams, gptParams, geminiParams }}
                                onRegenerate={handleGenerate}
                                historyItem={latestHistoryItem}
                                onFavorite={handleToggleFavorite}
                                isFavorited={isFavorited}
                            />
                        </motion.div>
                    ) : (
                        <div key="placeholder" className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <MagicWandIcon className="w-24 h-24 mb-6 opacity-20 text-gray-500" />
                            <h2 className="text-2xl font-bold font-gangofthree text-white">Caldeirão Vazio</h2>
                            <p className="text-gray-400 mt-2 max-w-md">Preencha os ingredientes do seu prompt e clique em "Destilar" para iniciar a alquimia.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};