
import React from 'react';
import type { GeneratedItem, DanoPorNivel } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { StarIcon } from './icons/StarIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface DetailModalProps {
  item: GeneratedItem | null;
  onClose: () => void;
  onGenerateVariant: (baseItem: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  onGenerateImage: (itemId: string) => void;
  isImageLoading: boolean;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (updatedItem: GeneratedItem) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="text-sm font-bold text-indigo-400 mb-2 tracking-wider uppercase font-gangofthree">{title}</h4>
    <div className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded-md border border-gray-700">{children}</div>
  </div>
);

const DanoPorNivelTable: React.FC<{ data: DanoPorNivel[] }> = ({ data }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead className="text-xs text-indigo-300 uppercase bg-gray-700/50">
                <tr>
                    <th scope="col" className="px-4 py-2">Nível</th>
                    <th scope="col" className="px-4 py-2">Dano</th>
                    <th scope="col" className="px-4 py-2">PDR</th>
                    <th scope="col" className="px-4 py-2">CD VIT</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="border-b border-gray-700">
                        <td className="px-4 py-2 font-medium">{row.nivel}</td>
                        <td className="px-4 py-2">{row.dano}</td>
                        <td className="px-4 py-2">{row.pdr || 'N/A'}</td>
                        <td className="px-4 py-2">{row.cd_vit || 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
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
                className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
        </div>
    );
};


export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onGenerateVariant, onGenerateImage, isImageLoading, isFavorite, onToggleFavorite, onUpdate }) => {
  if (!item) {
    return null;
  }
  
  const canHaveImage = ['Arma', 'Acessório', 'Inimigo/Oni', 'Caçador', 'Classe/Origem'].includes(item.categoria);
  const isDetailedType = item.dano_por_nivel || item.teste_necessario;
  const showSimpleCombatMechanics = item.dano && item.dano !== 'N/A';
  const additionalEffectsTitle = item.categoria === 'Classe/Origem' ? "Habilidades e Bônus" : "Efeitos Adicionais";
  const showDetailedCombatStats = item.dano_base || item.multiplicador_de_ataque || item.defesa || item.resistencia_magica || item.velocidade_movimento;


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

  const handleDownloadImage = () => {
    if (!item?.imageUrl) return;
    const link = document.createElement('a');
    link.href = item.imageUrl;
    const filename = `${item.nome.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_image.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfExport = async () => {
    if (!item) return;
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    doc.addFont('GangofThree', 'Gang of Three', 'normal');
    doc.setFont('Gang of Three');
    doc.setFontSize(28);
    doc.text(item.nome, pageW / 2, y, { align: 'center' });
    y += 8;

    doc.setFont('helvetica'); // Reset font for body
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.text(`${item.categoria} | Nível ${item.nivel_sugerido}`, pageW / 2, y, { align: 'center' });
    y += 15;

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
    
    addSection("Descrição", item.descricao);
    addSection("Ganchos Narrativos", `"${item.ganchos_narrativos}"`, true);

    if(isDetailedType) {
        if(item.teste_necessario) addSection("Teste de Ativação", `Tipo: ${item.teste_necessario.tipo} (CD: ${item.teste_necessario.cd})\nFalha: ${item.teste_necessario.efeito_falha}`);
        if(item.efeito_no_inimigo) addSection("Efeito no Inimigo", `Teste de Resistência: ${item.efeito_no_inimigo.teste} (CD: ${item.efeito_no_inimigo.cd})\nFalha: ${item.efeito_no_inimigo.falha}`);
        if(item.exaustao) addSection("Exaustão", item.exaustao);
        if(item.cura_condicional) addSection("Cura Condicional", item.cura_condicional);
        if(item.dano_por_nivel) {
            const danoContent = item.dano_por_nivel.map(d => `Nível ${d.nivel}: ${d.dano} | PDR ${d.pdr || 'N/A'} | CD VIT ${d.cd_vit || 'N/A'}`).join('\n');
            addSection("Dano por Nível", danoContent);
        }
    } else {
        const statsContent: string[] = [];
        if (item.dano) statsContent.push(`Dano: ${item.dano}`);
        if (item.dados) statsContent.push(`Dados: ${item.dados}`);
        if (item.tipo_de_dano) statsContent.push(`Tipo de Dano: ${item.tipo_de_dano}`);
        if (statsContent.length > 0 && showSimpleCombatMechanics) {
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
            addSection(additionalEffectsTitle, effectsContent);
        }
    }

    const detailedCombatStats: string[] = [];
    if (item.dano_base && item.dano_base !== "N/A") detailedCombatStats.push(`Dano Base: ${item.dano_base}`);
    if (item.multiplicador_de_ataque && item.multiplicador_de_ataque !== "N/A") detailedCombatStats.push(`Multiplicador de Ataque: ${item.multiplicador_de_ataque}`);
    if (item.defesa && item.defesa !== "N/A") detailedCombatStats.push(`Defesa: ${item.defesa}`);
    if (item.resistencia_magica && item.resistencia_magica !== "N/A") detailedCombatStats.push(`Resistência Mágica: ${item.resistencia_magica}`);
    if (item.velocidade_movimento && item.velocidade_movimento !== "N/A") detailedCombatStats.push(`Velocidade: ${item.velocidade_movimento}`);

    if (detailedCombatStats.length > 0) {
        addSection("Estatísticas de Combate Detalhadas", detailedCombatStats);
    }

    doc.save(`${item.nome.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Modal isOpen={!!item} onClose={onClose}>
        <div className="max-h-[85vh] flex flex-col relative p-0">
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20 text-3xl leading-none">&times;</button>
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3 flex-shrink-0 pr-12">
                <div>
                    <h3 className="text-2xl font-bold text-gray-100 font-gangofthree">{item.nome}</h3>
                    <p className="text-sm text-indigo-400">{item.categoria} (Nível {item.nivel_sugerido})</p>
                </div>
                <button 
                    onClick={handleFavoriteClick} 
                    className="p-2 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gray-700 transition-colors"
                    title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                >
                    <StarIcon className="w-6 h-6" filled={isFavorite} />
                    <span className="sr-only">Favoritar</span>
                </button>
            </div>

            {/* Modal Body with scroll */}
            <div className="flex-grow overflow-y-auto pr-2">
                {canHaveImage && (
                    <div className="relative w-full aspect-square bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                        {isImageLoading && <Spinner />}
                        {!isImageLoading && item.imageUrl && (
                            <>
                                <img src={item.imageUrl} alt={`Imagem de ${item.nome}`} className="w-full h-full object-cover rounded-lg" />
                                <Button 
                                    variant="ghost" 
                                    onClick={handleDownloadImage}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 !p-2 rounded-full"
                                    title="Baixar Imagem"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                </Button>
                            </>
                        )}
                         {!isImageLoading && !item.imageUrl && (
                            <div className="text-center">
                                <p className="text-gray-500 text-sm mb-2">Sem imagem</p>
                                <Button variant="secondary" onClick={() => onGenerateImage(item.id)} disabled={isImageLoading}>
                                      <SparklesIcon className="w-4 h-4" />
                                      Gerar Imagem
                                </Button>
                            </div>
                        )}
                    </div>
                )}
              
                <DetailSection title="Descrição Narrativa">
                  <p className="whitespace-pre-wrap">{item.descricao}</p>
                </DetailSection>

                {item.ganchos_narrativos && item.ganchos_narrativos !== "N/A" && (
                    <DetailSection title="Ganchos Narrativos">
                        <p className="italic">"{item.ganchos_narrativos}"</p>
                    </DetailSection>
                )}

                {isDetailedType ? (
                    <>
                        {item.teste_necessario && (
                            <DetailSection title="Teste de Ativação">
                                <p><strong>Tipo:</strong> {item.teste_necessario.tipo} (CD: {item.teste_necessario.cd})</p>
                                <p className="mt-1"><strong>Em Falha:</strong> {item.teste_necessario.efeito_falha}</p>
                            </DetailSection>
                        )}
                        {item.efeito_no_inimigo && (
                             <DetailSection title="Efeito no Inimigo">
                                <p><strong>Teste de Resistência:</strong> {item.efeito_no_inimigo.teste} (CD: {item.efeito_no_inimigo.cd})</p>
                                <p className="mt-1"><strong>Em Falha:</strong> {item.efeito_no_inimigo.falha}</p>
                            </DetailSection>
                        )}
                        {item.dano_por_nivel && item.dano_por_nivel.length > 0 && (
                           <DetailSection title="Dano por Nível">
                               <DanoPorNivelTable data={item.dano_por_nivel} />
                           </DetailSection>
                        )}
                        {item.exaustao && item.exaustao !== "Nenhuma" && <DetailSection title="Custo / Exaustão"><p>{item.exaustao}</p></DetailSection>}
                        {item.cura_condicional && item.cura_condicional !== "Nenhuma" && <DetailSection title="Efeito de Cura"><p>{item.cura_condicional}</p></DetailSection>}

                    </>
                ) : (
                    <>
                        {showSimpleCombatMechanics && (
                        <DetailSection title="Mecânicas de Combate">
                            <div className="space-y-1">
                                <p><strong>Dano:</strong> {item.dano || 'N/A'}</p>
                                <p><strong>Dados:</strong> {item.dados || 'N/A'}</p>
                                <p><strong>Tipo de Dano:</strong> {item.tipo_de_dano || 'N/A'}</p>
                            </div>
                        </DetailSection>
                        )}
                        
                        {(item.status_aplicado && item.status_aplicado !== "Nenhum") || (item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum") ? (
                        <DetailSection title={additionalEffectsTitle}>
                                <div className="space-y-1">
                                    {item.status_aplicado && item.status_aplicado !== "Nenhum" && <p><strong>Status Aplicado:</strong> {item.status_aplicado}</p>}
                                    {item.efeitos_secundarios && item.efeitos_secundarios !== "Nenhum" && <p><strong>Efeitos Secundários:</strong> {item.efeitos_secundarios}</p>}
                                </div>
                        </DetailSection>
                        ) : null}
                    </>
                )}

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

            {/* Modal Footer */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2 flex-shrink-0">
                 <div className="grid grid-cols-3 gap-2">
                    <Button variant="secondary" onClick={() => onGenerateVariant(item, 'agressiva')}>Agressiva</Button>
                    <Button variant="secondary" onClick={() => onGenerateVariant(item, 'técnica')}>Técnica</Button>
                    <Button variant="secondary" onClick={() => onGenerateVariant(item, 'defensiva')}>Defensiva</Button>
                 </div>
                 <Button variant="primary" className="w-full" onClick={handlePdfExport}>Exportar PDF</Button>
            </div>
        </div>
    </Modal>
  );
};
