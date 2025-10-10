




import React, { useState, useCallback, useEffect } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { Header } from './components/Header';
// FIX: Module '"./services/geminiService"' has no exported member 'generateImage'.
import { generateContent, generateImage } from './services/geminiService';
import type { FilterState, GeneratedItem, GenerationType, Rarity } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { FavoritesModal } from './components/FavoritesModal';
import { DetailModal } from './components/DetailModal';
import { buildImagePrompt } from './lib/promptBuilder';

const App: React.FC = () => {
  const initialFilters: FilterState = {
    generationType: '',
    // FIX: Property 'aiModel' was missing and is required by the 'FilterState' type.
    aiModel: 'Gemini',
    breathingBase: '',
    weaponType: '',
    grip: '',
    level: 10,
    theme: '',
    rarity: 'Raro',
    accessoryType: '',
    armaduraType: '',
    itemDeAuxilioType: '',
    consumableType: '',
    archetypeType: '',
    skillType: '',
    seed: '',
    era: '',
    kekkijutsu: '',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [results, setResults] = useState<GeneratedItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<GeneratedItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoadingId, setImageLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useLocalStorage<GeneratedItem[]>('favorites', []);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  useEffect(() => {
    document.title = "Forjador de ideias kimetsu no yaiba";
  }, []);

  const handleGenerate = useCallback(async (count: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItems = await generateContent(filters, count);
      setResults(prevResults => [...newItems, ...prevResults]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado ao gerar o conteúdo.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const handleQuickGenerate = useCallback(async (type: GenerationType) => {
    setIsLoading(true);
    setError(null);
    try {
      const quickFilters: FilterState = {
        ...initialFilters,
        generationType: type,
        level: Math.floor(Math.random() * 10) + 5,
        rarity: 'Raro',
        theme: 'Sombrio',
        era: 'Período Edo (Japão Feudal)'
      };

      if (type === 'Inimigo/Oni') {
          quickFilters.level = Math.floor(Math.random() * 10) + 10;
      }
      if (type === 'Arma') {
          const rarities: Rarity[] = ['Raro', 'Épico'];
          quickFilters.rarity = rarities[Math.floor(Math.random() * rarities.length)];
      }

      const newItems = await generateContent(quickFilters, 1);
      setResults(prevResults => [...newItems, ...prevResults]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido durante a geração rápida.');
    } finally {
      setIsLoading(false);
    }
  }, [initialFilters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };
  
  const handleClearResults = () => {
      setResults([]);
      setSelectedResult(null);
  }

  const handleSelectResult = (item: GeneratedItem) => {
    setSelectedResult(item);
  };

  const handleCloseDetailModal = () => {
    setSelectedResult(null);
  }
  
  const handleGenerateVariant = async (baseItem: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => {
    setIsLoading(true);
    setError(null);
    handleCloseDetailModal();
    try {
      const variantFilters: FilterState = {
        ...filters,
        generationType: baseItem.categoria,
        breathingBase: baseItem.respiracao_base,
        level: baseItem.nivel_sugerido,
        accessoryType: '', // Reset accessory type for variants
      };
      const promptModifier = `Gere uma variante ${variantType} para o seguinte item: ${JSON.stringify(baseItem)}.`;
      const newItems = await generateContent(variantFilters, 1, promptModifier);
      setResults(prevResults => [...newItems, ...prevResults]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado ao gerar a variante.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateImage = async (itemId: string) => {
      const itemToUpdate = results.find(r => r.id === itemId) || favorites.find(f => f.id === itemId) || selectedResult;
      if (!itemToUpdate || itemToUpdate.id !== itemId) return;

      setImageLoadingId(itemId);
      setError(null);
      try {
          const imagePrompt = buildImagePrompt(itemToUpdate, filters.era);
          
          const imageUrl = await generateImage(imagePrompt);
          
          const updateItemWithImage = (item: GeneratedItem) => 
              item.id === itemId ? { ...item, imageUrl } : item;

          setResults(prevResults => prevResults.map(updateItemWithImage));
          setFavorites(prevFavorites => prevFavorites.map(updateItemWithImage));
          
          if(selectedResult?.id === itemId) {
              setSelectedResult(prev => prev ? { ...prev, imageUrl } : null);
          }

      } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : 'Falha ao gerar a imagem.');
      } finally {
          setImageLoadingId(null);
      }
  };

  const isFavorite = (itemId: string) => favorites.some(fav => fav.id === itemId);

  const handleToggleFavorite = (itemToToggle: GeneratedItem) => {
    setFavorites(prev => {
      if (isFavorite(itemToToggle.id)) {
        return prev.filter(fav => fav.id !== itemToToggle.id);
      } else {
        return [...prev, itemToToggle];
      }
    });
  };

  const handleUpdateSelectedItem = (updatedItem: GeneratedItem) => {
    setSelectedResult(updatedItem);
    
    setResults(prevResults => 
      prevResults.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    
    setFavorites(prevFavorites =>
      prevFavorites.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
        <Header onClearResults={handleClearResults} onShowFavorites={() => setIsFavoritesOpen(true)} />
        <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
          <div className="w-full md:w-1/3 xl:w-1/4 flex-shrink-0">
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              onGenerate={handleGenerate}
              onQuickGenerate={handleQuickGenerate}
              onReset={handleResetFilters}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full md:w-2/3 xl:w-3/4 flex flex-col gap-4">
              {error && <div className="bg-red-800 border border-red-600 text-white px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}
            <ResultsPanel 
                  results={results} 
                  onSelect={handleSelectResult} 
                  isLoading={isLoading} 
                  selectedItemId={selectedResult?.id}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
              />
          </div>
        </main>
        <DetailModal
          item={selectedResult}
          onClose={handleCloseDetailModal}
          onGenerateVariant={handleGenerateVariant}
          onGenerateImage={handleGenerateImage}
          isImageLoading={imageLoadingId === selectedResult?.id}
          isFavorite={selectedResult ? isFavorite(selectedResult.id) : false}
          onToggleFavorite={handleToggleFavorite}
          onUpdate={handleUpdateSelectedItem}
        />
        <FavoritesModal
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favorites={favorites}
          onSelect={(item) => {
            handleSelectResult(item);
            setIsFavoritesOpen(false);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
  );
};

export default App;