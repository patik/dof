describe('LensTable', () => {
    it('Removes all existing lenses', () => {
        cy.visit('http://localhost:3000')

        // Make sure there are some lenses
        cy.get('[data-testid^="name"]').should('have.length.above', 0)
        // Make sure nothing is selected yet, so that below we can indirectly test whether selection works
        // cy.get('[data-testid="bottom-toolbar"] > div > div').should('not.contain', '')

        // Select All checkbox -> Delete button
        cy.get('[data-testid="select-all"]').click()
        cy.get('button[aria-label="Delete"]').click()

        cy.get('[data-testid^="name"]').should('have.length', 0)
        // cy.get('[data-testid="bottom-toolbar"] > div > div').should('have.length', 2)
        cy.get('[data-testid="selected-count"]').should('match', /\d+ selected/)
    })

    describe('Updates the depth of field calculation when the inputs are changed', () => {
        it('metric', () => {
            cy.visit('http://localhost:3000')
            cy.get('button[title="Meters"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid="dof-1"]').should('not.have.text', '0.61')

            cy.get('[data-testid="focal-length-1"] input').focus().type('{selectall}').type('72')
            cy.get('[data-testid="aperture-1"]').parent().click().get('ul > li[data-value="f/3.4"]').click()
            cy.get('[data-testid="sensor-1"]').parent().click().get('ul > li[data-value="35mm"]').click()

            cy.get('[data-testid="dof-1"]').should('have.text', '0.61')
        })

        it('imperial', () => {
            cy.visit('http://localhost:3000')
            cy.get('button[title="Imperial"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid="dof-1"]').should('not.have.text', `0' 5"`)

            cy.get('[data-testid="focal-length-1"] input').focus().type('{selectall}').type('90')
            cy.get('[data-testid="aperture-1"]').parent().click().get('ul > li[data-value="f/4"]').click()
            cy.get('[data-testid="sensor-1"]').parent().click().get('ul > li[data-value="APSCCanon"]').click()

            cy.get('[data-testid="dof-1"]').should('have.text', `0' 5"`)
        })
    })

    it('The Add Lens button adds another lens to the table', () => {
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

    it('The Duplicate Lens button adds another lens to the table with the same values as the first lens', () => {
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
