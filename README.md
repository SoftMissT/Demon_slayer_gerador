# 🛠️ Kimetsu Forge — Forja de Lendas / Legend Forge

**PT-BR / EN — Readme bilíngue**

---

## 🇧🇷 Português

### Sobre
**Kimetsu Forge** é uma ferramenta fan-made para mestres e jogadores de RPG de mesa inspirada na estética sombria e épica de animes como *Demon Slayer*. Ela ajuda a gerar itens, inimigos, técnicas, NPCs, quests e prompts de imagem usando uma orquestração de IAs.

> Ferramenta feita por fãs, para fãs — focada em acelerar o fluxo criativo na criação de conteúdo de RPG.

### Principais features
- Geração de armas, demônios, técnicas de respiração, NPCs e ganchos de história.  
- Produção de descrições prontas para ficha e prompts de imagem otimizados (Midjourney, DALL·E, etc.).  
- Pipeline em 3 etapas: **Conceito → Estrutura → Polimento** (DeepSeek → Gemini → GPT).  
- Presets, filtros e parâmetros para controlar estilo, raridade e mecânicas.

### Aviso Legal (importante)
Este projeto é **não oficial** e **sem fins lucrativos**, criado em homenagem à obra de Koyoharu Gotouge. *Demon Slayer (Kimetsu no Yaiba)* é propriedade dos respectivos detentores de copyright. O conteúdo gerado é fictício e destinado apenas a uso pessoal/entretenimento em campanhas de RPG.

### Tecnologias
- Frontend: Next.js / React  
- Estilização: Tailwind CSS (configurável)  
- IA / Orquestração: DeepSeek, Google Gemini, OpenAI (GPT)  
- Autenticação: Discord OAuth2  
- Whitelist: Google Sheets (via Service Account)  

---

### Começando (desenvolvimento local)

#### Requisitos
- Node.js v18+  
- Git

#### 1. Clone
```bash
git clone https://github.com/SoftMissT/Demon_slayer_gerador.git
cd Demon_slayer_gerador
```

#### 2. Instale dependências
```bash
npm install
```

#### 3. Variáveis de ambiente

Crie um arquivo `.env.local` (NUNCA commite este arquivo). 

**Importante:** não coloque chaves/IDs sensíveis no README público nem em commits. Use variáveis de ambiente e/ou o secret manager do seu host (Vercel, Netlify, etc).

Um arquivo `.env.example` pode ser criado para referência, com placeholders.

```env
# Discord OAuth2 (obtenha no portal de desenvolvedores Discord)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000

# Google Sheets (whitelist)
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Chaves das APIs de IA (cole no ambiente, não no repositório)
DEV_GEMINI_KEY=your_gemini_api_key
DEV_OPENAI_KEY=your_openai_api_key
DEV_DEEPSEEK_KEY=your_deepseek_api_key
```

⚠️ **Segurança:** Nunca exponha `GOOGLE_PRIVATE_KEY`, `DISCORD_CLIENT_SECRET`, `DEV_OPENAI_KEY`, etc. no repositório público. Use variáveis de ambiente no host ou secret manager.

#### 4. Rodar em dev
```bash
npm run dev
```
Abra http://localhost:3000

### Configuração (resumo)

- **Discord OAuth2:** Registre um App no portal do Discord, configure Redirect URI(s) (ex.: `http://localhost:3000`) e adicione `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` ao `.env.local`.

- **Whitelist (Google Sheets):** Crie uma planilha, adicione uma aba chamada `discord_id` com IDs autorizados na coluna B. Crie uma Service Account no Google Cloud, gere a chave JSON e compartilhe a planilha com o `client_email` da Service Account (com permissão de leitura). Configure `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` e `GOOGLE_PRIVATE_KEY`.

- **Chaves das IAs:** obtenha as chaves nas plataformas correspondentes e configure via env.

### Deploy

Recomendado: Vercel / Netlify.

- Configure as mesmas variáveis de ambiente no painel do provedor (não commit).
- Atualize a `DISCORD_REDIRECT_URI` para a URL de produção.

### Contribuição

Quer ajudar? Abra issues e PRs. Mantenha commits pequenos e documentados. Use o padrão de branches: `feature/x`, `fix/x`.

### Créditos & Licença

- **Criadores:** SoftMissT & Mathzin
- **Colaboradores:** ZeratulBr, Cardhial, VK, Dan, Akira

Este projeto é fan-made. Consulte a licença no repositório (MIT recomendado se quiser abrir contribuição).

---
## 🇺🇸 English

### About

**Kimetsu Forge** is a fan-made creative tool for tabletop RPG GMs and players, inspired by the dark and epic aesthetic of animes like *Demon Slayer*. It helps generate items, enemies, techniques, NPCs, quests, and image prompts using an AI orchestration pipeline.

> A tool made by fans, for fans—focused on speeding up the creative workflow for RPG content creation.

### Key features

- Generate weapons, demons, breathing techniques, NPCs, and story hooks.
- Produce ready-to-use descriptions and optimized image prompts (Midjourney, DALL·E, etc.).
- 3-step pipeline: **Concept → Structure → Polish** (DeepSeek → Gemini → GPT).
- Presets, filters, and parameters to control style, rarity, and mechanics.

### Legal Notice (Important)
This is an **unofficial**, **non-commercial** fan project created in homage to the original work. *Demon Slayer (Kimetsu no Yaiba)* and its IP belong to their respective copyright holders. Generated content is fictional and intended for personal/entertainment use in RPGs only.

### Tech stack

- **Frontend:** Next.js / React
- **Styling:** Tailwind CSS
- **AI Orchestration:** DeepSeek, Google Gemini, OpenAI (GPT)
- **Auth:** Discord OAuth2
- **Whitelist:** Google Sheets (via Service Account)

---

### Getting Started (Local Development)

#### Prerequisites
- Node.js v18+
- Git

#### 1. Clone
```bash
git clone https://github.com/YOUR_USER/YOUR_REPO.git
cd YOUR_REPO
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Variables

Create a `.env.local` file (NEVER commit this file). Use the following as a template.

**Important:** Do not commit sensitive keys/IDs to the public repository. Use environment variables and/or your host's secret manager (Vercel, Netlify, etc.).

```env
# Discord OAuth2 (get from Discord Developer Portal)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000

# Google Sheets (for whitelist)
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# AI API Keys (set in environment, not in the repository)
DEV_GEMINI_KEY=your_gemini_api_key
DEV_OPENAI_KEY=your_openai_api_key
DEV_DEEPSEEK_KEY=your_deepseek_api_key
```

⚠️ **Security:** Never expose `GOOGLE_PRIVATE_KEY`, `DISCORD_CLIENT_SECRET`, `DEV_OPENAI_KEY`, etc., in the public repository. Use your host's environment variables or secret manager.

#### 4. Run in Development
```bash
npm run dev
```
Open http://localhost:3000

### Setup Summary

- **Discord OAuth2:** Register an app in the Discord Developer Portal, configure Redirect URI(s) (e.g., `http://localhost:3000`), and add `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` to `.env.local`.
- **Whitelist (Google Sheets):** Create a spreadsheet, add a sheet named `discord_id` with authorized user IDs in column B. Create a Service Account in Google Cloud, generate the JSON key, and share the sheet with the Service Account's `client_email` (with viewer permissions). Configure `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`.
- **AI Keys:** Obtain keys from the respective platforms and set them in your environment.

### Deployment

- **Recommended:** Vercel / Netlify.
- Configure the same environment variables in your provider's dashboard (do not commit them).
- Update `DISCORD_REDIRECT_URI` to your production URL.

### Contributing

Want to help? Open issues and PRs. Keep commits small and documented. Use the branch naming convention: `feature/x`, `fix/x`.

### Credits & License

- **Authors:** SoftMissT & Mathzin
- **Contributors:** ZeratulBr, Cardhial, VK, Dan, Akira

This is a fan-made project. Please refer to the license file in the repository (MIT is recommended for open contributions).

---
### ⚠️ IMPORTANT — Security / Privacy (READ)

- **NEVER** publish API keys, `GOOGLE_PRIVATE_KEY`, `DISCORD_CLIENT_SECRET`, or your personal Discord ID/username in the public repository.
- Use `.gitignore` to protect `.env.local`.
- Prefer using your hosting provider's Secret Manager (Vercel/Netlify/GCP) for production variables.
