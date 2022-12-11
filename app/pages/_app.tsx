import '@fontsource/open-sans'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width,initial-scale=1,minimal-ui,viewport-fit=cover" />
                <title>Depth of Field Calculator &amp; Comparison Tool for Camera Lenses</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}
