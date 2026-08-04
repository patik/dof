import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: 'src/index.ts',
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    outDir: 'dist',
    clean: true,
    dts: true,
    sourcemap: true,
    fixedExtension: false,
})
