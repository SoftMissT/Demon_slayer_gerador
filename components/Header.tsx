
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { HelpIcon } from './icons/HelpIcon';
import { Modal } from './ui/Modal';
import { StarIcon } from './icons/StarIcon';
import { ActiveTab } from '../../App';

interface HeaderProps {
    onClearResults: () => void;
    onShowFavorites: () => void;
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);

export const Header: React.FC<HeaderProps> = ({onClearResults, onShowFavorites, activeTab, setActiveTab}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmClear = () => {
    onClearResults();
    setIsConfirmOpen(false);
  }

  return (
    <>
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img src="https://i.imgur.com/M9BDKmO.png" alt="Logo do Forjador de Ideias" className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"/>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500 font-gangofthree">
              Forjador de ideias kimetsu no yaiba
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <TabButton label="Gerador de Itens" isActive={activeTab === 'generator'} onClick={() => setActiveTab('generator')} />
                <TabButton label="Gerador de Prompts" isActive={activeTab === 'prompts'} onClick={() => setActiveTab('prompts')} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {activeTab === 'generator' && <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>Limpar Resultados</Button>}
           {activeTab === 'generator' && <Button variant="ghost" onClick={onShowFavorites}><StarIcon className="w-5 h-5" /></Button>}
          <Button variant="ghost" onClick={() => setIsHelpOpen(true)}><HelpIcon className="w-5 h-5" /></Button>
        </div>
      </header>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Ajuda">
        <div className="text-gray-300 space-y-4">
            <p>Bem-vindo ao Forjador de ideias kimetsu no yaiba!</p>
            <p>Use as abas no topo para alternar entre o <strong>Gerador de Itens</strong> e o <strong>Gerador de Prompts</strong>.</p>
            <h4 className="font-bold text-indigo-400">Gerador de Itens:</h4>
            <ul className="list-disc list-inside pl-4 text-sm">
                <li>Use o painel à esquerda para selecionar os filtros para sua geração.</li>
                <li>Clique em "Gerar" para criar novos itens.</li>
                <li>Clique em um resultado para ver seus detalhes.</li>
                <li>Marque seus itens preferidos com a estrela para salvá-los.</li>
            </ul>
             <h4 className="font-bold text-indigo-400 mt-4">Gerador de Prompts:</h4>
            <ul className="list-disc list-inside pl-4 text-sm">
                <li>Descreva uma ideia visual no campo de texto.</li>
                <li>Clique em "Gerar Prompts".</li>
                <li>O sistema criará prompts prontos para você copiar e usar em outras IAs como Midjourney, Gemini, etc.</li>
                <li>Este painel <strong>não gera imagens</strong>, apenas o texto dos prompts.</li>
            </ul>
        </div>
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Confirmar Limpeza">
        <div className="text-gray-300 space-y-4">
            <p>Tem certeza que deseja limpar todos os resultados gerados? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-4 mt-4">
                <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
                <Button variant="danger" onClick={handleConfirmClear}>Limpar</Button>
            </div>
        </div>
      </Modal>
    </>
  );
};
