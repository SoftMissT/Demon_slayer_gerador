import React from 'react';
import { GithubIcon } from './icons/GithubIcon';
import { HeartIcon } from './icons/HeartIcon';
import { Button } from './ui/Button';
import { PlayIcon } from './icons/PlayIcon';
import { DiscordIcon } from './icons/DiscordIcon';
import { BookIcon } from './icons/BookIcon';
import { AnvilIcon } from './icons/AnvilIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { BrainIcon } from './icons/BrainIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { UsersIcon } from './icons/UsersIcon';

interface AboutPanelProps {
  onClose: () => void;
}

const ActionButton: React.FC<{ href: string; className?: string; children: React.ReactNode }> = ({ href, className, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-full">
        <Button variant="secondary" className={`w-full !justify-start ${className}`}>
            {children}
        </Button>
    </a>
);

export const AboutPanel: React.FC<AboutPanelProps> = ({ onClose }) => {
  return (
    <div className="about-panel bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl max-w-3xl w-full mx-auto">
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold font-gangofthree text-white">Sobre & Como Funciona</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
      </header>
      <div className="p-6 max-h-[70vh] overflow-y-auto inner-scroll">
        <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:font-gangofthree">
            <p>Kimetsu Forge é uma ferramenta criativa feita de fã para fã, voltada para mestres e jogadores de RPG de mesa, com inspiração no universo sombrio e emocionante de Demon Slayer (Kimetsu no Yaiba).</p>
            
            <h3>Features</h3>
            <ul>
              <li>Geração de elementos de RPG como armas, demônios, técnicas de respiração e ganchos de história.</li>
              <li>Criação de descrições detalhadas e prontas para uso em prompts de imagem.</li>
              <li>Aceleração do processo de criação de histórias com conteúdo gerado por uma colaboração de IAs.</li>
            </ul>

             <h3>Como Funciona</h3>
            <div className="not-prose space-y-4 my-4">
                 <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="flex items-center gap-2 font-bold text-white text-lg mb-2">
                    <AnvilIcon className="w-6 h-6 text-indigo-400" />
                    Modo Forja
                    </h4>
                    <p className="text-sm">
                    Use a Bigorna para gerar itens, personagens e mais. Selecione uma categoria, ajuste os filtros e clique em "Forjar".
                    </p>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="flex items-center gap-2 font-bold text-white text-lg mb-2">
                    <MagicWandIcon className="w-6 h-6 text-purple-400" />
                    Modo Alquimia
                    </h4>
                    <p className="text-sm">
                    O Alquimista de Prompts ajuda a criar descrições perfeitas para IAs de imagem. Escreva uma ideia base e a IA irá gerar prompts otimizados.
                    </p>
                </div>
                <h4 className="font-bold text-white text-lg pt-2 text-center">O Processo Criativo da IA</h4>
                 <ol className="relative border-l border-gray-700 ml-4">                  
                    <li className="mb-6 ml-6">            
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                        <LightbulbIcon className="w-5 h-5 text-indigo-300" />
                    </span>
                    <h5 className="font-semibold text-white">1. Conceito (DeepSeek)</h5>
                    <p className="text-sm text-gray-400">Uma IA gera a ideia inicial, a faísca da criação.</p>
                    </li>
                    <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                        <BrainIcon className="w-5 h-5 text-indigo-300" />
                    </span>
                    <h5 className="font-semibold text-white">2. Estrutura (Gemini)</h5>
                    <p className="text-sm text-gray-400">O Gemini expande o conceito, adicionando lore e detalhes.</p>
                    </li>
                    <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-full -left-4 ring-4 ring-gray-800">
                        <UsersIcon className="w-5 h-5 text-indigo-300" />
                    </span>
                    <h5 className="font-semibold text-white">3. Polimento (GPT-4o)</h5>
                    <p className="text-sm text-gray-400">O GPT-4o refina a narrativa e otimiza a descrição para geração de imagem.</p>
                    </li>
                </ol>
            </div>
            
            <h3>Aviso Legal</h3>
            <p>Este é um projeto de fã não oficial. Demon Slayer: Kimetsu no Yaiba é uma propriedade de Koyoharu Gotouge, Shueisha e Ufotable.</p>
            
            <div className="my-6 space-y-3 not-prose">
                <ActionButton href="https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba" className="crunchyroll-button">
                    <PlayIcon className="w-5 h-5" /> Assista ao anime legalmente na Crunchyroll
                </ActionButton>
                <ActionButton href="https://discord.gg/invite/seuservidor" className="discord-button">
                    <DiscordIcon className="w-5 h-5" /> Entre na nossa comunidade do Discord
                </ActionButton>
                 <ActionButton href="https://www.panini.com.br/shp_brp_pt/demon-slayer-kimetsu-no-yaiba.html" className="panini-button">
                    <BookIcon className="w-5 h-5" /> Compre o mangá oficial (Panini)
                </ActionButton>
            </div>

            <h3>Créditos</h3>
            <p>
                <strong>Criadores:</strong> SoftMisst & Mathzin <br />
                <strong>Colaboradores:</strong> ZeratulBr, Cardhial, VK, Dan, Akira
            </p>
        </div>
      </div>
       <footer className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
            <p className="flex items-center justify-center gap-1.5">
                Feito com <HeartIcon className="w-4 h-4 text-red-500" /> por SoftMissT & Mathzin.
            </p>
            <a 
                href="https://github.com/SoftMissT/Demon_slayer_gerador" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 hover:text-white"
            >
                <GithubIcon className="w-4 h-4" />
                Ver no GitHub
            </a>
       </footer>
    </div>
  );
};