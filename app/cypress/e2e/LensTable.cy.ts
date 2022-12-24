describe('LensTable', () => {
    it('Removes all existing lenses', () => {
        cy.visit('http://localhost:3000')

        // Make sure there are some lenses
        cy.get('[data-testid^="name"]').should('have.length.above', 0)

        cy.get('[data-testid="select-all"]').click()

        cy.get('button[aria-label="Delete"]').click()

        cy.get('[data-testid^="name"]').should('have.length', 0)
    })

    it('Updates the depth of field calculation when the inputs are changed', () => {
        cy.visit('http://localhost:3000')

        // Ensure units are set to metric so we know what numeric value to look for at the end
        cy.get('button[title="Meters"]').click()

        cy.get('[data-testid="focal-length-1"] input').focus().type('{selectall}').type('72')

        cy.get('[data-testid="aperture-1"]').parent().click().get('ul > li[data-value="f/3.4"]').click()

        cy.get('[data-testid="sensor-1"]').parent().click().get('ul > li[data-value="35mm"]').click()

        cy.get('[data-testid="dof-1"]').should('have.text', '0.61')
    })

    it('The Add Lens button adds another lens', () => {
        cy.visit('http://localhost:3000')

        // Before adding the new lnes, get the ID if the latest existing lens, so we know what the next ID should be
        cy.get('[data-testid^="name"]')
            .last()
            .invoke('get')
            .then((lastLens) => {
                // Find the most recent lens ID
                const lastId = lastLens[0].dataset.testid.replace(/^name-/, '')

                // Determine what the next lens ID should be
                const nextId = `${Number(lastId) + 1}`

                cy.get('button').contains('Add Lens').click()

                // New lens should now be visible
                cy.get(`[data-testid="name-${nextId}"]`).should('be.visible')
            })
    })
})

export {}
