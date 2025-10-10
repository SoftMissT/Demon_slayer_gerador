
import React from 'react';
import type { GeneratedItem } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StarIcon } from './icons/StarIcon';

interface DetailPanelProps {
  item: GeneratedItem | null;
  onGenerateVariant: (baseItem: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (updatedItem: GeneratedItem) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="text-sm font-bold text-indigo-400 mb-1">{title}</h4>
    <div className="text-gray-300 text-sm">{children}</div>
  </div>
);

interface EditableStatProps {
    label: string;
    value?: string;
    field: keyof GeneratedItem;
    onChange: (field: keyof GeneratedItem, value: string) => void;
}
const EditableStat: React.FC<EditableStatProps> = ({ label, value, field, onChange }) => {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400">{label}</label>
            <input
                type="text"
                value={value === "N/A" ? "" : value || ""}
                placeholder="N/A"
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md py-1 px-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
        </div>
    );
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onGenerateVariant, isFavorite, onToggleFavorite, onUpdate }) => {
  if (!item) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-gray-500">Selecione um item para ver os detalhes</p>
      </Card>
    );
  }
  
  const showDetailedCombatStats = item && (item.dano_base || item.multiplicador_de_ataque || item.defesa || item.resistencia_magica || item.velocidade_movimento);


  const handleFavoriteClick = () => {
    if (item) {
      onToggleFavorite(item);
    }
  };

  const handleStatChange = (field: keyof GeneratedItem, value: string) => {
    if (!item) return;
    const updatedItem = { ...item, [field]: value };
    onUpdate(updatedItem);
  };

  const handlePdfExport = async () => {
    if (!item) return;
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(item.nome, pageW / 2, y, { align: 'center' });
    y += 8;

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(`${item.categoria} | Nível ${item.nivel_sugerido}`, pageW / 2, y, { align: 'center' });
    y += 15;

    const textStartX = margin;
    const textWidth = pageW - margin * 2;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text("Descrição", textStartX, y);
    y += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(item.descricao, textWidth);
    doc.text(descLines, textStartX, y);
    const textEndY = y + descLines.length * 4;
    
    y = textEndY;

    const addSection = (title: string, content: string | string[], isItalic = false) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin, y);
        y += 7;
        doc.setFontSize(11);
        doc.setFont('helvetica', isItalic ? 'italic' : 'normal');
        const textToSplit = Array.isArray(content) ? content.join('\n') : content;
        const lines = doc.splitTextToSize(textToSplit, pageW - margin * 2);
        doc.text(lines, margin, y);
        y += (Array.isArray(lines) ? lines.length : 1) * 4 + 5;
    };
    
    if (item.ganchos_narrativos && item.ganchos_narrativos !== "N/A") {
        addSection("Ganchos Narrativos", `"${item.ganchos_narrativos}"`, true);
    }
    
    const statsContent: string[] = [];
    if (item.dano) statsContent.push(`Dano: ${item.dano}`);
    if (item.dados) statsContent.push(`Dados: ${item.dados}`);
    if (item.tipo_de_dano) statsContent.push(`Tipo de Dano: ${item.tipo_de_dano}`);
    if (statsContent.length > 0) {
        addSection("Mecânicas de Combate", statsContent);
    }

    const effectsContent: string[] = [];
    if (item.status_aplicado && item.status_aplicado !== "Nenhum") {
        effectsContent.push(`Status Aplicado: ${item.status_aplicado}`);
    }
    if (item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum") {
        effectsContent.push(`Efeitos Secundários: ${item.efeitos_secundarios}`);
    }
    if (effectsContent.length > 0) {
        addSection("Efeitos Adicionais", effectsContent);
    }

    const detailedCombatStats: string[] = [];
    if (item.dano_base && item.dano_base !== "N/A") detailedCombatStats.push(`Dano Base: ${item.dano_base}`);
    if (item.multiplicador_de_ataque && item.multiplicador_de_ataque !== "N/A") detailedCombatStats.push(`Multiplicador de Ataque: ${item.multiplicador_de_ataque}`);
    if (item.defesa && item.defesa !== "N/A") detailedCombatStats.push(`Defesa: ${item.defesa}`);
    if (item.resistencia_magica && item.resistencia_magica !== "N/A") detailedCombatStats.push(`Resistência Mágica: ${item.resistencia_magica}`);
    if (item.velocidade_movimento && item.velocidade_movimento !== "N/A") detailedCombatStats.push(`Velocidade de Movimento: ${item.velocidade_movimento}`);
    
    if (detailedCombatStats.length > 0) {
        addSection("Estatísticas de Combate Detalhadas", detailedCombatStats);
    }

    doc.save(`${item.nome.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto pr-2">
      
        <h3 className="text-xl font-bold text-gray-100 mb-1">{item.nome}</h3>
        <div className="flex justify-between items-start mb-4">
            <p className="text-sm text-indigo-400 pt-1">{item.categoria} (Nível {item.nivel_sugerido})</p>
            <button 
                onClick={handleFavoriteClick} 
                className="p-2 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gray-700 transition-colors"
                title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            >
                <StarIcon className="w-6 h-6" filled={isFavorite} />
                <span className="sr-only">Favoritar</span>
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

        {showDetailedCombatStats && (
            <DetailSection title="Estatísticas de Combate Detalhadas">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <EditableStat label="Dano Base" value={item.dano_base} field="dano_base" onChange={handleStatChange} />
                    <EditableStat label="Multiplicador" value={item.multiplicador_de_ataque} field="multiplicador_de_ataque" onChange={handleStatChange} />
                    <EditableStat label="Defesa" value={item.defesa} field="defesa" onChange={handleStatChange} />
                    <EditableStat label="Res. Mágica" value={item.resistencia_magica} field="resistencia_magica" onChange={handleStatChange} />
                    <EditableStat label="Velocidade" value={item.velocidade_movimento} field="velocidade_movimento" onChange={handleStatChange} />
                </div>
            </DetailSection>
        )}

      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
         <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => onGenerateVariant(item, 'agressiva')}>Agressiva</Button>
            <Button variant="secondary" onClick={() => onGenerateVariant(item, 'técnica')}>Técnica</Button>
            <Button variant="secondary" onClick={() => onGenerateVariant(item, 'defensiva')}>Defensiva</Button>
         </div>
         <Button variant="primary" className="w-full" onClick={handlePdfExport}>Exportar PDF</Button>
      </div>
    </Card>
  );
};
