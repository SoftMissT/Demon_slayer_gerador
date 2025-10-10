
import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { Header } from '../components/Header';
import { generateContent, generateImage } from '../services/geminiService';
import type { FilterState, GeneratedItem } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { FavoritesModal } from '../components/FavoritesModal';
import { DetailModal } from '../components/DetailModal';
import { buildImagePrompt } from '../lib/promptBuilder';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';

const Home: React.FC = () => {
  const initialFilters: FilterState = {
    generationType: '',
    breathingBase: '',
    weaponType: [],
    grip: '',
    level: 10,
    theme: '',
    rarity: 'Mid',
    accessoryType: '',
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

  const handleGenerate = useCallback(async (count: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItems = await generateContent(filters, count);
      setResults(prevResults => [...newItems, ...prevResults]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao gerar o conteúdo.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

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
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao gerar a variante.');
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
    <>
      <Head>
        <title>Forjador de ideias kimetsu no yaiba</title>
        <meta name="description" content="Um gerador de ideias para classes, origens, equipamentos, armas, missões, onis, vilões, formas de respiração, kekkijutsus e acessórios, ambientado no universo expandido estilo Demon Slayer (KNY)." />
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
        <Header onClearResults={handleClearResults} onShowFavorites={() => setIsFavoritesOpen(true)} />
        <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
          <div className="w-full md:w-1/3 xl:w-1/4 flex-shrink-0">
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              onGenerate={handleGenerate}
              onReset={handleResetFilters}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full md:w-2/3 xl:w-3/4 flex flex-col gap-4">
              <ErrorDisplay message={error} onDismiss={() => setError(null)} />
            <ResultsPanel 
                  results={results} 
                  onSelect={handleSelectResult} 
                  isLoading={isLoading} 
                  selectedItemId={selectedResult?.id}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  imageLoadingId={imageLoadingId}
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
    </>
  );
};

export default Home;
