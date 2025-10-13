import React from 'react';
import { aboutContent } from '../lib/aboutContent';
import { GithubIcon } from './icons/GithubIcon';
import { HeartIcon } from './icons/HeartIcon';

interface AboutPanelProps {
  onClose: () => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ onClose }) => {
  return (
    <div className="about-panel bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl max-w-3xl w-full mx-auto">
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold font-gangofthree text-white">Sobre o Kimetsu Forge</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
      </header>
      <div className="p-6 max-h-[70vh] overflow-y-auto inner-scroll">
        <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:font-gangofthree">
          <React.Fragment>
            <p>{aboutContent.readme_long.split('\n')[2]}</p>
            <h3>Features</h3>
            <ul>
              <li>Geração de elementos de RPG como armas, demônios, técnicas de respiração e ganchos de história.</li>
              <li>Criação de descrições detalhadas e prontas para uso em prompts de imagem.</li>
              <li>Aceleração do processo de criação de histórias com conteúdo gerado por uma colaboração de IAs.</li>
            </ul>
            <h3>Como Funciona</h3>
            <ol>
              <li><strong>DeepSeek (O Conceitualizador):</strong> A primeira IA gera a ideia base.</li>
              <li><strong>Google Gemini (O Arquiteto):</strong> O Gemini enriquece o conceito com lore e mecânicas.</li>
              <li><strong>OpenAI GPT-4o (O Artista Final):</strong> O GPT-4o realiza o polimento final da narrativa.</li>
            </ol>
            <h3>Aviso Legal</h3>
            <p>Este é um projeto de fã não oficial. Demon Slayer: Kimetsu no Yaiba é uma propriedade de Koyoharu Gotouge, Shueisha e Ufotable.</p>
            <p>Assista ao anime legalmente na <a href="https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba" target="_blank" rel="noopener noreferrer">Crunchyroll</a>.</p>
            <h3>Créditos</h3>
            <ul>
              <li><strong>Criadores:</strong> SoftMisst & Mathzin</li>
              <li><strong>Colaboradores:</strong> ZeratulBr, Cardhial, VK, Dan, Akira</li>
            </ul>
          </React.Fragment>
        </div>
      </div>
       <footer className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
            <p className="flex items-center justify-center gap-1">
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
