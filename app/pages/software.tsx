import Layout from '../src/layout/Layout'
import Readme from '../../README.md'
import React from 'react'
import { Typography } from '@mui/material'

export default function Software() {
    return (
        <Layout title="Software: Node.js Package" noMainHeading>
            <Typography component="div">
                <Readme />
            </Typography>
        </Layout>
    )
}
