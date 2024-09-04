import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I open {string}', (url: string) => {
  cy.viewport('macbook-16')
  cy.visit(url);
});

When('I search for {string}', (searchTerm) => {
  /*
  If captcha page loads, uncomment following line and bypass captcha manually the resume test execution
  */
  //cy.pause()
  cy.get('#twotabsearchtextbox').type(`${searchTerm}{enter}`);
  cy.url().should('contain',`=${searchTerm}`);
});

When('I refine search results to prices between {string} and {string}', (minPrice: string, maxPrice: string) => {
  /*
  Due to a framework and website limitation the slider will not update the actual values on the ui, 
  therefore the slider values are modified by manipulating the dom
  */
  cy.get('[data-slider-id="p_36/range-slider"]').find('[name="low-price"]').invoke('val', minPrice)
  cy.get('[data-slider-id="p_36/range-slider"]').find('[name="high-price"]').invoke('val', maxPrice)
  cy.get('.a-button-inner').contains("Go").parent().prev().click()
  cy.url().should('contain',`low-price=${minPrice}`);
  cy.url().should('contain',`high-price=${maxPrice}`);
});

When('I add the first available item to the cart', () => {
  cy.intercept('POST', '**/cart/carts/**').as("addItemToCart");
  cy.get('button').contains("Add to cart").click();
  cy.wait("@addItemToCart");
  cy.get('#nav-cart').contains("1").should('be.visible');
});

Then('I proceed to the cart', () => {
  cy.get('#nav-cart').click();
  cy.url().should('contain','=nav_cart');
});

Then('I remove the selected item from the cart', () => {
  cy.intercept('POST', '**cart_actions**').as("removeItemFromCart");
  cy.get('.sc-action-delete input').click();
  cy.wait("@removeItemFromCart");
});

Then('I should see an empty cart message', () => {
  cy.get('h2').contains("Your Amazon Cart is empty.").should('be.visible');
  cy.get('#nav-cart').contains("0").should('be.visible');
});
