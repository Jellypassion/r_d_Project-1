Feature: Allo.ua tests

Background:
  Given user is on the Allo.ua homepage

Scenario: User can perform search and see results
  When user searches for "iPhone Air"
  Then page title contains "iPhone Air"
  And search results are displayed

Scenario: Open catalog and verify that catalog items are displayed
  When user opens the catalog menu
  Then catalog items are displayed