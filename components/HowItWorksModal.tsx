
import React from 'react';
import { Modal } from './ui/Modal';
import { DiscordIcon } from './icons/DiscordIcon';
import { AnvilIcon } from './icons/AnvilIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full flex-shrink-0">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white font-gangofthree">{title}</h3>
        </div>
        <div className="pl-11 text-sm text-gray-300 space-y-2 prose prose-invert max-w-none prose-p:my-1 prose-ul:my-2">
            {children}
        </div>
    </div>
);


export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BEM-VINDO À KIMETSU FORGE!">
      <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto inner-scroll">
          <p className="text-gray-300 mb-6 text-center">
              Um guia completo para forjar suas lendas, da autenticação à geração avançada de prompts.
          </p>
          
          <Section title="Acesso à Forja" icon={<DiscordIcon className="w-5 h-5" />}>
              <p>O acesso às funcionalidades de geração é exclusivo e requer autenticação com sua conta do Discord.</p>
              <ul>
                  <li><strong>Login com Discord:</strong> Clique no botão do Discord no cabeçalho para iniciar.</li>
                  <li><strong>Lista de Acesso (Whitelist):</strong> Para usar a forja, seu ID do Discord precisa estar na lista de usuários autorizados, gerenciada pelo administrador. Se encontrar problemas, entre em contato para solicitar acesso.</li>
              </ul>
          </Section>

          <Section title="Forja: Criando Conteúdo de RPG" icon={<AnvilIcon className="w-5 h-5" />}>
              <p>A Forja é sua principal ferramenta para criar itens, personagens, missões e muito mais.</p>
              <ul>
                  <li><strong>Categoria:</strong> O ponto de partida. Escolha o que você quer criar (Ex: Arma, Inimigo/Oni, Missão). Isso revelará filtros específicos.</li>
                  <li><strong>Diretrizes da Forja:</strong> Você pode direcionar cada uma das 3 IAs do nosso fluxo (DeepSeek, Gemini, GPT) para focar em aspectos como <strong>Lore</strong>, <strong>Mecânicas de Jogo</strong> ou <strong>Polimento Narrativo</strong>.</li>
                  <li><strong>Filtros Específicos:</strong> Refine sua criação com detalhes. Quanto mais específico você for (temática, raridade, país de origem, etc.), mais personalizado será o resultado.</li>
                  <li><strong>Referências de Estilo:</strong> Guie o estilo visual da imagem que será gerada. Use nomes de animes, artistas ou jogos (Ex: <em>Studio Ghibli, Dark Souls, Yoshitaka Amano</em>).</li>
                  <li><strong>Modificador de Prompt:</strong> Uma instrução direta e de alta prioridade para a IA. Ótimo para testes rápidos ou para forçar uma ideia específica (Ex: <em>"Crie algo com um toque de terror cósmico"</em>).</li>
              </ul>
              <p className="text-xs text-gray-400 italic mt-2">Nosso processo de geração em 3 etapas (Conceito > Estrutura > Polimento) garante que cada item seja único, detalhado e com uma narrativa envolvente.</p>
          </Section>
          
          <Section title="Alquimia: Destilando Prompts de Imagem" icon={<MagicWandIcon className="w-5 h-5 text-purple-400" />}>
              <p>A Alquimia é uma ferramenta avançada para transformar uma ideia simples em prompts de imagem altamente detalhados e otimizados para diferentes IAs.</p>
               <ul>
                  <li><strong>Caldeirão:</strong> Insira sua ideia principal (o que você quer ver) e um prompt negativo (o que evitar).</li>
                  <li><strong>Parâmetros:</strong> Use os painéis (Midjourney, GPT/DALL-E, Gemini) para controlar aspectos visuais como <strong>Estilo de Arte</strong>, <strong>Iluminação</strong>, <strong>Composição</strong> e parâmetros técnicos como <code>--ar</code> (Aspect Ratio) ou <code>--niji</code>.</li>
                  <li><strong>Resultado:</strong> A Alquimia irá "destilar" sua ideia, combinando-a com seus parâmetros para gerar 3 prompts de imagem profissionais, cada um otimizado para um modelo de IA diferente.</li>
              </ul>
          </Section>

          <div className="text-center mt-8 pt-4 border-t border-gray-700">
              <p className="text-indigo-300 font-semibold">Agora você está pronto. Experimente, combine e crie. Boas forjas!</p>
          </div>
      </div>
    </Modal>
  );
};
