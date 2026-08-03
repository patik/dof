import { defineConfig, devices } from '@playwright/test'

const port = process.env.PLAYWRIGHT_PORT ?? '3000'
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    reporter: [['html', { open: 'never' }], ['list']],
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    webServer: {
        command: `bun run build && bun run --cwd app preview --host 127.0.0.1 --port ${port}`,
        cwd: '..',
        env: { PORT: port },
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
})
