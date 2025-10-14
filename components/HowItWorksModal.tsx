// components/HowItWorksModal.tsx
import React from 'react';
import { Modal } from './ui/Modal';
import { AnvilIcon } from './icons/AnvilIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { BrainIcon } from './icons/BrainIcon';
import { UsersIcon } from './icons/UsersIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { aboutContent } from '../lib/aboutContent';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Como Funciona" panelClassName="!max-w-3xl">
      <div className="p-6 space-y-6 text-gray-300">
        <p className="text-center italic">
          Aprenda a dominar as duas faces da criação no Kimetsu Forge.
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className="flex items-center gap-2 font-bold text-white text-lg mb-2">
              <AnvilIcon className="w-6 h-6 text-indigo-400" />
              Modo Forja: Crie o Conteúdo
            </h3>
            <p className="text-sm">
              A Forja é onde suas ideias de RPG ganham vida.
              <br/><strong>1.</strong> Selecione uma Categoria.
              <br/><strong>2.</strong> Molde sua criação com Filtros detalhados.
              <br/><strong>3.</strong> Clique em <strong>Forjar</strong> e receba um item completo.
            </p>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className="flex items-center gap-2 font-bold text-white text-lg mb-2">
              <MagicWandIcon className="w-6 h-6 text-purple-400" />
              Modo Alquimia: Crie a Imagem
            </h3>
            <p className="text-sm">
              A Alquimia transforma palavras em arte visual.
              <br/><strong>1.</strong> Descreva uma cena ou personagem.
              <br/><strong>2.</strong> Ajuste os Parâmetros para seu modelo de IA preferido.
              <br/><strong>3.</strong> Clique em <strong>Destilar</strong> para gerar prompts otimizados.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white text-lg mb-3 text-center">A Orquestra de IAs por Trás da Magia</h3>
          <ol className="relative border-l border-gray-700 ml-4">                  
            <li className="mb-6 ml-6">            
              <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                <LightbulbIcon className="w-5 h-5 text-indigo-300" />
              </span>
              <h4 className="font-semibold text-white">1. A Faísca (DeepSeek)</h4>
              <p className="text-sm">Gera o conceito bruto, a ideia inicial.</p>
            </li>
            <li className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                <BrainIcon className="w-5 h-5 text-indigo-300" />
              </span>
              <h4 className="font-semibold text-white">2. A Estrutura (Gemini)</h4>
              <p className="text-sm">Expande o conceito com lore, mecânicas de RPG e detalhes visuais.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                <UsersIcon className="w-5 h-5 text-indigo-300" />
              </span>
              <h4 className="font-semibold text-white">3. O Polimento (GPT-4o)</h4>
              <p className="text-sm">Refina a narrativa e otimiza o prompt de imagem para resultados espetaculares.</p>
            </li>
          </ol>
        </div>

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-700">
            <p>{aboutContent.app_short}</p>
        </div>
      </div>
    </Modal>
  );
};