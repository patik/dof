describe('LensTable', () => {
    it('Removes all existing lenses', () => {
        cy.visit('http://localhost:3000')

        // Make sure there are some lenses
        cy.get('button').contains('Add Lens').click()
        cy.get('[data-testid^="lens-name-"]').should('have.length.above', 0)
        // Make sure nothing is selected yet, so that below we can indirectly test whether selection works
        // cy.get('[data-testid="bottom-toolbar"] > div > div').should('not.contain', '')

        // Select All checkbox -> Delete button
        cy.get('[data-testid="select-all"]').click()
        cy.get('[data-testid="selected-count"]').contains(/\d+ selected/)
        // cy.get('[data-testid="bottom-toolbar"] > div > div').should('have.length', 2)
        cy.get('button[aria-label="Delete"]').click()

        cy.get('[data-testid^="lens-name-"]').should('have.length', 0)
    })

    describe('Updates the depth of field calculation when the inputs are changed', () => {
        it('metric', () => {
            cy.visit('http://localhost:3000')
            // Ensure there is exactly one lens in the table
            cy.get('button').contains('Add Lens').click()
            cy.get('[data-testid="select-all"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('button').contains('Add Lens').click()

            cy.get('button[title="Meters"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid^="dof-"]').last().should('not.have.text', '0.61')

            cy.get('[data-testid^="focal-length-"] input').last().focus().type('{selectall}').type('72')
            cy.get('[data-testid^="aperture-"]').last().parent().click().get('ul > li[data-value="f/3.4"]').click()
            cy.get('[data-testid^="sensor-"]').last().parent().click().get('ul > li[data-value="35mm"]').click()

            cy.get('[data-testid^="dof-"]').last().should('have.text', '0.61')
        })

        // it('imperial', () => {
        //     cy.visit('http://localhost:3000')
        //     // Ensure there is exactly one lens in the table
        //     cy.get('button').contains('Add Lens').click()
        //     cy.get('[data-testid="select-all"]').click()
        //     cy.get('button[aria-label="Delete"]').click()
        //     cy.get('button').contains('Add Lens').click()

        //     cy.get('button[title="Feet"]').click()

        //     // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
        //     cy.get('[data-testid^="dof-"]').last().should('not.have.text', `0' 5"`)

        //     cy.get('[data-testid^="focal-length-"] input').last().focus().type('{selectall}').type('90')
        //     cy.get('[data-testid^="aperture-"]').last().parent().click().get('ul > li[data-value="f/4"]').click()
        //     cy.get('[data-testid^="sensor-"]').last().parent().click().get('ul > li[data-value="APSCCanon"]').click()

        //     cy.get('[data-testid^="dof-"]').last().should('have.text', `0' 5"`)
        // })
    })

    it('The Add Lens button adds another lens to the table', () => {
        cy.visit('http://localhost:3000')

        // Before adding the new lnes, get the ID if the latest existing lens, so we know what the next ID should be
        cy.get('[data-testid^="lens-name-"]')
            .last()
            .invoke('get')
            .then((lastLens) => {
                // Find the most recent lens ID
                const lastId = lastLens[0].dataset.testid.replace(/^lens-name-/, '')

                // Determine what the next lens ID should be
                const nextId = `${Number(lastId) + 1}`

                cy.get('button').contains('Add Lens').click()

                // New lens should now be visible
                cy.get(`[data-testid="lens-name-${nextId}"]`).should('be.visible')
            })
    })

    // it('The Duplicate Lens button adds another lens to the table with the same values as the first lens', () => {
    //     cy.visit('http://localhost:3000')

    //     // Before adding the new lnes, get the ID if the latest existing lens, so we know what the next ID should be
    //     cy.get('[data-testid^="lens-name-"]')
    //         .last()
    //         .invoke('get')
    //         .then((lastLens) => {
    //             // Find the most recent lens ID
    //             const lastId = lastLens[0].dataset.testid.replace(/^lens-name-/, '')

    //             // Determine what the next lens ID should be
    //             const nextId = `${Number(lastId) + 1}`

    //             cy.get('button').contains('Add Lens').click()

    //             // New lens should now be visible
    //             cy.get(`[data-testid="lens-name-${nextId}"]`).should('be.visible')
    //         })
    // })
})

export {}
