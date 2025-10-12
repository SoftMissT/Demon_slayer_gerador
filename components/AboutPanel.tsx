import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { GithubIcon } from './icons/GithubIcon';
import { PlayIcon } from './icons/PlayIcon';
import { DiscordIcon } from './icons/DiscordIcon';

export const AboutPanel: React.FC = () => {
    const content = {
        title: "📜 Sobre o Kimetsu Forge",
        description: "O Kimetsu Forge é uma ferramenta criativa feita por fãs para fãs, projetada para ajudar mestres e jogadores de RPG de mesa a gerar ideias, itens, NPCs, cenários e ganchos narrativos de forma rápida e inspiradora.\n\nEsta aplicação utiliza modelos de IA generativa — incluindo o Google Gemini e a API do GPT — para criar descrições, enredos e prompts de imagem que podem ser adaptados ao estilo da sua campanha.",
        legalTitle: "⚠️ Aviso Legal",
        legalText: "Este é um projeto não oficial e sem fins lucrativos.\nDemon Slayer (Kimetsu no Yaiba) é propriedade de Koyoharu Gotouge, Shueisha e Ufotable.\nTodo o conteúdo gerado é fictício e destinado apenas a entretenimento e uso pessoal em jogos de RPG.",
        supportTitle: "🎬 Apoie os criadores originais",
        supportText: "Assista Demon Slayer de forma legal:",
        supportLink: "https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba",
        creditsTitle: "👥 Créditos",
        creators: "Criadores: SoftMisst & Mathzin",
        collaborators: "Colaboradores: ZeratulBr, Cardhial, VK, Dan, Akira",
        sourceTitle: "💻 Código Fonte",
        sourceLink: "https://github.com/SoftMissT/Demon_slayer_gerador",
        communityTitle: "💬 Comunidade",
        communityText: "Junte-se ao nosso servidor no Discord para compartilhar suas criações, dar feedback e ficar por dentro das novidades!",
        communityLink: "https://discord.gg/Xp4XnWQQHr",
        noteTitle: "💡 Observação",
        noteText: "O Kimetsu Forge é uma ferramenta de apoio para agilizar ideias e não substitui o papel criativo dos jogadores e mestres."
    };

    const openLink = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="p-6 md:p-8">
                <div className="prose prose-invert max-w-none text-gray-300">
                    <h2 className="text-2xl md:text-3xl font-bold text-white font-gangofthree">{content.title}</h2>
                    <p className="whitespace-pre-wrap">{content.description}</p>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.legalTitle}</h3>
                    <p className="whitespace-pre-wrap text-sm">{content.legalText}</p>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.communityTitle}</h3>
                    <p>{content.communityText}</p>
                    <Button onClick={() => openLink(content.communityLink)} className="mt-2">
                        <DiscordIcon className="w-5 h-5" />
                        Entrar no Discord (Nostromos)
                    </Button>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.supportTitle}</h3>
                    <p>{content.supportText}</p>
                     <Button onClick={() => openLink(content.supportLink)} variant="secondary">
                        <PlayIcon className="w-5 h-5" />
                        Assistir na Crunchyroll
                    </Button>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.creditsTitle}</h3>
                    <p>{content.creators}</p>
                    <p>{content.collaborators}</p>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.sourceTitle}</h3>
                     <Button onClick={() => openLink(content.sourceLink)} variant="secondary">
                        <GithubIcon className="w-5 h-5" />
                        Ver no GitHub
                    </Button>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.noteTitle}</h3>
                    <p className="italic">{content.noteText}</p>
                </div>
            </Card>
        </div>
    );
};