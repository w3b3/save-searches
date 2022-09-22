# Structured Saving Searches

Organize your searches in a structured way.

- Have a private log of your searches
- Recall the options presented (not structured) by seeing a page screenshot (`.png` file)
  - A convertion to PDF or Spreadsheet should be available next
- Store all the results in a structured way, saving to an online database service (Astra DB, from DataStax)
  - Parsing of the links found, and recorded in the database
- Perform retrievals from your records using the same CLI used to save the searches

## Installation

TODO

## How to Search

TODO: add default format such as `search <search term> <RESULTS>`

- default implicit input is SEARCH

- it should accept several words (to be used as a single search term)

### Results arg

RESULTS that takes an integer.

It is the second input param.

This is the number of browser tabs that should be opened

# How it works?

Running a search opens a browser based on the CLI inputs.

The search provider is duck duck go

search results are captured in a screenshot saved in a local folder structure
