import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { 
    AlchemyHistoryItem, 
    FavoriteItem,
    MidjourneyParameters,
    GptParameters,
    GeminiParameters,
    PromptGenerationResult,
    User
} from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { AuthOverlay } from './AuthOverlay';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { CauldronIcon } from './icons/CauldronIcon';
import { Switch } from './ui/Switch';
import { MidjourneyParameters as MidjourneyParametersComponent } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParametersComponent } from './GeminiParameters';
import { PromptResultDisplay } from './PromptResultDisplay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { generatePrompts } from '../lib/client/orchestrationService';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';
import { Select } from './ui/Select';

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

interface PromptInputs {
    basePrompt: string;
    negativePrompt: string;
    mjParams: MidjourneyParameters;
    gptParams: GptParameters;
    geminiParams: GeminiParameters;
    generateFor: {
        midjourney: boolean;
        gpt: boolean;
        gemini: boolean;
    }
}
const INITIAL_INPUTS: PromptInputs = {
    basePrompt: '',
    negativePrompt: '',
    mjParams: INITIAL_MJ_PARAMS,
    gptParams: INITIAL_GPT_PARAMS,
    geminiParams: INITIAL_GEMINI_PARAMS,
    generateFor: { midjourney: true, gpt: true, gemini: true }
};


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
    selectedItem,
}) => {
    // Input state
    const [inputs, setInputs] = useState<PromptInputs>(INITIAL_INPUTS);
    
    // Generation state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<PromptGenerationResult | null>(null);

    // Preset state
    const [presets, setPresets] = useLocalStorage<Record<string, PromptInputs>>('kimetsu-alchemy-presets', {});
    const [selectedPreset, setSelectedPreset] = useState('');
    
    // Effect to load state from a selected history item
    useEffect(() => {
        if (selectedItem && selectedItem.inputs) {
            const { inputs: historyInputs } = selectedItem;
            setInputs({
                basePrompt: historyInputs.basePrompt,
                negativePrompt: historyInputs.negativePrompt || '',
                mjParams: historyInputs.mjParams || INITIAL_MJ_PARAMS,
                gptParams: historyInputs.gptParams || INITIAL_GPT_PARAMS,
                geminiParams: historyInputs.geminiParams || INITIAL_GEMINI_PARAMS,
                generateFor: { midjourney: !!selectedItem.outputs.midjourneyPrompt, gpt: !!selectedItem.outputs.gptPrompt, gemini: !!selectedItem.outputs.geminiPrompt }
            });
            setResults(selectedItem.outputs);
        }
    }, [selectedItem]);

    const handleGenerate = useCallback(async () => {
        if (!isAuthenticated) {
            onLoginClick();
            return;
        }
        if (!inputs.basePrompt.trim()) {
            setError("Por favor, insira um prompt base para começar a alquimia.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);
        
        try {
            const generated = await generatePrompts({
                basePrompt: inputs.basePrompt,
                negativePrompt: inputs.negativePrompt,
                mjParams: inputs.mjParams,
                gptParams: inputs.gptParams,
                geminiParams: inputs.geminiParams,
                generateMidjourney: inputs.generateFor.midjourney,
                generateGpt: inputs.generateFor.gpt,
                generateGemini: inputs.generateFor.gemini,
            });
            setResults(generated);
            const historyItem: AlchemyHistoryItem = {
                id: `alchemy_${Date.now()}`,
                createdAt: new Date().toISOString(),
                inputs: {
                    basePrompt: inputs.basePrompt,
                    negativePrompt: inputs.negativePrompt,
                    mjParams: inputs.mjParams,
                    gptParams: inputs.gptParams,
                    geminiParams: inputs.geminiParams
                },
                outputs: generated,
            };
            setHistory(prev => [historyItem, ...prev].slice(0, 100));

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido durante a geração do prompt.');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, onLoginClick, inputs, setHistory]);
    
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
        if (!results || !history.length) return false;
        const currentHistoryItem = history[0];
        return favorites.some(fav => fav.id === currentHistoryItem.id);
    }, [results, favorites, history]);

    // Preset Handlers
    const handleSavePreset = () => {
        const presetName = prompt("Digite um nome para este preset de Alquimia:");
        if (presetName && presetName.trim()) {
            setPresets(prev => ({ ...prev, [presetName.trim()]: inputs }));
            setSelectedPreset(presetName.trim());
        }
    };
    const handleLoadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetName = e.target.value;
        if (presetName && presets[presetName]) {
            setInputs(presets[presetName]);
            setSelectedPreset(presetName);
        } else {
            setSelectedPreset('');
        }
    };
    const handleDeletePreset = () => {
        if (selectedPreset && window.confirm(`Tem certeza que deseja apagar o preset "${selectedPreset}"?`)) {
            const newPresets = { ...presets };
            delete newPresets[selectedPreset];
            setPresets(newPresets);
            setSelectedPreset('');
        }
    };

    return (
        <div className="h-full relative p-2">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="alchemist" />}
            <div className={`h-full overflow-y-auto inner-scroll pr-1 pb-4 max-w-4xl mx-auto ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="flex flex-col gap-2">
                    
                    <div className="ingredient-flask">
                         <h3 className="text-lg font-bold text-center mb-2">Caldeirão Principal</h3>
                        <TextArea
                            label="Ingrediente Principal (Prompt Base)"
                            value={inputs.basePrompt}
                            onChange={(e) => setInputs(i => ({...i, basePrompt: e.target.value}))}
                            placeholder="Descreva a cena, personagem ou ideia principal..."
                            rows={4}
                        />
                        <TextArea
                            label="Catalisador Negativo (Opcional)"
                            value={inputs.negativePrompt}
                            onChange={(e) => setInputs(i => ({...i, negativePrompt: e.target.value}))}
                            placeholder="O que você quer evitar na imagem? Ex: texto, mãos feias, baixa qualidade..."
                            rows={2}
                        />
                        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">Gerenciar Presets de Alquimia</h3>
                            <div className="flex gap-2">
                                <div className="flex-grow">
                                    <Select label="" value={selectedPreset} onChange={handleLoadPreset}>
                                        <option value="">Carregar preset...</option>
                                        {Object.keys(presets).map(name => <option key={name} value={name}>{name}</option>)}
                                    </Select>
                                </div>
                                <Button variant="secondary" size="sm" onClick={handleSavePreset} title="Salvar preset atual">
                                    <SaveIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="danger" size="sm" onClick={handleDeletePreset} disabled={!selectedPreset} title="Apagar preset selecionado">
                                    <TrashIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="ingredient-flask">
                         <div className="flex items-center justify-around gap-4 p-3 flex-wrap">
                            <p className="text-sm font-medium flex-shrink-0">Destilar para:</p>
                            <Switch label="Midjourney" checked={inputs.generateFor.midjourney} onChange={e => setInputs(i => ({...i, generateFor: {...i.generateFor, midjourney: e.target.checked}}))} />
                            <Switch label="GPT / DALL-E" checked={inputs.generateFor.gpt} onChange={e => setInputs(i => ({...i, generateFor: {...i.generateFor, gpt: e.target.checked}}))} />
                            <Switch label="Gemini" checked={inputs.generateFor.gemini} onChange={e => setInputs(i => ({...i, generateFor: {...i.generateFor, gemini: e.target.checked}}))} />
                        </div>
                    </div>

                    {inputs.generateFor.midjourney && <CollapsibleSection title="Caldeirão Midjourney"><MidjourneyParametersComponent params={inputs.mjParams} setParams={p => setInputs(i => ({...i, mjParams: p}))} /></CollapsibleSection>}
                    {inputs.generateFor.gpt && <CollapsibleSection title="Caldeirão GPT"><GptStructuredBuilder params={inputs.gptParams} setParams={p => setInputs(i => ({...i, gptParams: p}))} /></CollapsibleSection>}
                    {inputs.generateFor.gemini && <CollapsibleSection title="Caldeirão Gemini"><GeminiParametersComponent params={inputs.geminiParams} setParams={p => setInputs(i => ({...i, geminiParams: p}))} /></CollapsibleSection>}
                    
                    <div className="cauldron-container my-4">
                        {isLoading ? (
                            <AlchemyLoadingIndicator />
                        ) : (
                            <>
                            <CauldronIcon className="w-24 h-24 text-gray-400 mb-4 animate-float" />
                            <Button 
                                onClick={handleGenerate} 
                                disabled={!inputs.basePrompt.trim()} 
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
                            inputs={history[0]?.inputs}
                            onRegenerate={handleGenerate}
                            onFavorite={handleToggleFavorite}
                            isFavorited={isCurrentResultFavorited}
                            historyItem={history[0]}
                        />
                    ) : !isLoading && (
                         <div className="flex flex-col items-center justify-center text-center text-gray-500 p-8">
                            <h2 className="text-2xl font-bold">Caldeirão Vazio</h2>
                            <p className="mt-2 max-w-md">Adicione seus ingredientes, ajuste os catalisadores e clique em "Destilar" para criar poções de prompt otimizadas.</p>
                        </div>
                    )}
                </div>
            </div>
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
    );
};