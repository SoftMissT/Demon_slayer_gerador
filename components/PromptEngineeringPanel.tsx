import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { Switch } from './ui/Switch';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { MidjourneyParametersComponent } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParametersComponent } from './GeminiParameters';
import { PromptResultDisplay } from './PromptResultDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { generatePrompts } from '../lib/client/orchestrationService';
import type { AlchemyHistoryItem, MidjourneyParameters as MJParams, GptParameters, GeminiParameters, PromptGenerationResult } from '../types';
import { PotionIcon } from './icons/PotionIcon';
import { AuthOverlay } from './AuthOverlay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { CauldronIcon } from './icons/CauldronIcon';

interface PromptEngineeringPanelProps {
    isAuthenticated: boolean;
    onLoginClick: () => void;
    history: AlchemyHistoryItem[];
    setHistory: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
    favorites: AlchemyHistoryItem[];
    setFavorites: React.Dispatch<React.SetStateAction<AlchemyHistoryItem[]>>;
    selectedItem: AlchemyHistoryItem | null;
}

const INITIAL_MJ_PARAMS: MJParams = {
    aspectRatio: { active: false, value: '16:9' },
    chaos: { active: false, value: 10 },
    quality: { active: false, value: 1 },
    style: { active: false, value: '' },
    stylize: { active: false, value: 250 },
    version: { active: false, value: '6.0' },
    weird: { active: false, value: 250 },
};

const INITIAL_GPT_PARAMS: GptParameters = {
    tone: 'Cinematic', style: 'Concept Art', composition: 'Dynamic Angle'
};

const INITIAL_GEMINI_PARAMS: GeminiParameters = {
    artStyle: 'Anime/Manga', lighting: 'Cinematic Lighting', colorPalette: 'Vibrant', composition: 'Dynamic Angle', detailLevel: 'Detailed'
};

export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({
    isAuthenticated, onLoginClick, history, setHistory, selectedItem
}) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MJParams>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>(INITIAL_GEMINI_PARAMS);
    const [generateFor, setGenerateFor] = useState({ midjourney: true, gpt: true, gemini: true });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<PromptGenerationResult | null>(null);

    useEffect(() => {
        if (selectedItem && selectedItem.inputs) {
            setBasePrompt(selectedItem.inputs.basePrompt);
            setNegativePrompt(selectedItem.inputs.negativePrompt || '');
            setMjParams(selectedItem.inputs.mjParams);
            setGptParams(selectedItem.inputs.gptParams);
            setGeminiParams(selectedItem.inputs.geminiParams);
            setGenerateFor(selectedItem.inputs.generateFor || { midjourney: true, gpt: true, gemini: true });
            setResults(selectedItem.outputs);
        }
    }, [selectedItem]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const generatedPrompts = await generatePrompts({
                basePrompt,
                negativePrompt,
                mjParams,
                gptParams,
                geminiParams,
                generateMidjourney: generateFor.midjourney,
                generateGpt: generateFor.gpt,
                generateGemini: generateFor.gemini,
            });
            setResults(generatedPrompts);

            // Add to history
            const newHistoryItem: AlchemyHistoryItem = {
                id: `alchemy_${Date.now()}`,
                createdAt: new Date().toISOString(),
                inputs: { basePrompt, negativePrompt, mjParams, gptParams, geminiParams, generateFor },
                outputs: generatedPrompts,
            };
            setHistory(prev => [newHistoryItem, ...prev]);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="alchemist" />}
            
            <Card className="flex flex-col">
                <div className="p-4 flex-shrink-0">
                    <h2 className="text-xl font-bold font-gangofthree text-white">Alquimista de Prompts</h2>
                    <p className="text-sm text-gray-400">Transforme ideias simples em prompts poderosos para IAs de imagem.</p>
                </div>

                <div className="flex-grow p-4 overflow-y-auto space-y-4 inner-scroll">
                    <TextArea label="Ideia Base" value={basePrompt} onChange={(e) => setBasePrompt(e.target.value)} rows={4} placeholder="Um caçador de demônios em uma floresta de bambu..." />
                    <TextArea label="Prompt Negativo (O que evitar)" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={2} placeholder="Ex: texto, blur, má anatomia..." />

                    <div className="grid grid-cols-3 gap-4 pt-2">
                        <Switch label="Midjourney" checked={generateFor.midjourney} onChange={e => setGenerateFor(p => ({ ...p, midjourney: e.target.checked }))} />
                        <Switch label="DALL-E / GPT" checked={generateFor.gpt} onChange={e => setGenerateFor(p => ({ ...p, gpt: e.target.checked }))} />
                        <Switch label="Gemini" checked={generateFor.gemini} onChange={e => setGenerateFor(p => ({ ...p, gemini: e.target.checked }))} />
                    </div>

                    <CollapsibleSection title="Parâmetros Midjourney" wrapperClassName="ingredient-flask" forceOpen={generateFor.midjourney}>
                        <MidjourneyParametersComponent params={mjParams} setParams={setMjParams} />
                    </CollapsibleSection>
                    <CollapsibleSection title="Estrutura GPT / DALL-E" wrapperClassName="ingredient-flask" forceOpen={generateFor.gpt}>
                        <GptStructuredBuilder params={gptParams} setParams={setGptParams} />
                    </CollapsibleSection>
                    <CollapsibleSection title="Alquimia Gemini" wrapperClassName="ingredient-flask" forceOpen={generateFor.gemini}>
                        <GeminiParametersComponent params={geminiParams} setParams={setGeminiParams} />
                    </CollapsibleSection>
                </div>
                <div className="p-4 flex-shrink-0 border-t border-gray-700">
                    <Button onClick={handleGenerate} disabled={isLoading || !basePrompt.trim() || Object.values(generateFor).every(v => !v)} className="w-full alchemist-button">
                        <PotionIcon className="w-5 h-5" />
                        {isLoading ? 'Destilando...' : 'Destilar Prompts'}
                    </Button>
                </div>
            </Card>

            <div className="flex flex-col h-full">
                {isLoading ? (
                    <Card className="flex-grow flex items-center justify-center">
                        <AlchemyLoadingIndicator />
                    </Card>
                ) : results ? (
                    <PromptResultDisplay results={results} />
                ) : (
                    <Card className="flex-grow flex items-center justify-center text-center text-gray-500">
                        <div>
                             <CauldronIcon className="w-24 h-24 mx-auto opacity-50" />
                            <p className="mt-4">Os prompts destilados aparecerão aqui.</p>
                        </div>
                    </Card>
                )}
            </div>
             <ErrorDisplay message={error} onDismiss={() => setError(null)} activeView="alchemist"/>
        </div>
    );
};