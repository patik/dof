type LensName = LensDefinition['name']

// Unique labels keep repeated placeholder names distinguishable in the chart and tooltip.
export default function getUniqueLensNames(lenses: LensDefinition[]): Record<LensDefinition['id'], LensName> {
    const uniqueNameMap: Record<LensDefinition['id'], LensDefinition['name']> = {}

    const getUniqueName = (name: LensName): LensName => {
        if (Object.values(uniqueNameMap).includes(name)) {
            return getUniqueName(`${name} (2)`)
        }

        return name
    }

    lenses.forEach((lens) => {
        uniqueNameMap[lens.id] = getUniqueName(lens.name)
    })

    return uniqueNameMap
}
