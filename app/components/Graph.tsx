import { useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { ResponsiveLine, Serie } from '@nivo/line'
import { Lens } from 'dof'
import { compact } from 'lodash'
import { useMemo } from 'react'
import { fullList } from './sensorList'

function getDistanceArray(units: Units, isMobile: boolean): Distance[] {
    if (units === 'imperial') {
        const allValues = Array.from(Array(101).keys())

        if (isMobile) {
            return allValues.filter((v) => v % 10 === 0)
        }

        return allValues.filter((v) => v % 5 === 0)
    }

    const allValues = Array.from(Array(26).keys())

    if (isMobile) {
        return allValues.filter((v) => v % 2 === 0)
    }

    return allValues
}

export function Graph({ lenses, units }: { lenses: LensInputs[]; units: Units }) {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
    const distances = useMemo(() => getDistanceArray(units, isMobile), [units, isMobile])
    const data: Serie[] = useMemo(
        () =>
            lenses.map((lens) => {
                const { focalLength, aperture, sensorKey, id } = lens
                const cropFactor: number = fullList[sensorKey].value
                const datum: Serie = {
                    id: lens.name,
                    data: compact(
                        distances.map((distance) => {
                            const { dof: dofLength } = new Lens({ focalLength, aperture, cropFactor, id }).dof(distance)

                            // The graph doesn't handle infinite values well
                            if (dofLength === Infinity) {
                                return
                            }

                            return {
                                x: distance,
                                y: dofLength,
                            }
                        })
                    ),
                }

                return datum
            }),
        [distances, lenses]
    )

    return (
        <ResponsiveLine
            data={data}
            colors={{ scheme: 'nivo' }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `Distance (${units === 'imperial' ? 'ft' : 'm'})`,
                legendOffset: 42,
                legendPosition: 'middle',
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `Depth of field length (${units === 'imperial' ? 'ft' : 'm'})`,
                legendOffset: -56,
                legendPosition: 'middle',
            }}
            pointSize={10}
            pointColor={{ theme: 'labels.text.fill' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            theme={{
                legends: {
                    title: {
                        text: {
                            fill: '#ffffff',
                        },
                    },
                },
                axis: {
                    legend: {
                        text: {
                            fill: '#ffffff',
                        },
                    },
                    ticks: {
                        text: {
                            fill: '#ffffff',
                        },
                    },
                },
                tooltip: {
                    container: {
                        background: '#000',
                    },
                },
            }}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 1,
                    symbolSize: 16,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .5)',
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    )
}
