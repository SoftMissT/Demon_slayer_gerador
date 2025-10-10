import React, { useState } from 'react';
import type { GeneratedItem, DanoPorNivelDetalhado } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { SparklesIcon } from './icons/SparklesIcon';
import { StarIcon } from './icons/StarIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { Spinner } from './ui/Spinner';


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

const PromptDisplay: React.FC<{ platform: 'Gemini' | 'ChatGPT' | 'Midjourney' | 'Copilot'; prompt: string; }> = ({ platform, prompt }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!prompt) return;
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
                <h5 className="font-bold text-sm text-indigo-400">{platform}</h5>
                <Button variant="ghost" className="!p-1 !h-auto" onClick={handleCopy}>
                    {copied ? <ClipboardCheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                    <span className="ml-2 text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
                </Button>
            </div>
            <p className="text-xs text-gray-300 font-mono bg-gray-800 p-2 rounded">{prompt || 'N/A'}</p>
        </div>
    );
};

const DanoPorNivelTable: React.FC<{ data: DanoPorNivelDetalhado[] }> = ({ data }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead className="text-xs text-indigo-300 uppercase bg-gray-700/50">
                <tr>
                    <th scope="col" className="px-4 py-2">Nível</th>
                    <th scope="col" className="px-4 py-2">Arma</th>
                    <th scope="col" className="px-4 py-2">Forma</th>
                    <th scope="col" className="px-4 py-2">Modificador</th>
                    <th scope="col" className="px-4 py-2">Exemplo Total</th>
                    <th scope="col" className="px-4 py-2">CD VIT</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="border-b border-gray-700">
                        <td className="px-4 py-2 font-medium">{row.nivel}</td>
                        <td className="px-4 py-2">{row.arma}</td>
                        <td className="px-4 py-2">{row.forma}</td>
                        <td className="px-4 py-2">{row.modificador}</td>
                        <td className="px-4 py-2 font-mono">{row.dano_total_exemplo}</td>
                        <td className="px-4 py-2">{row.cd_vit || 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const MomentumDisplay: React.FC<{ momentum: GeneratedItem['momentum'] }> = ({ momentum }) => {
    if (!momentum) return null;
    return (
        <div className="space-y-2">
            <p><strong>Ganho:</strong> <span className="font-mono">{momentum.ganho_por_acerto}</span> por acerto, <span className="font-mono">{momentum.ganho_por_crit}</span> por acerto crítico.</p>
            <div>
                <p><strong>Gastos:</strong></p>
                <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
                    {momentum.gasta.map((gasto, index) => {
                        const cost = Object.keys(gasto)[0];
                        const effect = gasto[cost];
                        return <li key={index}><span className="font-bold font-mono">{cost} Ponto(s):</span> {effect}</li>
                    })}
                </ul>
            </div>
        </div>
    );
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onGenerateVariant, onGenerateImage, isImageLoading, isFavorite, onToggleFavorite }) => {
  const [copyState, setCopyState] = useState<'idle' | 'text' | 'json'>('idle');

  if (!item) {
    return null;
  }
  
  const isTechniqueType = item.dano_por_nivel || item.teste_necessario;
  const isSkillType = item.arquétipo;

  const handleFavoriteClick = () => {
    if (item) {
      onToggleFavorite(item);
    }
  };

  const copyToClipboard = async (text: string, type: 'text' | 'json') => {
      try {
        await navigator.clipboard.writeText(text);
        setCopyState(type);
        setTimeout(() => setCopyState('idle'), 2000);
      } catch (err) {
        console.error('Falha ao copiar:', err);
        alert('Não foi possível copiar o texto.');
      }
  };
  
  const generatePlainText = (): string => {
      if(!item) return "";
      let text = `Nome: ${item.nome}\n`;
      text += `Tipo: ${item.tipo} | Categoria: ${item.categoria} | Subcategoria: ${item.subcategoria}\n`;
      if(item.arquétipo) text += `Arquétipo: ${item.arquétipo}\n`;
      text += `Raridade: ${item.raridade} | Durabilidade: ${item.durabilidade}\n`;
      if(item.dano_extra && item.dano_extra !== '-') text += `Dano Extra: ${item.dano_extra}\n`;
      if(item.preco_em_moedas) text += `Preço: ${item.preco_em_moedas} | Espaço: ${item.espaco_que_ocupa}\n`;

      text += `\n--- DESCRIÇÃO ---\n${item.descricao}\n\n`;
      if(item.efeito) text += `--- EFEITO ---\n${item.efeito}\n\n`;
      if(item.historia) text += `--- HISTÓRIA ---\n${item.historia}\n\n`;
      
      if(isTechniqueType && item.dano_total_formula) {
        text += `--- FÓRMULA DE DANO ---\n${item.dano_total_formula}\n\n`;
        if(item.dano_por_nivel) {
            text += `--- DANO POR NÍVEL ---\n`;
            item.dano_por_nivel.forEach(d => {
                text += `Nível ${d.nivel}: ${d.dano_total_exemplo} | CD VIT ${d.cd_vit || 'N/A'}\n`;
            });
            text += '\n';
        }
      }
      
      if(item.momentum) {
        text += `--- MOMENTUM ---\nGanho: ${item.momentum.ganho_por_acerto} por acerto, ${item.momentum.ganho_por_crit} por crítico.\nGastos:\n`;
        item.momentum.gasta.forEach(gasto => {
            const cost = Object.keys(gasto)[0];
            text += `- ${cost} Ponto(s): ${gasto[cost]}\n`;
        });
        text += '\n';
      }

      if (item.ganchos_narrativos) text += `--- GANCHOS NARRATIVOS ---\n"${item.ganchos_narrativos}"\n\n`;

      return text;
  }

  return (
    <Modal isOpen={!!item} onClose={onClose}>
        <div className="max-h-[85vh] flex flex-col relative p-0">
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20 text-3xl leading-none">&times;</button>
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3 flex-shrink-0 pr-12">
                <div>
                    <h3 className="text-2xl font-bold text-gray-100 font-gangofthree">{item.nome}</h3>
                     <p className="text-sm text-indigo-400">
                        {item.tipo} | {item.categoria} | {item.subcategoria}
                        {item.arquétipo && ` | ${item.arquétipo}`}
                    </p>
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
                
                {item.imageUrl || isImageLoading ? (
                    <DetailSection title="Visualização">
                        <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative">
                            {isImageLoading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Spinner />
                                    <span className="text-sm text-gray-400">DALL-E 3 está desenhando...</span>
                                </div>
                            ) : (
                                <img src={item.imageUrl} alt={`Visualização de ${item.nome}`} className="w-full h-full object-cover rounded-lg" />
                            )}
                        </div>
                    </DetailSection>
                ) : null}

                <DetailSection title="Descrição Narrativa">
                  <p className="whitespace-pre-wrap">{item.descricao}</p>
                </DetailSection>

                {item.efeito && item.efeito !== "N/A" && (
                    <DetailSection title="Efeito Mecânico Principal">
                        <p>{item.efeito}</p>
                    </DetailSection>
                )}

                {isSkillType && (
                    <DetailSection title="Detalhes da Habilidade">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                            <div className="bg-gray-800 p-2 rounded-md">
                                <div className="text-xs text-gray-400">Tipo</div>
                                <div className="font-bold">{item.tipo_habilidade || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-800 p-2 rounded-md">
                                <div className="text-xs text-gray-400">Cooldown</div>
                                <div className="font-bold">{item.cd || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-800 p-2 rounded-md col-span-2">
                                <div className="text-xs text-gray-400">Custo</div>
                                <div className="font-bold">
                                    {item.custo ? Object.entries(item.custo).map(([key, value]) => `${value} ${key}`).join(' / ') : 'Nenhum'}
                                </div>
                            </div>
                        </div>

                        {item.efeitos && item.efeitos.length > 0 && (
                            <div className="mt-3 text-left">
                                <h5 className="text-xs text-gray-400 font-bold mb-1">Efeitos Detalhados:</h5>
                                <ul className="list-disc list-inside pl-2 space-y-1 text-sm">
                                    {item.efeitos.map((efeito, index) => (
                                        <li key={index}>
                                            <strong>{efeito.tipo}:</strong> {efeito.valor}
                                            <span className="text-gray-400"> (Alvo: {efeito.alvo})</span>
                                            {efeito.obs && <em className="text-xs block pl-4 text-gray-500">- {efeito.obs}</em>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {item.interacao_respirações && <p className="text-xs italic mt-3 text-center"><strong>Interação:</strong> {item.interacao_respirações}</p>}
                    </DetailSection>
                )}

                {isTechniqueType && (
                    <>
                        {item.dano_total_formula && <DetailSection title="Fórmula de Dano"><p className="font-mono text-center">{item.dano_total_formula}</p></DetailSection>}
                        {item.dano_por_nivel && item.dano_por_nivel.length > 0 && (
                           <DetailSection title="Dano Progressivo por Nível">
                               <DanoPorNivelTable data={item.dano_por_nivel} />
                           </DetailSection>
                        )}
                        {item.momentum && (
                            <DetailSection title="Sistema de Momentum">
                                <MomentumDisplay momentum={item.momentum} />
                            </DetailSection>
                        )}
                         {item.teste_necessario && (
                            <DetailSection title="Teste de Ativação">
                                <p><strong>Tipo:</strong> {item.teste_necessario.tipo} (CD: {item.teste_necessario.cd})</p>
                                <p className="mt-1"><strong>Em Falha:</strong> {item.teste_necessario.efeito_falha}</p>
                            </DetailSection>
                        )}
                    </>
                )}
                
                 {item.historia && item.historia !== "N/A" && (
                    <DetailSection title="História e Lore">
                        <p className="italic">"{item.historia}"</p>
                    </DetailSection>
                )}


                {item.prompts_de_geracao && (
                    <DetailSection title="Prompts de Geração (Copie e Cole)">
                        <div className="space-y-2">
                            <PromptDisplay platform="Gemini" prompt={item.prompts_de_geracao.Gemini} />
                            <PromptDisplay platform="ChatGPT" prompt={item.prompts_de_geracao.ChatGPT} />
                            <PromptDisplay platform="Midjourney" prompt={item.prompts_de_geracao.Midjourney} />
                            <PromptDisplay platform="Copilot" prompt={item.prompts_de_geracao.Copilot} />
                        </div>
                    </DetailSection>
                )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2 flex-shrink-0">
                 <Button variant="primary" onClick={() => onGenerateImage(item.id)} disabled={isImageLoading} className="w-full">
                    {isImageLoading ? <><Spinner size="sm"/> Gerando Imagem...</> : 'Gerar Imagem com DALL-E 3'}
                 </Button>
                 {item.categoria === "Forma de Respiração" && 
                    <div className="grid grid-cols-3 gap-2">
                        <Button variant="secondary" onClick={() => onGenerateVariant(item, 'agressiva')}><SparklesIcon className="w-4 h-4"/> Agressiva</Button>
                        <Button variant="secondary" onClick={() => onGenerateVariant(item, 'técnica')}><SparklesIcon className="w-4 h-4"/> Técnica</Button>
                        <Button variant="secondary" onClick={() => onGenerateVariant(item, 'defensiva')}><SparklesIcon className="w-4 h-4"/> Defensiva</Button>
                    </div>
                 }
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" onClick={() => copyToClipboard(generatePlainText(), 'text')}>
                        {copyState === 'text' ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                        {copyState === 'text' ? 'Copiado!' : 'Copiar Texto'}
                    </Button>
                    <Button variant="secondary" onClick={() => copyToClipboard(JSON.stringify(item, null, 2), 'json')}>
                        {copyState === 'json' ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                        {copyState === 'json' ? 'Copiado!' : 'Copiar JSON'}
                    </Button>
                 </div>
            </div>
        </div>
    </Modal>
  );
};