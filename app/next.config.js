// eslint-disable-next-line @typescript-eslint/no-var-requires
const mdx = require('@next/mdx')

const withMDX = mdx({
    extension: /\.mdx?$/,
})

/** @type {import('next').NextConfig} */
module.exports = withMDX({
    reactStrictMode: true,
    swcMinify: true,
    // Append the default value with md extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})
