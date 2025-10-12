// This file provides mock type declarations to prevent build errors caused
// by the presence of a vite.config.ts file in a Next.js project.

declare module 'vite' {
  export function defineConfig(config: any): any;
  export function loadEnv(mode: string, envDir: string, prefixes?: string | string[]): Record<string, string>;
}

declare module '@vitejs/plugin-react' {
  const plugin: any;
  export default plugin;
}
