import { Box, Typography, BoxProps } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { Layout } from '../src/layout/Layout'
import comparisonImg from '../public/images/comparison.png'
import detailsImg from '../public/images/details.png'
import lensNameImg from '../public/images/lens-name.png'
import screenshotImg from '../public/images/screenshot-v0.0.3.png'
import sharingImg from '../public/images/sharing.png'
import singleLensImg from '../public/images/single-lens.png'

function Figure({ narrow, children, ...props }: PropsWithChildren & BoxProps & { narrow?: boolean }) {
    return (
        <Box component="figure" maxWidth={narrow ? '300px' : undefined} {...props}>
            {children}
        </Box>
    )
}

export default function About() {
    return (
        <Layout title="About">
            <Box mb={3}>
                <Typography variant="h2" id="calculate" gutterBottom>
                    Calculate depth of field
                </Typography>
                <Typography>
                    For a given lens, enter the focal length, aperture, the distance to your subject, and the camera’s
                    sensor size. The length of the depth of field is displayed below the fields and updates as you
                    change the values.
                </Typography>
                <Figure narrow sx={{ position: 'relative' }}>
                    <Image src={singleLensImg} height={250} alt="Screenshot of lens input" />
                </Figure>
                <Typography>
                    Be sure to use the <strong>actual focal length</strong> of the lens (e.g. as printed on the front of
                    the lens)&mdash;don’t convert it to the 35mm equivalent.
                </Typography>
                <Typography>Feel free to give each lens a meaningful name to keep track of them.</Typography>
                <Figure narrow style={{ position: 'relative' }}>
                    <Image src={lensNameImg} height={250} alt="Renaming a lens" />
                </Figure>
                <Typography>The depth of field calculation can be expanded to view more related statistics:</Typography>
                <figure className="narrow" style={{ position: 'relative' }}>
                    <Image src={detailsImg} height={250} alt="Further details about a lens’ depth of field" />
                </figure>
            </Box>
            <Box mb={3}>
                <Typography variant="h2" id="compare" gutterBottom>
                    Comparing lenses
                </Typography>
                <Typography>
                    Click on the “Add Lens” box to add an additional lens, then enter the second lens’ characteristics.
                </Typography>
                <figure>
                    <Link href="images/comparison.png" target="_blank" style={{ position: 'relative' }}>
                        <Image src={comparisonImg} height={250} alt="comparison of two lenses" />
                    </Link>
                </figure>
                <Typography>
                    If the lenses are similar (i.e. same focal length) you may save time by using the Copy button to
                    carry over the same values to the second lens.
                </Typography>
                <Typography>You can add an unlimited number of lenses.</Typography>
                <figure>
                    <Link href="images/screenshot-v0.0.3.png" target="_blank" style={{ position: 'relative' }}>
                        <Image src={screenshotImg} height={500} alt="Chart comparing two lenses at various distances" />
                    </Link>
                </figure>
                <Typography>
                    You can also see how lenses compare at various distances from the subject. The graph will display
                    the length of the depth of field at 5-foot intervals until the length surpasses 200 feet.
                </Typography>
            </Box>
            <Box mb={3}>
                <Typography variant="h2" id="sharing" gutterBottom>
                    Saving and sharing
                </Typography>
                <Typography>
                    At any time you can copy the address from your browser and send it to a friend. They will see the
                    exact same lenses that you’ve entered.
                </Typography>
                <Typography>
                    You can also bookmark the page to come back to the same lens configuration later.
                </Typography>
                <figure>
                    <Link href="images/sharing.png" target="_blank" style={{ position: 'relative' }}>
                        <Image
                            src={sharingImg}
                            height={250}
                            alt="screenshot with the browser address bar highlighted"
                        />
                    </Link>
                </figure>
            </Box>
        </Layout>
    )
}
