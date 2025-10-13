// components/HowItWorksModal.tsx
import React from 'react';
import { Modal } from './ui/Modal';
import { AnvilIcon } from './icons/AnvilIcon';
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
          Kimetsu Forge usa uma orquestração de IAs para criar conteúdo rico e detalhado para suas aventuras de RPG.
        </p>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <h3 className="flex items-center gap-2 font-bold text-white text-lg mb-2">
            <AnvilIcon className="w-6 h-6 text-indigo-400" />
            Modo Forja
          </h3>
          <p className="text-sm">
            Use a Forja para gerar itens, personagens, missões e mais. Selecione uma categoria, ajuste os filtros de detalhes e clique em "Forjar". Suas criações aparecerão instantaneamente no painel de Resultados, prontas para serem usadas em sua campanha.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white text-lg mb-3 text-center">O Processo Criativo da IA</h3>
          <ol className="relative border-l border-gray-700 ml-4">                  
            <li className="mb-6 ml-6">            
              <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                <LightbulbIcon className="w-5 h-5 text-indigo-300" />
              </span>
              <h4 className="font-semibold text-white">1. Conceito (DeepSeek)</h4>
              <p className="text-sm">Uma IA gera a ideia inicial, o conceito bruto. É a faísca da criação.</p>
            </li>
            <li className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                <BrainIcon className="w-5 h-5 text-indigo-300" />
              </span>
              <h4 className="font-semibold text-white">2. Estrutura (Gemini)</h4>
              <p className="text-sm">O Gemini recebe o conceito e o expande, adicionando lore, detalhes e mecânicas de RPG.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                <UsersIcon className="w-5 h-5 text-indigo-300" />
              </span>
              <h4 className="font-semibold text-white">3. Polimento (GPT-4o)</h4>
              <p className="text-sm">O GPT-4o refina a narrativa para um tom de roleplay mais forte e evocativo.</p>
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