import { del } from 'idb-keyval'
import useDofStore from '../../app/src/store/index'

describe('LensTable', () => {
    beforeEach(async () => {
        try {
            cy.log('Deleting local storage...')
            await del('dof-storage')
            cy.log('Deleting local storage finished.')
        } catch (e) {
            cy.log('Deleting local storage failed: ', e)
        }
    })

    it('Removes all existing lenses', () => {
        cy.visit('http://localhost:3000')

        const state = useDofStore.getState().lenses

        cy.log(`State has ${state.length} lenses before selecting`)
        console.log(`State has ${state.length} lenses before selecting`)

        // Make sure there are some lenses
        cy.get('button').contains('Add Lens').click()
        cy.get('[data-testid^="lens-name-"]').should('have.length.above', 0)
        cy.get('.lens-table-row').should('have.length.above', 0)

        cy.get('.lens-table-row').then(($elems) => {
            cy.log(`Table has ${$elems.length} rows before selecting`)
            console.log(`Table has ${$elems.length} rows before selecting`)
        })

        // Select All checkbox -> Delete button
        cy.get('[data-testid="select-all"]').click()
        cy.get('[data-testid="selected-count"]').contains(/\d+ selected/)
        cy.get('[data-testid="selected-count"]').then(($elems) => {
            cy.log(`Selected count: ${$elems.length}`)
            console.log(`Selected count: ${$elems.length}`)
        })

        // cy.get('[data-testid="bottom-toolbar"] > div > div').should('have.length', 2)
        cy.get('button[aria-label="Delete"]').click()
        // cy.get('.lens-table-row').then(($elems) => {
        //     cy.log(`Table has ${$elems.length} rows before selecting`)
        //     console.log(`Table has ${$elems.length} rows after deleting`)
        // })

        cy.log(`State has ${state.length} lenses after deleting`)
        console.log(`State has ${state.length} lenses after deleting`)

        // cy.get('.lens-table-row').should('have.length', 0)
        cy.get('[data-testid^="lens-name-"]').should('have.length', 0)
    })

    describe('Updates the depth of field calculation when the inputs are changed', () => {
        it('metric', () => {
            cy.visit('http://localhost:3000')
            // Ensure that there is exactly one lens in the table
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

        it('imperial', () => {
            cy.visit('http://localhost:3000')
            // Ensure that there is exactly one lens in the table
            cy.get('button').contains('Add Lens').click()
            cy.get('[data-testid="select-all"]').click()
            cy.get('button[aria-label="Delete"]').click()
            cy.get('button').contains('Add Lens').click()

            cy.get('button[title="Feet"]').click()

            // Make sure the initial value isn't the same one we'll be testing for in the end so thst we know for sure it's updated
            cy.get('[data-testid^="dof-"]').last().should('not.have.text', `0' 5"`)

            cy.get('[data-testid^="focal-length-"] input').last().focus().type('{selectall}').type('90')
            cy.get('[data-testid^="aperture-"]').last().parent().click().get('ul > li[data-value="f/4"]').click()
            cy.get('[data-testid^="sensor-"]').last().parent().click().get('ul > li[data-value="APSCCanon"]').click()

            cy.get('[data-testid^="dof-"]').last().should('have.text', `0' 5"`)
        })
    })

    it('The Add Lens button adds another lens to the table', () => {
        cy.visit('http://localhost:3000')

        // Before adding the new lens, get the ID if the latest existing lens, so we know what the next ID should be
        cy.get('[data-testid^="lens-name-"]')
            .last()
            .invoke('get')
            .then((lastLens) => {
                // Find the most recent lens ID
                const lastId = lastLens[0].dataset.testid.replace(/^lens-name-/, '')
                cy.log(`Last lens has ID: ${lastId}`)

                // Determine what the next lens ID should be
                const nextId = `${Number(lastId) + 1}`
                cy.log(`Next lens should have ID: ${nextId}`)

                cy.get('button').contains('Add Lens').click()

                // New lens should now be visible
                cy.get(`[data-testid="lens-name-${nextId}"]`).should('be.visible')
            })
    })

    it('The Duplicate Lens button adds another lens to the table with the same values as the first lens', () => {
        cy.visit('http://localhost:3000')
        // Ensure that there is exactly one lens in the table
        cy.get('button').contains('Add Lens').click()
        cy.get('[data-testid="select-all"]').click()
        cy.get('button[aria-label="Delete"]').click()
        cy.get('button').contains('Add Lens').click()
        cy.get('button[title="Meters"]').click()

        // Add custom values to the existing lens
        cy.get('[data-testid^="lens-name-"] input').last().focus().type('{selectall}').type('Sieben-Eins')
        cy.get('[data-testid^="focal-length-"] input').last().focus().type('{selectall}').type('20')
        cy.get('[data-testid^="aperture-"]').last().parent().click().get('ul > li[data-value="f/1.4"]').click()
        cy.get('[data-testid^="sensor-"]').last().parent().click().get('ul > li[data-value="16mm"]').click()
        cy.get('[data-testid^="dof-"]').last().should('have.text', '1.63')

        // Before adding the new lens, get the ID if the latest existing lens, so we know what the next ID should be
        cy.get('[data-testid^="lens-name-"]')
            .last()
            .invoke('get')
            .then((lastLens) => {
                // Find the most recent lens ID
                const lastId = lastLens[0].dataset.testid.replace(/^lens-name-/, '')
                cy.log(`Last lens has ID: ${lastId}`)

                // Determine what the next lens ID should be
                const nextId = `${Number(lastId) + 1}`
                cy.log(`Next lens should have ID: ${nextId}`)

                // Duplicate the lens
                cy.get(`[data-testid="lens-checkbox-${lastId}"]`).click()
                cy.get('button[aria-label="Duplicate"]').click()

                // New lens should now be visible
                cy.get(`[data-testid="lens-name-${nextId}"]`).should('be.visible')

                // Should have the same values as the first lens
                cy.get('[data-testid^="lens-name-"] input').last().should('have.value', 'Sieben-Eins copy')
                cy.get('[data-testid^="focal-length-"] input').last().should('have.value', '20')
                cy.get('[data-testid^="aperture-"]').last().contains('f/1.4')
                cy.get('[data-testid^="sensor-"]').last().contains('Standard 16mm film')
                cy.get('[data-testid^="dof-"]').last().contains('1.63')

                cy.get('[data-testid^="lens-name-"] input').first().should('have.value', 'Sieben-Eins')
            })
    })
})

export {}
