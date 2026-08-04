import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        projects: [
            {
                extends: true,
                test: {
                    name: 'package',
                    root: './package',
                    environment: 'node',
                    include: ['src/**/*.test.ts'],
                },
            },
            {
                extends: true,
                test: {
                    name: 'app',
                    root: './app',
                    environment: 'jsdom',
                    include: ['src/**/*.test.{ts,tsx}'],
                },
            },
        ],
    },
})
