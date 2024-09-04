Feature: Amazon cart functionality

  Scenario: Add and remove item from cart
    Given I open "https://www.amazon.com"
    When I search for "batteries"
    And I refine search results to prices between "20" and "100"
    And I add the first available item to the cart
    Then I proceed to the cart
    And I remove the selected item from the cart
    And I should see an empty cart message
