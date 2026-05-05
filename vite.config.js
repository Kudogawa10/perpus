import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const devPort = Number.parseInt(process.env.VITE_DEV_PORT || '5173', 10);

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],

    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },

    server: {
        host: process.env.VITE_DEV_HOST || '127.0.0.1',
        port: devPort,
        cors: false,
        watch: {
            usePolling: true,
            interval: 1000,
        },
        hmr: {
            host: process.env.VITE_HMR_HOST || 'localhost',
            port: devPort,
        },
    },
});
