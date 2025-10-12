# 🛠️ Kimetsu Forge (Forja de Lendas)

Kimetsu Forge é uma ferramenta criativa feita de fã para fã, voltada para mestres e jogadores de RPG de mesa, com inspiração no universo sombrio e emocionante de Demon Slayer (Kimetsu no Yaiba).
Ela auxilia na geração de armas, inimigos, formas de respiração, NPCs e cenários inteiros usando uma orquestração de IAs generativas.

## ✨ Features
- Geração de elementos de RPG como armas, demônios, técnicas de respiração e ganchos de história.
- Criação de descrições detalhadas e prontas para uso em prompts de imagem, otimizadas para plataformas como Midjourney e DALL·E.
- Aceleração do processo de criação de histórias com conteúdo gerado por uma colaboração de IAs.

## 🔑 Bring Your Own Key (BYOK)
Este projeto opera em um modelo "Traga Sua Própria Chave". **Você precisa fornecer suas próprias chaves de API** para os serviços de IA diretamente na interface da aplicação. Suas chaves são salvas localmente no seu navegador e nunca são enviadas para nosso servidor. Isso garante que suas chaves permaneçam seguras e que você tenha controle total sobre seu uso.

## 🧠 Como Funciona: A Orquestração de IAs
O Kimetsu Forge utiliza um fluxo de três etapas que roda diretamente no seu navegador para garantir resultados ricos e detalhados:

1.  **DeepSeek (O Conceitualizador):** A primeira IA gera a ideia base, o conceito bruto e fundamental do item, personagem ou técnica solicitada.
2.  **Google Gemini (O Arquiteto):** Em seguida, o Gemini recebe esse conceito e o enriquece, adicionando lore, estrutura, detalhes mecânicos para RPG e um protótipo de descrição visual.
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

### 4. Execute o Servidor de Desenvolvimento
Com tudo configurado, inicie a aplicação:
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver o resultado.

### 5. Configure suas Chaves de API
Ao abrir a aplicação, clique no botão **"Chaves de API"** no cabeçalho. Você precisará obter e inserir suas chaves para os seguintes serviços:
- **Google Gemini:** Obtenha sua chave no [Google AI Studio](https://aistudio.google.com/app/apikey).
- **OpenAI (GPT-4o):** Obtenha sua chave na [Plataforma OpenAI](https://platform.openai.com/api-keys).
- **DeepSeek:** Obtenha sua chave na [Plataforma DeepSeek](https://platform.deepseek.com/api_keys).

As chaves são salvas no `localStorage` do seu navegador e são necessárias para que a geração de conteúdo funcione.

### ⚡ Modo de Desenvolvedor (Opcional)
Para agilizar os testes, você pode configurar um bypass para a inserção de chaves com um sistema de "dois fatores" local.

1.  Crie um arquivo `.env.local` na raiz do projeto.
2.  Adicione suas chaves de API e uma frase secreta pessoal com os seguintes nomes de variáveis:

    ```
    # Chaves de API para carregamento automático
    NEXT_PUBLIC_DEV_GEMINI_KEY=sua_chave_gemini
    NEXT_PUBLIC_DEV_OPENAI_KEY=sua_chave_openai
    NEXT_PUBLIC_DEV_DEEPSEEK_KEY=sua_chave_deepseek

    # Senha para o segundo fator de autenticação local
    NEXT_PUBLIC_DEV_SECRET_PHRASE=sua_frase_super_secreta_aqui
    ```

3.  Na aplicação, abra o modal "Chaves de API" e digite `forge_master_key` no chat.
4.  O sistema pedirá a "frase secreta". Digite a frase que você definiu em `NEXT_PUBLIC_DEV_SECRET_PHRASE`. Isso carregará automaticamente as chaves do seu ambiente, permitindo o uso imediato.

## 🧩 Tecnologias
- **Orquestração de IAs:** DeepSeek, Google Gemini e OpenAI (GPT-4o).
- **Frontend:** Next.js & React para uma arquitetura moderna e de alta performance.
- **Estilização:** Tailwind CSS para um design rápido, responsivo e customizável.

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