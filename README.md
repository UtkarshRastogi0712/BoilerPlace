# Boilerplace README

Boilerplace is a one-stop solution for all things boilerplate. Create files, functions and a lot more using simple commands. Making development easier, one keystroke at a time.

## Features

- Create CRUD functionality for n number of entities in just 2 Commands.
- Create API entrypoint, mongoDB connection file and the entire Routes-Controller-Service-Schema architecture for the required entities.

## Usage

Install the extension from the VSCode Extensions Marketplace or install it by adding the .vsix file to the extensions folder of VSCode.

1. Create a node project with npm init.
2. Run boilerplace init command and enter the name of the entry point of the API you want to create (ex: app.js) followed by a list of names of entities that you want crud routes to be created for (ex: {"name" : "employee"})

3) Run boilerplace create command to create all the required boilerplate.

> Press Ctrl + Shift + P to open the VSCode Command Palette (unless configured otherwise).

## Scope for development

- Option to selectively create routes for HTTP methods as required.
- Multi language support
- Snippets for utility functions

**Enjoy!**
