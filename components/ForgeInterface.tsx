import React from 'react';
import type { GeneratedItem, FilterState, Category, Rarity } from '../types';
import { CATEGORIES, RARITIES } from '../constants';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { SparklesIcon } from './icons/SparklesIcon';
import { DetailPanel } from './DetailPanel';
import { ResultsPanel } from './ResultsPanel';
import { ForgeIcon } from './icons/ForgeIcon';

interface ForgeInterfaceProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onGenerate: (count: number) => void;
  isLoading: boolean;
  items: GeneratedItem[];
  selectedItem: GeneratedItem | null;
  onSelectItem: (item: GeneratedItem) => void;
  favorites: GeneratedItem[];
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  onUpdate: (item: GeneratedItem) => void;
  onClearResults: () => void;
}

const AnvilPlaceholder: React.FC = () => (
    <div className="h-full flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-8 border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30">
        <ForgeIcon className="w-24 h-24 mx-auto mb-6 text-gray-600" />
        <h3 className="text-2xl font-bold font-gangofthree text-gray-400">A Bigorna Aguarda</h3>
        <p className="mt-2 max-w-sm">
            Selecione filtros, clique em 'FORJAR' para criar um item. Itens forjados aparecerão no histórico abaixo e podem ser vistos em detalhe aqui.
        </p>
    </div>
);

export const ForgeInterface: React.FC<ForgeInterfaceProps> = (props) => {
    const { filters, onFiltersChange, onGenerate, isLoading, selectedItem } = props;

    const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        // A simplified rarity filter for better UX. It applies to relevant fields.
        if (key === 'weaponRarity') {
            onFiltersChange({
                ...filters,
                weaponRarity: value as Rarity,
                accessoryRarity: value as Rarity,
            });
        } else {
             onFiltersChange({ ...filters, [key]: value });
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 md:p-6 gap-6 forge-background overflow-y-auto">

            {/* Filters */}
            <div className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4 font-gangofthree">Opções da Forja</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <Select
                        label="Categoria"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value as Category)}
                    >
                        <option value="" disabled>Selecione...</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                     <Select label="Raridade" value={filters.weaponRarity} onChange={(e) => handleFilterChange('weaponRarity', e.target.value as Rarity)}>
                        {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                    </Select>
                    <Button variant="secondary" className="w-full self-end" disabled title="Em breve">
                        Filtros Avançados
                    </Button>
                </div>
            </div>

            {/* Forge Core: Preview */}
            <div className="w-full max-w-5xl flex-grow min-h-[400px] hidden lg:flex lg:flex-col">
                {selectedItem ? (
                     <div className="h-full max-h-[60vh] w-full">
                        <DetailPanel 
                            item={selectedItem}
                            onGenerateVariant={props.onGenerateVariant}
                            isFavorite={props.favorites.some(f => f.id === selectedItem.id)}
                            onToggleFavorite={props.onToggleFavorite}
                            onUpdate={props.onUpdate}
                        />
                    </div>
                ) : (
                    <AnvilPlaceholder />
                )}
            </div>

            {/* Forge Button */}
            <div className="my-2">
                <Button 
                    onClick={() => onGenerate(1)} 
                    disabled={isLoading || !filters.category} 
                    className="forge-button text-xl font-bold font-gangofthree px-12 py-6"
                >
                    <SparklesIcon className="w-6 h-6" />
                    {isLoading ? 'FORJANDO...' : 'FORJAR ITEM'}
                </Button>
            </div>
            
            {/* History Panel */}
            <div className="w-full max-w-7xl flex-grow">
                 <ResultsPanel {...props} title="Histórico da Forja"/>
            </div>
        </div>
    );
};
