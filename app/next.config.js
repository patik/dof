const { config } = require('./package.json')

const { basePath } = config

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    basePath: process.env.IS_DEPLOYMENT ? basePath : undefined,
    output: 'export',
    images: {
        unoptimized: true,
    },

    // Needed for @nivo@0.83.0
    transpilePackages: ['@nivo'],

    experimental: {
        // Needed for @nivo@0.83.0
        esmExternals: 'loose',
    },
}
