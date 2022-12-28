import { Box, BoxProps, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import comparisonImg from '../public/images/comparison.png'
import detailsImg from '../public/images/details.png'
import Layout from '../src/layout/Layout'
// import lensNameImg from '../public/images/lens-name.png'
import screenshotImg from '../public/images/screenshot-v0.0.3.png'
import sharingImg from '../public/images/sharing.png'
import singleLensImg from '../public/images/single-lens.png'
import Tree_bud_at_f22 from '../public/images/Tree_bud_at_f22.jpg'
import Tree_bud_in_spring_f18 from '../public/images/Tree_bud_in_spring_f1.8.jpg'
import DOFShallowDepthofField from '../public/images/DOF-ShallowDepthofField.jpg'

function Figure({ narrow, children, ...props }: PropsWithChildren & BoxProps & { narrow?: boolean }) {
    return (
        <Box component="figure" maxWidth={narrow ? '300px' : undefined} {...props}>
            {children}
        </Box>
    )
}

function Space() {
    return <>{` `}</>
}

export default function About() {
    return (
        <Layout title="About">
            <Box mb={3}>
                <Typography variant="h2" gutterBottom>
                    What is depth of field?
                </Typography>
                <Typography gutterBottom>
                    The <a href="https://en.wikipedia.org/wiki/Depth_of_field">depth of field (DoF)</a> is the area of
                    an image&mdash;between the foreground and background&mdash;where objects are in acceptably sharp
                    focus. This is commonly used to affect a photo’s aesthetics, e.g. with
                    <Space />
                    <a href="https://en.wikipedia.org/wiki/Bokeh">bokeh</a>.
                </Typography>
                <Figure>
                    <Image
                        src={DOFShallowDepthofField}
                        width={997}
                        height={717}
                        sizes="100vw"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        alt="A page of text with the middle section in focus, and the foreground and background out of focus"
                    />
                    <figcaption>
                        <Typography>The clear part of this image represents the depth of field</Typography>
                        <Typography
                            variant="caption"
                            component="a"
                            href="https://en.wikipedia.org/wiki/File:DOF-ShallowDepthofField.jpg"
                        >
                            Image from Wikipedia
                        </Typography>
                    </figcaption>
                </Figure>
                <Typography gutterBottom>
                    Depth of field is affected by the camera’s sensor size, the lens’ aperture, and the lens’ focal
                    length (zoom). Larger sensors, longer focal lengths (being more zoomed in), and larger apertures
                    yield a smaller (shallower, tighter) depth of field.
                </Typography>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Figure>
                            <Image
                                src={Tree_bud_in_spring_f18}
                                height={427}
                                width={640}
                                sizes="100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                alt="A bud on a tree branch, taken at f/1.8"
                            />
                            <figcaption>
                                <Typography>Narrow (small) depth of field</Typography>
                                <Typography
                                    variant="caption"
                                    component="a"
                                    href="https://en.wikipedia.org/wiki/File:Tree_bud_in_spring_f1.8.jpg"
                                >
                                    Image from Wikipedia
                                </Typography>
                            </figcaption>
                        </Figure>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Figure>
                            <Image
                                src={Tree_bud_at_f22}
                                height={427}
                                width={640}
                                sizes="100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                alt="A bud on a tree branch, taken at f/22"
                            />
                            <figcaption>
                                <Typography>Deep (large) depth of field</Typography>
                                <Typography
                                    variant="caption"
                                    component="a"
                                    href="https://en.wikipedia.org/wiki/File:Tree_bud_at_f22.jpg"
                                >
                                    Image from Wikipedia
                                </Typography>
                            </figcaption>
                        </Figure>
                    </Grid>
                </Grid>
            </Box>
            <Box mb={3}>
                <Typography variant="h2" id="calculate" gutterBottom>
                    Using the calculator
                </Typography>
                <Typography>
                    For a given lens, enter the focal length, aperture, the distance to your subject, and the camera’s
                    sensor size. The length of the depth of field is displayed below the fields and updates as you
                    change the values.
                </Typography>
                <Figure narrow>
                    <Image src={singleLensImg} height={250} alt="Screenshot of lens input" />
                </Figure>
                <Typography>
                    Be sure to use the <strong>actual focal length</strong> of the lens (e.g. as printed on the front of
                    the lens)&mdash;don’t convert it to the 35mm equivalent.
                </Typography>
                <Typography>Feel free to give each lens a meaningful name to keep track of them.</Typography>
                <Figure narrow>{/* <Image src={lensNameImg} height={250} alt="Renaming a lens" /> */}</Figure>
                <Typography>The depth of field calculation can be expanded to view more related statistics:</Typography>
                <Figure narrow>
                    <Image src={detailsImg} height={250} alt="Further details about a lens’ depth of field" />
                </Figure>
            </Box>
            <Box mb={3}>
                <Typography variant="h2" id="compare" gutterBottom>
                    Comparing lenses
                </Typography>
                <Typography>
                    Click on the “Add Lens” box to add an additional lens, then enter the second lens’ characteristics.
                </Typography>
                <Figure>
                    <Link href="images/comparison.png" target="_blank">
                        <Image src={comparisonImg} height={250} alt="comparison of two lenses" />
                    </Link>
                </Figure>
                <Typography>
                    If the lenses are similar (i.e. same focal length) you may save time by using the Copy button to
                    carry over the same values to the second lens.
                </Typography>
                <Typography>You can add an unlimited number of lenses.</Typography>
                <Figure>
                    <Link href="images/screenshot-v0.0.3.png" target="_blank">
                        <Image src={screenshotImg} height={500} alt="Chart comparing two lenses at various distances" />
                    </Link>
                </Figure>
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
                <Figure>
                    <Link href="images/sharing.png" target="_blank">
                        <Image
                            src={sharingImg}
                            height={250}
                            alt="screenshot with the browser address bar highlighted"
                        />
                    </Link>
                </Figure>
            </Box>
        </Layout>
    )
}
