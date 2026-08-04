import { useEffect, useRef, useState } from 'react'

export default function useResizeObserver<T extends HTMLElement>(initialWidth = 960) {
    const ref = useRef<T>(null)
    const [width, setWidth] = useState(initialWidth)

    useEffect(() => {
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
