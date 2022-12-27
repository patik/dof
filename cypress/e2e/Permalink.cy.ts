import { del } from 'idb-keyval'

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

    it('Adds hash to a clean URL', () => {
        cy.visit('http://localhost:3000')

        cy.url().should('not.include', '#')

        cy.get('button').contains('Add Lens').click()

        cy.url().should('include', '#5,m;Lens%203,35,f-2,full')
    })

    it('Reads lens from initial hash and adds it to the table', () => {
        cy.visit('http://localhost:3000/#5,m;Alpha%20bravo,20,f-3.6,16mm')

        cy.get('[data-testid^="lens-name-"] input').first().should('have.value', 'Alpha bravo')
        cy.get('[data-testid^="focal-length-"] input').first().should('have.value', '20')
        cy.get('[data-testid^="aperture-"]').first().contains('f/3.6')
        cy.get('[data-testid^="sensor-"]').first().contains('Standard 16mm film')
        cy.get('[data-testid^="dof-"]').first().contains('4.75')
    })
})

export {}
