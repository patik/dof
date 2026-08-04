import { createFileRoute } from '@tanstack/react-router'
import Layout from '../layout/Layout'
import Main from '../ui/Main'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
    return (
        <Layout hasPermalink>
            <Main />
        </Layout>
    )
}
