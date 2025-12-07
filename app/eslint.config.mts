import nextPlugin from '@next/eslint-plugin-next'
import cypressPlugin from 'eslint-plugin-cypress'
import typescriptParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'

export default [
    {
        ignores: ['**/node_modules/**', '**/.next/**', '**/out/**', '**/build/**', '**/dist/**', '**/coverage/**'],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },
    {
        files: ['cypress/**/*.ts', 'cypress/**/*.js'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                cy: 'readonly',
                Cypress: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                before: 'readonly',
                after: 'readonly',
            },
        },
        plugins: {
            cypress: cypressPlugin,
        },
        rules: {
            ...cypressPlugin.configs.recommended.rules,
        },
    },
] satisfies Linter.Config[]
