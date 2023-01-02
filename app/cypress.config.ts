import { defineConfig } from 'cypress'
// import { config } from './package.json'

export default defineConfig({
    projectId: 'oxu623',
    e2e: {
        setupNodeEvents(/* on, config */) {
            // implement node event listeners here
        },
        // baseUrl: `http://localhost:3000/${config.basePath}`,
        supportFile: false,
    },
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
