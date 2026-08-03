import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dofSource = fileURLToPath(new URL('./package/src/index.ts', import.meta.url))

export default defineConfig({
    resolve: {
        alias: {
            dof: dofSource,
        },
    },
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
