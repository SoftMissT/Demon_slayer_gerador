# 🛠️ Kimetsu Forge (Forja de Lendas)

Kimetsu Forge é uma ferramenta criativa feita de fã para fã, voltada para mestres e jogadores de RPG de mesa, com inspiração no universo sombrio e emocionante de Demon Slayer (Kimetsu no Yaiba).
Ela auxilia na geração de armas, inimigos, formas de respiração, NPCs e cenários inteiros usando uma orquestração de IAs generativas.

## ✨ Features
- Geração de elementos de RPG como armas, demônios, técnicas de respiração e ganchos de história.
- Criação de descrições detalhadas e prontas para uso em prompts de imagem, otimizadas para plataformas como Midjourney e DALL·E.
- Aceleração do processo de criação de histórias com conteúdo gerado por uma colaboração de IAs.

## 🔐 Acesso via Discord & Whitelist
O acesso ao Kimetsu Forge é gerenciado através da autenticação com o Discord. Para utilizar as funcionalidades, os usuários devem entrar com sua conta e ter seu ID do Discord na lista de acesso (whitelist) gerenciada pelo administrador.

### Configuração da Whitelist (Google Sheets)

A whitelist de usuários é lida a partir de uma planilha do Google Sheets. Para configurar, siga os passos:

1.  **Crie uma Conta de Serviço no Google Cloud:**
    *   Acesse o [Google Cloud Console](https://console.cloud.google.com/), crie um novo projeto e ative a **API do Google Sheets**.
    *   Vá para **IAM e Admin > Contas de Serviço**, crie uma nova conta.
    *   Dentro da conta de serviço, vá para a aba **Chaves**, clique em **Adicionar Chave > Criar nova chave**, selecione **JSON** e faça o download.

2.  **Configure sua Planilha:**
    *   Crie uma nova planilha no Google Sheets.
    *   Renomeie a primeira aba (página) para `discord_id`.
    *   Na coluna `A`, coloque os nicks dos usuários (opcional). Na coluna `B`, coloque os **IDs do Discord** dos usuários autorizados.
    *   Clique em **Compartilhar** e adicione o `client_email` (do arquivo JSON baixado) como **Leitor**.

3.  **Adicione as Variáveis de Ambiente:**
    *   Crie um arquivo `.env.local` na raiz do seu projeto.
    *   Adicione as seguintes variáveis, preenchendo com os dados do seu arquivo JSON e da URL da planilha:

    ```env
    # Credenciais da API do Google para a Whitelist
    GOOGLE_SHEET_ID="ID_DA_SUA_PLANILHA_AQUI"
    GOOGLE_SERVICE_ACCOUNT_EMAIL="client_email_do_seu_json@..."
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"

    # ... outras chaves de API
    ```
    *   **`GOOGLE_SHEET_ID`**: Encontrado na URL da sua planilha (`.../spreadsheets/d/`**`[ESTE_É_O_ID]`**`/edit`).
    *   **`GOOGLE_PRIVATE_KEY`**: Copie o valor da `private_key` do arquivo JSON. **Importante:** Mantenha as quebras de linha (`\n`) dentro de aspas duplas, como no exemplo, para garantir o funcionamento correto.

## 🧠 Como Funciona: A Orquestração de IAs
O Kimetsu Forge utiliza um fluxo de três etapas que para garantir resultados ricos e detalhados:

1.  **DeepSeek (O Conceitualizador):** A primeira IA gera a ideia base, o conceito bruto e fundamental do item, personagem ou técnica solicitada.
2.  **Google Gemini (O Arquiteto):** Em seguida, o Gemini recebe esse conceito e o enriquece, adicionando lore, estrutura, detalhes mecânicos para RPG e um prototipo de descrição visual.
3.  **OpenAI GPT-4o (O Artista Final):** Por fim, o modelo da OpenAI realiza o polimento final, aprimorando a narrativa para um tom de roleplay mais forte e refinando a descrição visual para que ela se torne um prompt de imagem pronto para ser usado.

## 🚀 Como Começar (Guia de Instalação)

Siga estes passos para executar o Kimetsu Forge em sua máquina local.

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)

### 2. Clone o Repositório
Abra seu terminal e execute o seguinte comando:
```bash
git clone https://github.com/SoftMissT/Demon_slayer_gerador.git
cd Demon_slayer_gerador
```

### 3. Instale as Dependências
Use o npm para instalar todos os pacotes necessários:
```bash
npm install
```

### 4. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e adicione as chaves de API conforme as instruções na seção "Configuração da Whitelist".

### 5. Execute o Servidor de Desenvolvimento
Com tudo configurado, inicie a aplicação:
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver o resultado.

## 🧩 Tecnologias
- **Orquestração de IAs:** DeepSeek, Google Gemini e OpenAI (GPT-4o).
- **Frontend:** Next.js & React para uma arquitetura moderna e de alta performance.
- **Estilização:** Tailwind CSS para um design rápido, responsivo e customizável.
- **Whitelist:** Google Sheets API.

## ❤️ Apoie a Obra Original
Kimetsu Forge é um projeto de fã, feito com carinho para a comunidade. A melhor forma de apoiar é consumindo a obra original de Koyoharu Gotouge.
- **Leia o Mangá:** [Compre na Panini Comics Brasil](https://panini.com.br/catalogsearch/result/index/referer/aHR0cHM6Ly9wYW5pbmkuY29tLmJyL2NhdGFsb2dzZWFyY2gvcmVzdWx0Lz9xPURlbW9uK1NsYXllcg~~/?collection=DEMON+SLAYER+-+KIMETSU+NO+YAIBA&q=Demon+Slayer)
- **Assista ao Anime:** [Disponível na Crunchyroll](https://www.crunchyroll.com/pt-br/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba)

## ⚠️ Aviso Legal
Este é um projeto de fã não oficial, criado em homenagem à incrível obra de Koyoharu Gotouge, apenas para fins educacionais e de entretenimento.
Demon Slayer: Kimetsu no Yaiba é uma propriedade de Koyoharu Gotouge, Shueisha e Ufotable.
Todos os direitos do universo original e dos personagens pertencem aos seus respectivos proprietários.

## 👥 Créditos
- **Criadores:** SoftMisst & Mathzin
- **Colaboradores:** ZeratulBr, Cardhial, VK, Dan, Akira

## 💬 Sobre Este Projeto
O Kimetsu Forge foi projetado para auxiliar Mestres de Jogo, acelerando a geração de ideias e a construção de mundos.
O conteúdo gerado é fictício e deve ser personalizado para se adequar à história ou ao estilo de campanha de cada jogador.