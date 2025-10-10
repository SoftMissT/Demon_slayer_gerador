// FIX: Created content for the About modal to resolve placeholder errors. This file now exports a structured object with titles, sections, and text explaining the application's purpose, features, and technologies.
export const aboutContent = {
  title: "Sobre o Forja de Lendas",
  introduction: "O Forja de Lendas é uma ferramenta criativa projetada para mestres e jogadores de RPG de mesa, com um foco especial no universo sombrio e fascinante de Demon Slayer (Kimetsu no Yaiba). Utilizando o poder da IA generativa do Google Gemini, esta aplicação ajuda a criar conteúdo rico e detalhado para suas campanhas.",
  
  sections: [
    {
      title: "O que você pode fazer?",
      content: [
        {
          heading: "Forja de Lendas",
          text: "Gere itens, armas, inimigos, caçadores, kekkijutsus, formas de respiração e até mesmo cenários completos. Use os filtros para refinar os resultados e encontrar exatamente o que você precisa para sua próxima sessão.",
        },
        {
          heading: "Engenheiro de Prompt de Imagem",
          text: "Transforme suas ideias em prompts de imagem otimizados para diversas plataformas de IA, como Midjourney e DALL-E. A ferramenta analisa sua descrição, busca referências na web e constrói prompts detalhados para você obter os melhores resultados visuais.",
        }
      ],
    },
    {
      title: "Tecnologias Utilizadas",
      content: [
        {
          heading: "Google Gemini API",
          text: "O coração da aplicação. O modelo Gemini 2.5 Flash é responsável por toda a geração de conteúdo textual, desde as descrições dos itens até a criação dos prompts de imagem.",
        },
        {
          heading: "Next.js & React",
          text: "A aplicação é construída com Next.js, um framework React que oferece uma experiência de desenvolvimento moderna e performática.",
        },
        {
          heading: "Tailwind CSS",
          text: "Para um design rápido, responsivo e customizável, utilizamos o framework de CSS utilitário Tailwind CSS.",
        }
      ]
    },
    {
      title: "Aviso Legal",
      content: [
        {
          text: "Este é um projeto não oficial, criado por fãs para fãs. Demon Slayer (Kimetsu no Yaiba) é uma propriedade de Koyoharu Gotouge, Shueisha e Ufotable. Todos os direitos sobre o universo e seus personagens pertencem a seus respectivos donos. O conteúdo gerado é fictício e destinado apenas para uso em entretenimento pessoal em jogos de RPG.",
        }
      ]
    },
    {
      title: "Agradecimentos",
      content: [
        {
          text: "Obrigado a todos os criadores de conteúdo e artistas da comunidade de RPG e de Demon Slayer que inspiram a criação de ferramentas como esta. Seu trabalho enriquece o hobby de inúmeras maneiras.",
        }
      ]
    }
  ],

  support: {
    title: "Apoie o Projeto",
    text: "Se você gostou desta ferramenta e quer ver mais projetos como este, considere apoiar o desenvolvedor. Qualquer gesto é muito apreciado!",
  },
};
