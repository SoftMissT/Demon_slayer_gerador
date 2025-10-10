
import React, { useState, useCallback } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { DetailPanel } from './components/DetailPanel';
import { Header } from './components/Header';
import { FavoritesModal } from './components/FavoritesModal';
import { Modal } from './components/ui/Modal';
import PromptEngineeringPanel from './components/PromptEngineeringPanel';
import { generateContent } from './services/geminiService';
import type { FilterState, GeneratedItem } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { ErrorDisplay } from './components/ui/ErrorDisplay';


const INITIAL_FILTERS: FilterState = {
  generationType: '',
  aiModel: 'Gemini',
  breathingBase: '',
  weaponType: '',
  grip: '',
  level: 10,
  theme: 'Sombrio',
  era: 'Período Edo (Japão Feudal)',
  rarity: 'Raro',
  seed: '',
  kekkijutsu: '',
  accessoryType: '',
  armaduraType: '',
  itemDeAuxilioType: '',
  consumableType: '',
  archetypeType: '',
  skillType: '',
};

const App: React.FC = () => {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [results, setResults] = useState<GeneratedItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('kny-forge-favorites', []);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [view, setView] = useState<'generator' | 'prompt_engineer'>('generator');
    

    const handleGenerate = useCallback(async (count: number = 1, baseItem?: GeneratedItem, variantType?: string) => {
        setIsLoading(true);
        setError(null);
        if (!baseItem) {
          setResults([]);
          setSelectedItem(null);
        }

        let promptModifier;
        if (baseItem && variantType) {
            promptModifier = `Crie uma variação "${variantType}" do seguinte item:\nNome: ${baseItem.nome}\nDescrição: ${baseItem.descricao_curta}`;
        }

        try {
            const newItems = await generateContent(filters, count, promptModifier);
            const itemsWithCategory = newItems.map(item => ({...item, categoria: item.categoria || filters.generationType}));
            
            setResults(prev => [...itemsWithCategory, ...prev]);
            if (itemsWithCategory.length > 0) {
                setSelectedItem(itemsWithCategory[0]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    const handleGenerateVariant = (baseItem: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
        handleGenerate(1, baseItem, variantType);
    };

    const handleReset = () => {
        setFilters(INITIAL_FILTERS);
        setResults([]);
        setSelectedItem(null);
    };
    
    const handleSelectResult = (item: GeneratedItem) => {
        setSelectedItem(item);
    };

    const isFavorite = (itemId: string) => favorites.some(fav => fav.id === itemId);

    const handleToggleFavorite = (item: GeneratedItem) => {
        setFavorites(prev => {
            if (isFavorite(item.id)) {
                return prev.filter(fav => fav.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleUpdateItem = (updatedItem: GeneratedItem) => {
        setResults(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        if (selectedItem?.id === updatedItem.id) {
            setSelectedItem(updatedItem);
        }
    }

    const selectFavorite = (item: GeneratedItem) => {
        // If the item is not in the current results, add it.
        if (!results.some(r => r.id === item.id)) {
            setResults(prev => [item, ...prev]);
        }
        setSelectedItem(item);
        setIsFavoritesModalOpen(false);
    }
    
    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
            <Header 
              onShowFavorites={() => setIsFavoritesModalOpen(true)} 
              onShowHelp={() => setIsHelpModalOpen(true)}
              onShowPromptEngineering={() => setView(view === 'generator' ? 'prompt_engineer' : 'generator')}
            />
            
            <main className="flex-grow p-4 lg:p-6 flex flex-col gap-4">
                {view === 'generator' ? (
                    <>
                        <div className="mb-4">
                           <ErrorDisplay message={error} onDismiss={() => setError(null)} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow min-h-0">
                            <div className="lg:col-span-1 min-h-0">
                                <FilterPanel 
                                    filters={filters} 
                                    setFilters={setFilters} 
                                    onGenerate={handleGenerate}
                                    onReset={handleReset}
                                    isLoading={isLoading}
                                />
                            </div>
                            <div className="lg:col-span-1 min-h-0">
                                <ResultsPanel 
                                    results={results} 
                                    onSelect={handleSelectResult} 
                                    isLoading={isLoading}
                                    selectedItemId={selectedItem?.id}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            </div>
                            <div className="lg:col-span-2 min-h-0">
                                <DetailPanel 
                                    item={selectedItem}
                                    onGenerateVariant={handleGenerateVariant}
                                    isFavorite={selectedItem ? isFavorite(selectedItem.id) : false}
                                    onToggleFavorite={handleToggleFavorite}
                                    onUpdate={handleUpdateItem}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <PromptEngineeringPanel />
                )}
            </main>
            
            <FavoritesModal 
                isOpen={isFavoritesModalOpen}
                onClose={() => setIsFavoritesModalOpen(false)}
                favorites={favorites}
                onSelect={selectFavorite}
                onToggleFavorite={handleToggleFavorite}
            />

            <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title="Sobre o Kimetsu Forge">
                <div className="space-y-4 text-gray-300">
                    <p>Kimetsu Forge é uma ferramenta de auxílio para mestres de RPG que buscam inspiração para criar conteúdo no universo de Demon Slayer (Kimetsu no Yaiba).</p>
                    <p>Use os filtros à esquerda para detalhar o que você precisa. A IA irá gerar itens, técnicas, personagens e mais, de acordo com suas especificações.</p>
                    <p>Os resultados são apenas um ponto de partida! Sinta-se à vontade para editar, adaptar e usar como base para suas próprias criações.</p>
                    <h4 className="font-bold text-indigo-400 pt-2">Dicas:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Seja específico nos filtros para melhores resultados.</li>
                        <li>Use o botão "Gerar x5" para ter mais opções para escolher.</li>
                        <li>Favorite seus itens preferidos para não perdê-los.</li>
                        <li>A opção "Prompt Engineer" ajuda a criar prompts para IAs visuais (Midjourney, etc.), mas não gera imagens diretamente aqui.</li>
                    </ul>
                </div>
            </Modal>
        </div>
    );
};

export default App;
