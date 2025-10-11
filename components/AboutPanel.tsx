import React from 'react';
import { Card } from './ui/Card';

export const AboutPanel: React.FC = () => {
    const content = {
        title: "📜 Sobre o Kimetsu Forge",
        description: "O Kimetsu Forge é uma ferramenta criativa feita por fãs para fãs, projetada para ajudar mestres e jogadores de RPG de mesa a gerar ideias, itens, NPCs, cenários e ganchos narrativos de forma rápida e inspiradora.\n\nEsta aplicação utiliza modelos de IA generativa — incluindo o Google Gemini e a API do GPT — para criar descrições, enredos e prompts de imagem que podem ser adaptados ao estilo da sua campanha.",
        legalTitle: "⚠️ Aviso Legal",
        legalText: "Este é um projeto não oficial и sem fins lucrativos.\nDemon Slayer (Kimetsu no Yaiba) é propriedade de Koyoharu Gotouge, Shueisha e Ufotable.\nTodo o conteúdo gerado é fictício e destinado apenas a entretenimento e uso pessoal em jogos de RPG.",
        supportTitle: "🎬 Apoie os criadores originais",
        supportText: "Assista Demon Slayer de forma legal:",
        supportLink: "https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba",
        creditsTitle: "👥 Créditos",
        creators: "Criadores: SoftMisst & Mathzin",
        collaborators: "Colaboradores: ZeratulBr, Cardhial, VK, Dan, Akira",
        noteTitle: "💡 Observação",
        noteText: "O Kimetsu Forge é uma ferramenta de apoio para agilizar ideias e não substitui o papel criativo dos jogadores e mestres."
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="p-6 md:p-8">
                <div className="prose prose-invert max-w-none text-gray-300">
                    <h2 className="text-2xl md:text-3xl font-bold text-white font-gangofthree">{content.title}</h2>
                    <p className="whitespace-pre-wrap">{content.description}</p>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.legalTitle}</h3>
                    <p className="whitespace-pre-wrap text-sm">{content.legalText}</p>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.supportTitle}</h3>
                    <p>{content.supportText}</p>
                    <a href={content.supportLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline break-all">
                        👉 {content.supportLink}
                    </a>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.creditsTitle}</h3>
                    <p>{content.creators}</p>
                    <p>{content.collaborators}</p>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.noteTitle}</h3>
                    <p className="italic">{content.noteText}</p>
                </div>
            </Card>
        </div>
    );
};