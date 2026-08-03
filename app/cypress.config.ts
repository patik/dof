import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'oxu623',
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: false,
    },
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
