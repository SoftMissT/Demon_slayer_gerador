import React from 'react';

// Define the props interface for the component
interface AboutPanelProps {
  onClose: () => void;
}

// Helper function to open links in a new tab safely
const openLink = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

// Main component
export const AboutPanel: React.FC<AboutPanelProps> = ({ onClose }) => {
  
  // URLs for external links
  const links = {
    discord: "https://discord.gg/Xp4XnWQQHr",
    github: "https://github.com/SoftMissT/Demon_slayer_gerador",
    crunchyroll: "https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba",
    panini: "https://panini.com.br/catalogsearch/result/index/referer/aHR0cHM6Ly9wYW5pbmkuY29tLmJyL2NhdGFsb2dzZWFyY2gvcmVzdWx0Lz9xPURlbW9uK1NsYXllcg~~/?collection=DEMON+SLAYER+-+KIMETSU+NO+YAIBA&q=Demon+Slayer"
  };

  return (
    <div className="kf-card">
      <header className="kf-card-header">
        <img src="https://i.imgur.com/M9BDKmO.png" alt="Logo Kimetsu Forge — Forjando Lendas em Aço e Magia" className="kf-logo" />
        <div>
          <h2 id="kf-about-title" className="text-xl font-bold text-white font-gangofthree -mb-1">Kimetsu Forge</h2>
          <p className="kf-sub">Forjando lendas em aço e magia.</p>
        </div>
      </header>

      <section className="kf-body">
        <p>O Kimetsu Forge é uma ferramenta criada por fãs para fãs — um ateliê digital que ajuda mestres e jogadores de RPG de mesa a conceber: itens, NPCs, inimigos, missões e imagens com rapidez e personalidade. Pense nele como a oficina onde ideias cruas viram lendas jogáveis.</p>
        
        <h3>Como a Forja funciona</h3>
        <p>Usamos uma orquestra de inteligências artificiais em três etapas para transformar sua ideia em conteúdo pronto para mesa e imagem:</p>
        <ul className="list-none !p-0 space-y-2 mt-2">
            <li><strong>DeepSeek — O Conceitualizador:</strong> Gera a ideia central: personalidade, gancho narrativo e a essência do que você pediu.</li>
            <li><strong>Google Gemini — O Arquiteto:</strong> Estrutura o conceito em mecânicas, atributos, loot e lore; cria a “espinha” jogável do conteúdo.</li>
            <li><strong>OpenAI GPT — O Artista Final:</strong> Polimento narrativo: transforma a estrutura em descrições prontas para ficha, diálogos e prompts de imagem.</li>
        </ul>

        <h3 className="mt-4">Legal & Direitos</h3>
        <p className="text-sm">Este projeto é não oficial e sem fins lucrativos, criado em homenagem à obra de Koyoharu Gotouge. Demon Slayer (Kimetsu no Yaiba) é propriedade de Koyoharu Gotouge, Shueisha e Ufotable. Todo o conteúdo gerado no Kimetsu Forge é fictício e destinado exclusivamente a entretenimento e uso pessoal em jogos de RPG.</p>

        <h3 className="mt-4">Apoie o conteúdo original</h3>
        <p>A melhor forma de agradecer ao criador é consumir a obra oficial:</p>
        <div className="flex gap-2 text-sm mt-2">
            <button onClick={() => openLink(links.crunchyroll)} className="kf-link">Assistir pela Crunchyroll</button>
            <span>•</span>
            <button onClick={() => openLink(links.panini)} className="kf-link">Comprar pela Panini</button>
        </div>
        
        <h3 className="mt-4">Comunidade & Código</h3>
        <p>Junte-se ao nosso servidor no Discord para trocar criações, dar feedback e participar de eventos. O código-fonte está disponível no GitHub — contribuições são bem-vindas.</p>
        <div className="flex gap-2 text-sm mt-2">
            <button onClick={() => openLink(links.discord)} className="kf-link">Entrar no Discord</button>
            <span>•</span>
            <button onClick={() => openLink(links.github)} className="kf-link">Código-fonte no GitHub</button>
        </div>
        
        <p className="text-xs italic mt-6"><strong>Nota final:</strong> O Kimetsu Forge é uma ferramenta de co-criação: acelera a execução e mantém você no fluxo criativo, mas não substitui o toque humano. Use, itere, adapte — e forje coisas que valham a pena lembrar à mesa.</p>

      </section>

      <footer className="kf-footer">
        <small><strong>Criadores:</strong> SoftMisst & Mathzin — <strong>Colab:</strong> ZeratulBr, Cardhial, VK, Dan, Akira</small>
        <div className="kf-actions">
          <button className="btn btn-muted" onClick={onClose}>Fechar</button>
        </div>
      </footer>
    </div>
  );
};
