import React, { useState, useCallback, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { AccordionSection } from './AccordionSection';
import { MidjourneyParameters as MidjourneyParamsComponent } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParametersComponent as GeminiParamsComponent } from './GeminiParameters';
import { PromptResultDisplay } from './PromptResultDisplay';
import type { MidjourneyParameters, GptParameters, GeminiParameters, PromptGenerationResult, AlchemyHistoryItem } from '../types';
import { generatePrompts } from '../lib/client/orchestrationService';
import { AuthOverlay } from './AuthOverlay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { ImageGenerationPanel } from './ImageGenerationPanel';


const INITIAL_MJ_PARAMS: MidjourneyParameters = {
    aspectRatio: { active: true, value: '16:9' },
    chaos: { active: false, value: 10 },
    quality: { active: true, value: 1 },
    style: { active: true, value: 'raw' },
    stylize: { active: false, value: 250 },
    version: { active: true, value: '6.0' },
    weird: { active: false, value: 0 },
    artStyle: { active: false, value: 'cinematic' },
    lighting: { active: false, value: 'dramatic' },
    colorPalette: { active: false, value: 'vibrant' },
    composition: { active: false, value: 'dynamic angle' },
    detailLevel: { active: false, value: 'hyper-detailed' }
};

const INITIAL_GPT_PARAMS: GptParameters = {
    tone: 'Cinematic',
    style: 'Concept Art',
    composition: 'Dynamic Angle'
};

const INITIAL_GEMINI_PARAMS: GeminiParameters = {
    artStyle: 'Anime/Manga',
    lighting: 'Cinematic Lighting',
    colorPalette: 'Vibrant',
    composition: 'Dynamic Angle',
    detailLevel: 'Detailed'
};

const INITIAL_GENERATE_FOR = {
    midjourney: true,
    gpt: true,
    gemini: true
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

export const PromptEngineeringPanel: React.FC<PromptEngineeringPanelProps> = ({ isAuthenticated, onLoginClick, history, setHistory, selectedItem }) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MidjourneyParameters>(INITIAL_MJ_PARAMS);
    const [gptParams, setGptParams] = useState<GptParameters>(INITIAL_GPT_PARAMS);
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>(INITIAL_GEMINI_PARAMS);
    const [generateFor, setGenerateFor] = useState(INITIAL_GENERATE_FOR);
    const [results, setResults] = useState<PromptGenerationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'prompts' | 'image'>('prompts');

    useEffect(() => {
        if (selectedItem) {
            setBasePrompt(selectedItem.inputs.basePrompt);
            setNegativePrompt(selectedItem.inputs.negativePrompt || '');
            setMjParams(selectedItem.inputs.mjParams || INITIAL_MJ_PARAMS);
            setGptParams(selectedItem.inputs.gptParams || INITIAL_GPT_PARAMS);
            setGeminiParams(selectedItem.inputs.geminiParams || INITIAL_GEMINI_PARAMS);
            setGenerateFor(selectedItem.inputs.generateFor || INITIAL_GENERATE_FOR);
            setResults(selectedItem.outputs);
        }
    }, [selectedItem]);
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
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
            const newHistoryItem: AlchemyHistoryItem = {
                id: `alch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                createdAt: new Date().toISOString(),
                inputs: { basePrompt, negativePrompt, mjParams, gptParams, geminiParams, generateFor },
                outputs: generated
            };
            setHistory(prev => [newHistoryItem, ...prev]);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full relative">
            {!isAuthenticated && <AuthOverlay onLoginClick={onLoginClick} view="alchemist" />}

            <div className="lg:col-span-4 h-full">
                <Card className="h-full flex flex-col !p-0">
                    <div className="p-4 border-b border-gray-700 flex-shrink-0">
                        <h2 className="text-lg font-bold text-white font-gangofthree">Alquimista de Prompts</h2>
                        <p className="text-sm text-gray-400">Crie e refine prompts para IA de imagem.</p>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 inner-scroll">
                        <TextArea label="Ideia Base" value={basePrompt} onChange={(e) => setBasePrompt(e.target.value)} placeholder="Ex: um caçador de onis em uma floresta de bambu à noite" rows={4} />
                        <TextArea label="Prompt Negativo (Opcional)" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Ex: texto, marca d'água, baixa qualidade" rows={2} />
                        <AccordionSection title="Parâmetros Midjourney"><MidjourneyParamsComponent params={mjParams} setParams={setMjParams} /></AccordionSection>
                        <AccordionSection title="Estrutura GPT / DALL-E"><GptStructuredBuilder params={gptParams} setParams={setGptParams} /></AccordionSection>
                        <AccordionSection title="Alquimia Gemini"><GeminiParamsComponent params={geminiParams} setParams={setGeminiParams} /></AccordionSection>
                    </div>
                     <div className="p-4 border-t border-gray-700 flex-shrink-0 space-y-2">
                        <Button onClick={handleGenerate} disabled={isLoading || !basePrompt.trim()} className="w-full alchemist-button" size="lg">
                            <MagicWandIcon className="w-5 h-5" />
                            {isLoading ? 'Destilando...' : 'Gerar Prompts'}
                        </Button>
                    </div>
                </Card>
            </div>
            
             <div className="lg:col-span-8 h-full">
                <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 mb-2">
                        <div className="p-1 bg-gray-800 rounded-lg flex items-center w-min">
                            <Button variant={activeTab === 'prompts' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('prompts')}>Prompts Gerados</Button>
                            <Button variant={activeTab === 'image' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('image')}>Gerador de Imagem</Button>
                        </div>
                    </div>
                    <div className="flex-grow min-h-0">
                        {activeTab === 'prompts' ? (
                            isLoading ? (
                                <Card className="h-full flex items-center justify-center"><AlchemyLoadingIndicator /></Card>
                            ) : results ? (
                                <PromptResultDisplay results={results} />
                            ) : (
                                <Card className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                    <MagicWandIcon className="w-16 h-16 opacity-50 mb-4" />
                                    <p>Os prompts otimizados aparecerão aqui.</p>
                                </Card>
                            )
                        ) : (
                           <ImageGenerationPanel initialPrompt={basePrompt} mjParams={mjParams} gptParams={gptParams} />
                        )}
                    </div>
                </div>
            </div>
            {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} activeView="alchemist" />}
        </div>
    );
};
