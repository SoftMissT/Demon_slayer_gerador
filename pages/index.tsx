import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { Header } from '../components/Header';
import { generateContent } from '../services/geminiService';
import type { FilterState, GeneratedItem, Rarity } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { FavoritesModal } from '../components/FavoritesModal';
import { DetailModal } from '../components/DetailModal';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';

const Home: React.FC = () => {
  const initialFilters: FilterState = {
    generationType: '',
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
        ...initialFilters,
        ...filters,
        generationType: baseItem.categoria,
        breathingBase: baseItem.respiracao_base,
        level: baseItem.nivel_sugerido,
        weaponType: baseItem.categoria === 'Arma' ? baseItem.subcategoria : '',
        accessoryType: baseItem.categoria === 'Acessório' ? baseItem.subcategoria as any : '',
        armaduraType: baseItem.categoria === 'Armadura' ? baseItem.subcategoria as any : '',
        itemDeAuxilioType: baseItem.categoria === 'Item de Auxílio' ? baseItem.subcategoria as any : '',
        consumableType: baseItem.categoria === 'Item Consumível' ? baseItem.subcategoria as any : '',
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
        <link rel="icon" href="https://i.imgur.com/M9BDKmO.png" />
      </Head>
      <div className="min-h-screen font-sans flex flex-col">
        <Header 
          onClearResults={handleClearResults} 
          onShowFavorites={() => setIsFavoritesOpen(true)}
        />
        <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              onGenerate={handleGenerate}
              onReset={handleResetFilters}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full flex flex-col gap-4">
              <ErrorDisplay message={error} onDismiss={() => setError(null)} />
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