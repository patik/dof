import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const outputDirectory = join(import.meta.dir, '..', 'dist')
const shell = await readFile(join(outputDirectory, 'index.html'), 'utf8')

const routes = [
    {
        path: 'about',
        title: 'About | Depth of Field Calculator & Comparison Tool for Camera Lenses',
        description: 'Learn how depth of field works and how to compare camera lenses with the calculator.',
        content: `<main><h1>Depth of Field Calculator &amp; Lens Comparison Tool</h1><h2>What is depth of field?</h2><p>Depth of field is the area between the foreground and background where objects are in acceptably sharp focus.</p><h2>Using the calculator</h2><p>Compare focal length, aperture, sensor size, and subject distance for multiple lenses.</p></main>`,
    },
    {
        path: 'software',
        title: 'Software: Node.js Package | Depth of Field Calculator & Comparison Tool for Camera Lenses',
        description: 'Use the dof JavaScript package to calculate depth of field for camera lenses.',
        content: `<main><h1>Depth of Field Calculator</h1><h2>Node module</h2><p>Install the dof package and calculate depth of field from focal length, aperture, crop factor, and subject distance.</p><h2>Web app</h2><p>Compare multiple camera lenses side by side.</p></main>`,
    },
]

for (const route of routes) {
    const html = shell
        .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
        .replace(
            /<meta name="description" content="[^"]*" \/>/,
            `<meta name="description" content="${route.description}" />`,
        )
        .replace(/<div id="root">[\s\S]*?<\/div>\s*<script/, `<div id="root">${route.content}</div>\n        <script`)
    const directory = join(outputDirectory, route.path)

    await mkdir(directory, { recursive: true })
    await writeFile(join(directory, 'index.html'), html)
}
