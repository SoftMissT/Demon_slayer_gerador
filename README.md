# Forjador de ideias kimetsu no yaiba - Vercel Edition

This is a refactored version of the "Forjador de ideias kimetsu no yaiba" generator, designed to be deployed on Vercel or any Node.js hosting environment.

The original application ran the Gemini API SDK directly in the browser, which is not secure for production use as it exposes the API key. This version moves all Gemini API calls to server-side API routes, ensuring your API key remains private.

## Setup and Deployment

### 1. Environment Variable

To use the application, you need a Gemini API key.

- **Local Development:**
  1. Create a file named `.env.local` in the root of the project.
  2. Add your API key to this file:
     ```
     API_KEY=YOUR_API_KEY_HERE
     ```

- **Vercel Deployment:**
  1. Fork this repository and import it into your Vercel account.
  2. In your Vercel project settings, go to the **Environment Variables** section.
  3. Add a new environment variable:
     - **Name:** `API_KEY`
     - **Value:** `YOUR_API_KEY_HERE`
  4. Redeploy your project for the changes to take effect.

### 2. Running Locally

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Building for Production

To verify the build and check for TypeScript errors, you can run the production build command locally. This is the same command Vercel uses for deployment.

```bash
npm run build
```

## Technical Changes

- **Framework:** The application is now a Next.js project.
- **API Calls:** All communication with the Gemini API is handled by two serverless functions located in `pages/api/`:
  - `pages/api/generateContent.ts`: Handles text and structured JSON generation.
  - `pages/api/generateImage.ts`: Handles image generation.
- **Security:** The `API_KEY` is only accessed on the server-side, never exposed to the client browser.
- **Frontend:** The frontend now uses `fetch` to call the internal API routes, which then securely call the Gemini API.