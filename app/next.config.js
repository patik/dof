/* eslint-disable @typescript-eslint/no-var-requires */
const mdx = require('@next/mdx')
const { config } = require('./package.json')

const withMDX = mdx({
    extension: /\.mdx?$/,
})

const { basePath } = config

/** @type {import('next').NextConfig} */
module.exports = withMDX({
    reactStrictMode: true,
    swcMinify: true,
    basePath: process.env.IS_DEPLOYMENT ? basePath : undefined,
    output: 'export',
    // Add markdown extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
        unoptimized: true,
    },

    // Needed for @nivo@0.83.0
    transpilePackages: ['@nivo'],

    experimental: {
        // Needed for @nivo@0.83.0
        esmExternals: 'loose',
    },
})
