import React, { useState } from 'react';
import { Button } from './ui/Button';
import { HelpIcon } from './icons/HelpIcon';
import { Modal } from './ui/Modal';
import { StarIcon } from './icons/StarIcon';

interface HeaderProps {
    onClearResults: () => void;
    onShowFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({onClearResults, onShowFavorites}) => {
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
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500 font-gangofthree">
            Forjador de ideias kimetsu no yaiba
          </h1>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>Limpar Resultados</Button>
          <Button variant="ghost" onClick={onShowFavorites}><StarIcon className="w-5 h-5" /></Button>
          <Button variant="ghost" onClick={() => setIsHelpOpen(true)}><HelpIcon className="w-5 h-5" /></Button>
        </div>
      </header>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Ajuda">
        <div className="text-gray-300 space-y-4">
            <p>Bem-vindo ao Forjador de ideias kimetsu no yaiba!</p>
            <p>1. Use o painel à esquerda para selecionar os filtros para sua geração.</p>
            <p>2. Clique em "Gerar" para criar novos itens. Os resultados aparecerão no painel central.</p>
            <p>3. Clique em um resultado para ver seus detalhes em um pop-up.</p>
            <p>4. Marque seus itens preferidos com a estrela. Você pode acessá-los a qualquer momento no painel de favoritos (botão de estrela no cabeçalho).</p>
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