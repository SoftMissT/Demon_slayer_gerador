
import React from 'react';
import { Modal } from './ui/Modal';
import { GeminiIcon } from './icons/GeminiIcon';
import { GptIcon } from './icons/GptIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { BookIcon } from './icons/BookIcon';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Como a Forja Funciona"
    >
      <div className="p-6 text-gray-300 space-y-6">
        <p>
            O Kimetsu Forge utiliza uma técnica chamada <strong>orquestração de IAs</strong>. Em vez de usar um único modelo de inteligência artificial, ele combina a força de três modelos diferentes em uma linha de montagem para criar resultados mais ricos, criativos e detalhados.
        </p>

        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <GeminiIcon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Etapa 1: DeepSeek - O Conceitualizador</h3>
                    <p className="text-sm">A primeira IA, DeepSeek, recebe seus filtros e gera a ideia base: um conceito bruto e fundamental do item, personagem ou técnica. Ele define o nome, a temática e uma breve descrição inicial.</p>
                </div>
            </div>

            <div className="flex justify-center">
                <ChevronRightIcon className="w-6 h-6 text-gray-500 rotate-90" />
            </div>

            <div className="flex items-center gap-4">
                 <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <GeminiIcon className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Etapa 2: Gemini - O Arquiteto</h3>
                    <p className="text-sm">O Gemini, da Google, recebe o conceito inicial e o enriquece. Ele adiciona o lore, a estrutura, os detalhes mecânicos para RPG, os ganchos narrativos e um protótipo de descrição visual para a geração de imagem.</p>
                </div>
            </div>

             <div className="flex justify-center">
                <ChevronRightIcon className="w-6 h-6 text-gray-500 rotate-90" />
            </div>

            <div className="flex items-center gap-4">
                 <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <GptIcon className="w-7 h-7 text-green-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Etapa 3: GPT-4o - O Artista Final</h3>
                    <p className="text-sm">Por fim, o modelo da OpenAI (GPT-4o) realiza o polimento final. Ele aprimora a narrativa para um tom de roleplay mais forte e refina a descrição visual para que se torne um prompt de imagem otimizado e pronto para ser usado.</p>
                </div>
            </div>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-lg text-center">
            <p className="font-semibold">Essa colaboração entre IAs garante que cada item seja único e bem desenvolvido, economizando tempo e inspirando novas aventuras!</p>
        </div>

      </div>
    </Modal>
  );
};
