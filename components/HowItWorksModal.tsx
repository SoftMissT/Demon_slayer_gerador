import React from 'react';
import { Modal } from './ui/Modal';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
    const steps = [
        {
            title: "1. DeepSeek (O Conceitualizador)",
            description: "A primeira IA gera a ideia base, o conceito bruto e fundamental do item, personagem ou técnica solicitada.",
            color: "border-blue-500",
        },
        {
            title: "2. Google Gemini (O Arquiteto)",
            description: "Em seguida, o Gemini recebe esse conceito e o enriquece, adicionando lore, estrutura, detalhes mecânicos para RPG e um protótipo de descrição visual.",
            color: "border-green-500",
        },
        {
            title: "3. OpenAI GPT-4o (O Artista Final)",
            description: "Por fim, o modelo da OpenAI realiza o polimento final, aprimorando a narrativa para um tom de roleplay mais forte e refinando a descrição visual para que ela se torne um prompt de imagem pronto para ser usado.",
            color: "border-purple-500",
        }
    ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PASSO-A-PASSO DA FORJA">
      <div className="p-6">
        <p className="text-gray-300 mb-6">
            O Kimetsu Forge utiliza uma orquestração de três modelos de Inteligência Artificial para transformar seus filtros em um conteúdo rico e detalhado. Veja como funciona:
        </p>
        <div className="space-y-4">
            {steps.map((step, index) => (
                 <div key={index} className={`p-4 bg-gray-900/50 rounded-lg border-l-4 ${step.color}`}>
                    <h4 className="font-bold text-white text-lg">{step.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{step.description}</p>
                </div>
            ))}
        </div>
         <p className="text-sm text-gray-500 mt-6 text-center italic">
            Esta colaboração garante que cada item tenha uma base conceitual sólida, uma estrutura rica em detalhes e uma narrativa polida.
        </p>
      </div>
    </Modal>
  );
};
