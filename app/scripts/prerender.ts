import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { JSDOM } from 'jsdom'

const outputDirectory = join(import.meta.dir, '..', 'dist')
const shell = await readFile(join(outputDirectory, 'index.html'), 'utf8')

const routes = [
    {
        outputPath: 'about/index.html',
        title: 'About | Depth of Field Calculator & Comparison Tool for Camera Lenses',
        description: 'Learn how depth of field works and how to compare camera lenses with the calculator.',
        canonical: 'https://patik.com/dof/about/',
        robots: null,
        content: `<main><h1>Depth of Field Calculator &amp; Lens Comparison Tool</h1><h2>What is depth of field?</h2><p>Depth of field is the area between the foreground and background where objects are in acceptably sharp focus.</p><h2>Using the calculator</h2><p>Compare focal length, aperture, sensor size, and subject distance for multiple lenses.</p></main>`,
    },
    {
        outputPath: 'software/index.html',
        title: 'Software: Node.js Package | Depth of Field Calculator & Comparison Tool for Camera Lenses',
        description: 'Use the dof JavaScript package to calculate depth of field for camera lenses.',
        canonical: 'https://patik.com/dof/software/',
        robots: null,
        content: `<main><h1>Depth of Field Calculator</h1><h2>Node module</h2><p>Install the dof package and calculate depth of field from focal length, aperture, crop factor, and subject distance.</p><h2>Web app</h2><p>Compare multiple camera lenses side by side.</p></main>`,
    },
    {
        outputPath: '404.html',
        title: 'Page not found | Depth of Field Calculator & Comparison Tool for Camera Lenses',
        description: 'The requested depth of field calculator page could not be found.',
        canonical: null,
        robots: 'noindex',
        content: `<main><h1>Page not found</h1><p>The requested page could not be found. <a href="https://patik.com/dof/">Return to the depth of field calculator</a>.</p></main>`,
    },
]

for (const route of routes) {
    const dom = new JSDOM(shell)
    const { document } = dom.window
    const description = document.querySelector('meta[name="description"]')
    const canonical = document.querySelector('link[rel="canonical"]')
    const root = document.getElementById('root')

    if (!description || !canonical || !root) {
        throw new Error('Built app shell is missing required metadata, canonical link, or root element')
    }

    document.title = route.title
    description.setAttribute('content', route.description)
    if (route.canonical) {
        canonical.setAttribute('href', route.canonical)
    } else {
        canonical.remove()
    }
    if (route.robots) {
        const robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        robots.setAttribute('content', route.robots)
        document.head.append(robots)
    }
    root.innerHTML = route.content

    const html = `<!doctype html>\n${document.documentElement.outerHTML}\n`
    const filePath = join(outputDirectory, route.outputPath)

    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, html)
    dom.window.close()
}
