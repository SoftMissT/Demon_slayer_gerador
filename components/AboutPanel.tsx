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
            <p>Kimetsu Forge é uma ferramenta criativa feita de fã para fã, voltada para mestres e jogadores de RPG de mesa, com inspiração no universo sombrio e emocionante de Demon Slayer (Kimetsu no Yaiba).</p>
            
            <h3>Features</h3>
            <ul>
              <li>Geração de elementos de RPG como armas, demônios, técnicas de respiração e ganchos de história.</li>
              <li>Criação de descrições detalhadas e prontas para uso em prompts de imagem.</li>
              <li>Aceleração do processo de criação de histórias com conteúdo gerado por uma colaboração de IAs.</li>
            </ul>

            <h3>Como Funciona</h3>
            <p><strong>DeepSeek (O Conceitualizador):</strong> A primeira IA gera a ideia base.</p>
            <p><strong>Google Gemini (O Arquiteto):</strong> O Gemini enriquece o conceito com lore e mecânicas.</p>
            <p><strong>OpenAI GPT-4o (O Artista Final):</strong> O GPT-4o realiza o polimento final da narrativa.</p>
            
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