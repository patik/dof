import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: process.env.IS_DEPLOYMENT ? '/dof/' : '/',
    optimizeDeps: {
        include: ['dof'],
    },
    plugins: [
        tanstackRouter({ target: 'react', autoCodeSplitting: true }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'script-defer',
            includeAssets: ['favicon.ico', 'aperture-icon.svg', 'pwa-192.png', 'pwa-512.png'],
            manifest: {
                name: 'Depth of Field Calculator',
                short_name: 'Depth of Field',
                description: 'Compare depth of field across camera lenses and subject distances.',
                theme_color: '#171512',
                background_color: '#f6f1e8',
                display: 'standalone',
                start_url: '.',
                scope: '.',
                icons: [
                    {
                        src: 'pwa-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                cleanupOutdatedCaches: true,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                navigateFallback: 'index.html',
            },
        }),
    ],
})
