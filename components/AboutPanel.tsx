import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { GithubIcon } from './icons/GithubIcon';
import { PlayIcon } from './icons/PlayIcon';
import { DiscordIcon } from './icons/DiscordIcon';
import { BookIcon } from './icons/BookIcon';

export const AboutPanel: React.FC = () => {
    const content = {
        title: "📜 Sobre o Kimetsu Forge",
        description: "O Kimetsu Forge é uma ferramenta criativa feita por fãs para fãs, projetada para ajudar mestres e jogadores de RPG de mesa a gerar ideias, itens, NPCs, cenários e ganchos narrativos de forma rápida e inspiradora.",
        howItWorksTitle: "🧠 Como a Forja Funciona?",
        howItWorksText: "Utilizamos uma orquestração de IAs em 3 etapas para garantir resultados ricos e detalhados:",
        steps: [
            {
                title: "1. DeepSeek (O Conceitualizador)",
                description: "A primeira IA gera a ideia base, o conceito bruto e fundamental do item, personagem ou técnica solicitada."
            },
            {
                title: "2. Google Gemini (O Arquiteto)",
                description: "Em seguida, o Gemini recebe esse conceito e o enriquece, adicionando lore, estrutura, detalhes mecânicos para RPG e um protótipo de descrição visual."
            },
            {
                title: "3. OpenAI GPT-4o (O Artista Final)",
                description: "Por fim, o modelo da OpenAI realiza o polimento final, aprimorando a narrativa para um tom de roleplay mais forte e refinando a descrição visual para que ela se torne um prompt de imagem pronto para ser usado."
            }
        ],
        legalTitle: "⚠️ Aviso Legal",
        legalText: "Este é um projeto não oficial e sem fins lucrativos, criado em homenagem à incrível obra de Koyoharu Gotouge.\nDemon Slayer (Kimetsu no Yaiba) é propriedade de Koyoharu Gotouge, Shueisha e Ufotable.\nTodo o conteúdo gerado é fictício e destinado apenas a entretenimento e uso pessoal em jogos de RPG.",
        supportTitle: "🎬 Apoie a Obra Original",
        supportText: "A melhor maneira de mostrar seu apoio é consumindo o conteúdo oficial:",
        crunchyrollLink: "https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba",
        paniniLink: "https://panini.com.br/catalogsearch/result/index/referer/aHR0cHM6Ly9wYW5pbmkuY29tLmJyL2NhdGFsb2dzZWFyY2gvcmVzdWx0Lz9xPURlbW9uK1NsYXllcg~~/?collection=DEMON+SLAYER+-+KIMETSU+NO+YAIBA&q=Demon+Slayer",
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
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.howItWorksTitle}</h3>
                    <p>{content.howItWorksText}</p>
                    <div className="space-y-3 mt-4">
                        {content.steps.map((step, index) => (
                            <div key={index} className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-indigo-500">
                                <h4 className="font-semibold text-white">{step.title}</h4>
                                <p className="text-sm text-gray-400 mb-0">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.legalTitle}</h3>
                    <p className="whitespace-pre-wrap text-sm">{content.legalText}</p>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.supportTitle}</h3>
                    <p>{content.supportText}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                         <Button onClick={() => openLink(content.crunchyrollLink)} variant="secondary">
                            <PlayIcon className="w-5 h-5" />
                            Assistir na Crunchyroll
                        </Button>
                        <Button onClick={() => openLink(content.paniniLink)} variant="secondary">
                            <BookIcon className="w-5 h-5" />
                            Comprar na Panini
                        </Button>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white font-gangofthree mt-6">{content.communityTitle}</h3>
                    <p>{content.communityText}</p>
                    <Button onClick={() => openLink(content.communityLink)} className="mt-2">
                        <DiscordIcon className="w-5 h-5" />
                        Entrar no Discord (Nostromos)
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