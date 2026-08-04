import { useLayoutEffect, useRef, useState } from 'react'

export default function useResizeObserver<T extends HTMLElement>(initialWidth = 960) {
    const ref = useRef<T>(null)
    const [width, setWidth] = useState(initialWidth)

    // Measuring before paint keeps a narrow viewport from briefly rendering the chart
    // at the desktop fallback width.
    useLayoutEffect(() => {
        const element = ref.current
        if (!element) {
            return
        }

        const updateWidth = (nextWidth: number) => {
            if (nextWidth > 0) {
                setWidth(Math.round(nextWidth))
            }
        }
        updateWidth(element.getBoundingClientRect().width)

        if (typeof ResizeObserver === 'undefined') {
            const handleResize = () => updateWidth(element.getBoundingClientRect().width)
            window.addEventListener('resize', handleResize)

            return () => window.removeEventListener('resize', handleResize)
        }

        const observer = new ResizeObserver(([entry]) => {
            if (entry) {
                updateWidth(entry.contentRect.width)
            }
        })
        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    return { ref, width }
}
