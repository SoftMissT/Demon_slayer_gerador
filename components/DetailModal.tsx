
import React from 'react';
import type { GeneratedItem } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface DetailModalProps {
  item: GeneratedItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="text-sm font-bold text-indigo-400 mb-1">{title}</h4>
    <div className="text-gray-300 text-sm">{children}</div>
  </div>
);


export const DetailModal: React.FC<DetailModalProps> = ({ item, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  if (!item) return null;

  const handleFavoriteClick = () => {
    if (item) {
      onToggleFavorite(item);
    }
  };

  const handlePdfExport = async () => {
    if (!item) return;
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.text(`Nome: ${item.nome}`, 10, 10);
    doc.text(`Descrição: ${item.descricao}`, 10, 20);
    doc.save(`${item.nome.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.nome}>
        <div className="max-h-[75vh] overflow-y-auto pr-2">
            <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-indigo-400 pt-1">{item.categoria} (Nível {item.nivel_sugerido})</p>
                <button 
                    onClick={handleFavoriteClick} 
                    className="p-2 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gray-700 transition-colors"
                    title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                >
                    <StarIcon className="w-6 h-6" filled={isFavorite} />
                </button>
            </div>
            
            <DetailSection title="Descrição Longa">
              <p className="whitespace-pre-wrap">{item.descricao}</p>
            </DetailSection>

            {item.ganchos_narrativos && item.ganchos_narrativos !== "N/A" && <DetailSection title="Ganchos Narrativos">
              <p className="italic">"{item.ganchos_narrativos}"</p>
            </DetailSection>}

            <DetailSection title="Mecânicas de Combate">
                <div className="space-y-1">
                    <p><strong>Dano:</strong> {item.dano || 'N/A'}</p>
                    <p><strong>Dados:</strong> {item.dados || 'N/A'}</p>
                    <p><strong>Tipo de Dano:</strong> {item.tipo_de_dano || 'N/A'}</p>
                </div>
            </DetailSection>
            
            {(item.status_aplicado && item.status_aplicado !== "Nenhum") || (item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum") ? (
               <DetailSection title="Efeitos Adicionais">
                    <div className="space-y-1">
                        {item.status_aplicado && item.status_aplicado !== "Nenhum" && <p><strong>Status Aplicado:</strong> {item.status_aplicado}</p>}
                        {item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum" && <p><strong>Efeitos Secundários:</strong> {item.efeitos_secundarios}</p>}
                    </div>
               </DetailSection>
            ) : null}
        </div>
         <div className="mt-6 pt-4 border-t border-gray-600 flex justify-end">
            <Button onClick={handlePdfExport}>
                <DownloadIcon className="w-5 h-5"/>
                Exportar PDF
            </Button>
        </div>
    </Modal>
  );
};
