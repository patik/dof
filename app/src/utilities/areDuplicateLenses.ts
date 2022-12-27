type PartialLens = Pick<LensDefinition, 'name' | 'depthOfField'>

function areDuplicateLenses(lens1: PartialLens, lens2: PartialLens) {
    return lens1.name === lens2.name && lens1.depthOfField === lens2.depthOfField
}

export default areDuplicateLenses
