import React from 'react';
import { Modal } from './ui/Modal';
import { DiscordIcon } from './icons/DiscordIcon';
import { AnvilIcon } from './icons/AnvilIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { HelpIcon } from './icons/HelpIcon';
import { HammerIcon } from './icons/HammerIcon';
import { TagIcon } from './icons/TagIcon';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
            {icon && (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full flex-shrink-0">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-bold text-white font-gangofthree">{title}</h3>
        </div>
        <div className={`text-sm text-gray-300 space-y-2 prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 ${!icon ? '' : 'pl-11'}`}>
            {children}
        </div>
    </div>
);


export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BEM-VINDO À KIMETSU FORGE!" panelClassName="!max-w-4xl">
      <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto inner-scroll">
          <p className="text-gray-300 mb-8 text-center text-base">
              Um guia rápido e prático para forjar suas lendas — da autenticação à geração avançada de prompts.
          </p>
          
          <Section title="1) Acesso à Forja" icon={<DiscordIcon className="w-5 h-5" />}>
              <p><strong>Requisito:</strong> é necessário login com Discord e estar na whitelist.</p>
              <ul>
                  <li><strong>Login (Discord):</strong> clique no botão Discord no cabeçalho e autorize a conta.</li>
                  <li><strong>Whitelist:</strong> se sua conta não estiver autorizada, peça inclusão — seu ID do Discord precisa constar na lista gerenciada pelo admin.</li>
              </ul>
              <h4 className="font-semibold text-white mt-4">Problemas comuns & solução imediata:</h4>
              <ul>
                  <li><strong>Erro ao logar:</strong> limpe cache / tente em aba anônima.</li>
                  <li><strong>Ainda não está na whitelist?</strong> Copie este texto e envie ao admin:</li>
              </ul>
              <div className="bg-gray-900/50 p-3 rounded-md text-xs font-mono my-2">
                  <p>Olá — preciso de acesso à Kimetsu Forge.<br/>
                  Meu Discord ID: &lt;seu-id-aqui&gt;<br/>
                  Uso: criar itens/arte para campanha X.<br/>
                  Obrigado!</p>
              </div>
              <p className="text-xs text-indigo-300 italic mt-2"><strong>Dica de imersão:</strong> mantenha o mesmo Discord usado para a comunidade — facilita suporte e histórico.</p>
          </Section>

          <Section title="2) Forja — Criando Conteúdo de RPG" icon={<AnvilIcon className="w-5 h-5" />}>
              <p>A Forja é o seu ateliê: armas, inimigos, NPCs, quests, itens mágicos.</p>
              <h4 className="font-semibold text-white mt-4">Passos rápidos</h4>
              <ol className="list-decimal pl-5">
                <li>Escolha a <strong>Categoria</strong> — por exemplo: Arma, Inimigo/Oni, Missão.</li>
                <li>Preencha <strong>Filtros</strong> — raridade, origem (país/clã), materiais (obsidiana, aço nichirin), temática.</li>
                <li>Insira <strong>Diretrizes</strong> — selecione qual IA priorizará Lore, Mecânica, ou Narrativa (DeepSeek → ideia; Gemini → estrutura; GPT → polimento).</li>
                <li>Aperfeiçoe com <strong>Referências de Estilo</strong> e <strong>Modificador de Prompt</strong>.</li>
                <li><strong>Gerar</strong> — confirme e veja os resultados na vitrine.</li>
              </ol>
              
              <h4 className="font-semibold text-white mt-4">Campos explicados (o que preencher para melhores resultados)</h4>
              <ul>
                  <li><strong>Categoria:</strong> define o template de filtros.</li>
                  <li><strong>Filtros Específicos:</strong> preencha com dados objetivos — ex.: Espada curta, Raridade: Lendária, Estilo: Feudal Japonês, Atributo: +FireDamage. Quanto mais concreto, melhor.</li>
                  <li><strong>Diretrizes da Forja:</strong> escolha se quer priorizar Lore (história), Mecânicas (stats) ou Polimento (texto final).</li>
                  <li><strong>Referências de Estilo:</strong> nomes de obras/artistas para guiar o tom visual (Ex.: Demon Slayer, Yoshitaka Amano).</li>
                  <li><strong>Modificador de Prompt:</strong> comando de alta prioridade — use para instruções curtas e fortes (Ex.: “Tom épico, linguagem poética, evitar tecnologia moderna”).</li>
              </ul>

              <h4 className="font-semibold text-white mt-4">Exemplos práticos (copiar/colar)</h4>
              <div className="bg-gray-900/50 p-3 rounded-md text-xs font-mono my-2 space-y-2">
                <p><strong>Arma (exemplo):</strong><br/>
                Categoria: Arma | Filtros: espada katana, material: aço nichirin, raridade: lendária, origem: Montanhas de Uta | Referência: Demon Slayer, Yoshitaka Amano | Modificador: "faíscas azuis ao cortar a noite."</p>
                <p><strong>Inimigo (exemplo):</strong><br/>
                Categoria: Inimigo | Filtros: Oni ancestral, fraqueza: luz do sol, habilidade: metamorfose, tema: tragédia | Diretriz: priorizar lore</p>
              </div>
          </Section>
          
          <Section title="3) Processo em 3 etapas" icon={<SparklesIcon className="w-5 h-5 text-indigo-400" />}>
            <p>O que cada IA faz:</p>
            <ul>
                <li><strong>Etapa 1 — Conceito (DeepSeek):</strong> extrai a ideia bruta — personalidade, lore, imagem mental.</li>
                <li><strong>Etapa 2 — Estrutura (Gemini):</strong> transforma o conceito em estrutura jogável: atributos, habilidades, loot.</li>
                <li><strong>Etapa 3 — Polimento (GPT):</strong> refina o texto final — descrição pronta para ficha/NPC/loja.</li>
            </ul>
            <p className="text-xs text-indigo-300 italic mt-2"><strong>Como guiar:</strong> defina na Diretriz qual etapa deve receber prioridade criativa (ex.: “foco em mecânicas” → Gemini vai detalhar stats).</p>
          </Section>

          <Section title="4) Alquimia — Destilando Prompts" icon={<MagicWandIcon className="w-5 h-5 text-purple-400" />}>
              <p>A Alquimia pega sua ideia e gera 3 prompts otimizados — um para cada modelo (Midjourney, DALL·E, Gemini).</p>
              <h4 className="font-semibold text-white mt-4">Como usar</h4>
              <ol className="list-decimal pl-5">
                  <li><strong>Caldeirão:</strong> escreva a ideia base (ex.: "caçador de demônios com armadura samurai de obsidiana").</li>
                  <li><strong>Prompt negativo (opcional):</strong> itens a evitar (baixa resolução, mãos deformadas, texto).</li>
                  <li><strong>Escolha parâmetros por modelo:</strong> Estilo, Iluminação, Paleta, Composição, Aspect Ratio (--ar) e outras flags (--niji, --v 5 etc).</li>
                  <li><strong>Destilar:</strong> clique em Destilar Prompts e receba 3 prompts otimizados.</li>
              </ol>
              
              <h4 className="font-semibold text-white mt-4">Parâmetros recomendados (padrão)</h4>
              <ul>
                  <li><strong>Midjourney:</strong> Estilo: Anime/Mangá | Iluminação: Cinemática | Aspect Ratio: 16:9 | Nível: High</li>
                  <li><strong>DALL·E / GPT-estruturado:</strong> Tom: Cinemático | Estilo de Arte: Arte Conceitual | Ângulo: Dinâmico</li>
                  <li><strong>Gemini (imagem narrativa):</strong> Estilo: Anime/Mangá | Paleta: Vibrante | Detalhe: Detalhado</li>
              </ul>
          </Section>

          <Section title="5) Boas Práticas" icon={<HammerIcon className="w-5 h-5" />}>
             <ul className="list-disc pl-5">
                <li><strong>Seja específico:</strong> materiais, cores, época, expressões, emoções.</li>
                <li><strong>Use referências:</strong> animes, artistas, jogos — mas combine com termos técnicos (ex.: “ângulo baixo, golden hour, bokeh”).</li>
                <li><strong>Prompt negativo</strong> ajuda a evitar erros recorrentes (mãos estranhas, texto na imagem).</li>
                <li><strong>Salve presets:</strong> se curtir um estilo, salve para repetir com tweaks rápidos.</li>
                <li><strong>Itere:</strong> faça pequenas variações em vez de trocar tudo de uma vez.</li>
             </ul>
          </Section>

          <Section title="6) Erros Comuns & Soluções" icon={<AlertTriangleIcon className="w-5 h-5 text-yellow-400"/>}>
            <ul className="list-disc pl-5">
                <li><strong>“O resultado ficou genérico”</strong> → aumente especificidade e referências; use o Modificador para impor tom.</li>
                <li><strong>“Imagem com artefatos (mãos, dedos)”</strong> → adicionar no negativo: “sem deformidades nas mãos, sem texto”.</li>
                <li><strong>“Não estou autorizado”</strong> → confirmar Discord ID e enviar solicitação ao admin (veja modelo acima).</li>
                <li><strong>“Prompt ficou curto”</strong> → use o polimento de GPT para expandir descrição.</li>
            </ul>
          </Section>
          
          <Section title="7) Checklist Rápido" icon={<TagIcon className="w-5 h-5" />}>
            <ul className="list-disc pl-5">
                <li>Estou logado com minha conta Discord correta</li>
                <li>Categoria selecionada</li>
                <li>Filtros preenchidos (especialmente raridade e material)</li>
                <li>Referência(s) de estilo adicionada(s)</li>
                <li>Modificador de Prompt, se quiser forçar tom</li>
                <li>Prompt negativo (para imagens) definido</li>
            </ul>
          </Section>

          <Section title="FAQ" icon={<HelpIcon className="w-5 h-5" />}>
            <div className="space-y-3">
                <div>
                    <p className="font-semibold text-white">Posso usar referências de outros animes?</p>
                    <p className="text-gray-400">Sim — use com descrição para evitar confusão de estilo.</p>
                </div>
                <div>
                    <p className="font-semibold text-white">Consigo exportar o prompt gerado?</p>
                    <p className="text-gray-400">Sim — botão Copiar Prompt na vitrine.</p>
                </div>
                <div>
                    <p className="font-semibold text-white">Tem limite de gerações?</p>
                    <p className="text-gray-400">Consulte seu plano; mensagens de erro indicarão o motivo.</p>
                </div>
            </div>
          </Section>

          <div className="text-center mt-10 pt-6 border-t border-gray-700">
              <p className="text-lg text-indigo-300 font-semibold italic">"Você já tem ideia — a Forja só precisa de direção. Use especificidade + referências + iteração e as IAs fazem o resto. Vamos transformar essa espada conceitual numa lenda de jogo. ⚔️✨"</p>
          </div>
      </div>
    </Modal>
  );
};
