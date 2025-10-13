
import React from 'react';
import { aboutContent } from '../lib/aboutContent';
import { DiscordIcon } from './icons/DiscordIcon';
import { GithubIcon } from './icons/GithubIcon';
import { PlayIcon } from './icons/PlayIcon';

interface AboutPanelProps {
    onClose: () => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ onClose }) => {
    return (
        <div className="about-panel-container bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg max-w-3xl w-full text-white">
            <header className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold font-gangofthree">Sobre o Kimetsu Forge</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </header>
            <div className="p-6 overflow-y-auto max-h-[70vh] prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:font-gangofthree prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
                <p>{aboutContent.app_short}</p>
                
                <h3>O Que é o Kimetsu Forge?</h3>
                <p>
                    Kimetsu Forge é uma ferramenta criativa feita de fã para fã, voltada para mestres e jogadores de RPG de mesa, com inspiração no universo sombrio e emocionante de Demon Slayer (Kimetsu no Yaiba).
                    Ela auxilia na geração de armas, inimigos, formas de respiração, NPCs e cenários inteiros usando uma orquestração de IAs generativas.
                </p>

                <h3>Features</h3>
                <ul>
                    <li>Geração de elementos de RPG como armas, demônios, técnicas de respiração e ganchos de história.</li>
                    <li>Criação de descrições detalhadas e prontas para uso em prompts de imagem, otimizadas para plataformas como Midjourney e DALL·E.</li>
                    <li>Aceleração do processo de criação de histórias com conteúdo gerado por uma colaboração de IAs.</li>
                </ul>

                <h3>Como Funciona: A Orquestração de IAs</h3>
                <p>O Kimetsu Forge utiliza um fluxo de três etapas para garantir resultados ricos e detalhados:</p>
                <ol>
                    <li><strong>DeepSeek (O Conceitualizador):</strong> A primeira IA gera a ideia base, o conceito bruto e fundamental do item, personagem ou técnica solicitada.</li>
                    <li><strong>Google Gemini (O Arquiteto):</strong> Em seguida, o Gemini recebe esse conceito e o enriquece, adicionando lore, estrutura, detalhes mecânicos para RPG e um protótipo de descrição visual.</li>
                    <li><strong>OpenAI GPT-4o (O Artista Final):</strong> Por fim, o modelo da OpenAI realiza o polimento final, aprimorando a narrativa para um tom de roleplay mais forte e refinando a descrição visual para que ela se torne um prompt de imagem pronto para ser usado.</li>
                </ol>

                <h3>Créditos</h3>
                <ul>
                    <li><strong>Criadores:</strong> SoftMissT & Mathzin</li>
                    <li><strong>Colaboradores:</strong> ZeratulBr, Cardhial, VK, Dan, Akira</li>
                </ul>
                
                <h3>Aviso Legal</h3>
                <p>
                    Este é um projeto de fã não oficial, criado apenas para fins educacionais e de entretenimento.
                    Demon Slayer: Kimetsu no Yaiba é uma propriedade de Koyoharu Gotouge, Shueisha e Ufotable.
                    Todos os direitos do universo original e dos personagens pertencem aos seus respectivos proprietários.
                </p>
                <a href="https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold no-underline">
                   <PlayIcon className="w-5 h-5" /> Assista ao anime legalmente na Crunchyroll.
                </a>
            </div>
             <footer className="p-4 border-t border-gray-700 flex justify-center items-center gap-4">
                 <a href="https://github.com/SoftMissT/Demon_slayer_gerador" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <GithubIcon className="w-6 h-6" />
                </a>
                <a href="https://discord.gg/vS3mbbhX68" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <DiscordIcon className="w-6 h-6" />
                </a>
             </footer>
        </div>
    );
};
