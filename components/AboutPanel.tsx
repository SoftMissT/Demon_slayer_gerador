import React from 'react';
import { GithubIcon } from './icons/GithubIcon';
import { HeartIcon } from './icons/HeartIcon';
import { Button } from './ui/Button';
import { PlayIcon } from './icons/PlayIcon';
import { DiscordIcon } from './icons/DiscordIcon';
import { BookIcon } from './icons/BookIcon';

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
    <div className="about-panel bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full mx-auto">
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold font-gangofthree text-white">Sobre o Kimetsu Forge</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
      </header>
      <div className="p-6 max-h-[70vh] overflow-y-auto inner-scroll">
        <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:font-gangofthree">
            <h4>Forje lendas. Crie universos.</h4>
            <p>
                Kimetsu Forge é o seu arsenal criativo para RPGs de mesa, inspirado no universo de Demon Slayer. Use o poder de uma orquestra de IAs para gerar itens, inimigos, técnicas e prompts de imagem épicos em segundos.
            </p>
            
            <h3>A Orquestra de IAs: A Alma da Forja</h3>
            <p>Cada criação passa por um processo de 3 etapas para garantir profundidade e qualidade:</p>
            <ol>
              <li><strong>A Faísca (DeepSeek):</strong> Gera o conceito bruto, a ideia inicial.</li>
              <li><strong>A Estrutura (Google Gemini):</strong> Expande o conceito com lore, mecânicas de RPG e detalhes visuais.</li>
              <li><strong>O Polimento (GPT-4o):</strong> Refina a narrativa e otimiza o prompt de imagem para resultados espetaculares.</li>
            </ol>

            <h3>Aviso Legal e Agradecimentos</h3>
            <p>
                Este é um projeto de fã, <strong>não oficial</strong> e sem fins lucrativos. Demon Slayer: Kimetsu no Yaiba © Koyoharu Gotouge, Shueisha, Ufotable. Todos os direitos reservados.
            </p>
            
            <div className="my-6 space-y-3 not-prose">
                <ActionButton href="https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba" className="crunchyroll-button">
                    <PlayIcon className="w-5 h-5" /> Assista ao anime na Crunchyroll
                </ActionButton>
                <ActionButton href="https://discord.gg/invite/seuservidor" className="discord-button">
                    <DiscordIcon className="w-5 h-5" /> Junte-se à nossa comunidade
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