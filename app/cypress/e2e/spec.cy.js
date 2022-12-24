describe('My First Test', () => {
    it('finds the content "type"', () => {
        cy.visit('http://localhost:3000')

        // Ensure units are set to metric
        cy.get('button[title="Meters"]').click()

        cy.get('[data-testid="focal-length-1"] input').focus().type('{selectall}').type('72')

        cy.get('[data-testid="aperture-1"]').parent().click().get('ul > li[data-value="f/3.4"]').click()

        cy.get('[data-testid="sensor-1"]').parent().click().get('ul > li[data-value="35mm"]').click()

        cy.get('[data-testid="dof-1"]').should('have.text', '0.61')
    })
})
