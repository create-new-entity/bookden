import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    /* 
        Vite does load .env.* files at build time.
        They become available inside app code like import.meta.env.* and so on.
        
        But, Vite does not automatically load .env.* inside vite.config.ts using process.env.*
        So used loadEnv() to load the environment variables here.
    */
    const env = loadEnv(mode, process.cwd(), '');
    return {
        base: mode === 'production'
            ? env.VITE_BASE_PATH
            : '/',
        plugins: [react()],
        test: {
            environment: 'jsdom',
            setupFiles: './src/setupTests.ts',
            globals: true
        } as InlineConfig
    } as UserConfig;
});
