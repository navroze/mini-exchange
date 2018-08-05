Mini Exchange App 
=======================

A stock exchange through which external clients can buy the stocks of various companies via an API. The app support multi-threading using the **PM2** library in node.js. The exchange will reply back with one company stock (highest price) based on targeting, budget & other factors.

Table of Contents
-----------------

- [Features](#features)
- [Prerequisite](#prerequisited)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

Features
--------

- **Multi threading** using PM2 Library
- **Logging** using Winston Library
- **Node.js clusters** support
- Seeding Data support for exchange

Prerequisites
-------------

- Install [MongoDB](https://www.mongodb.org/downloads)
- Install [Node.js 8.0+](http://nodejs.org)

Getting Started
---------------

Clone the repository to get started:

```bash
# Get the latest snapshot
git clone git@github.com:navroze/mini-exchange.git

cd mini-exchange

# Install NPM dependencies
npm install

# Install global dependencies
npm install -g pm2

# Then simply start your app
npm start

# To test your application
npm test
```

**Note:** I have provided an additional feature to seed the exchange data. Data can be seeded by running `node seed.js`. This will save you a lot of time to create the test data and test the application.


Project Structure
-----------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **controllers**/stock-controller.js             | Controller for handling the stock exchange route              |
| **models**/company.js                 | Mongoose schema and model for company.                          |                       |
| **exchange-logs**/exchange.log                 | File to store logs when the exchange goes through the different stages .                          |                       |
| **exchange-logic**/exchange-logic.js                 | Filtering logic to retrieve the company-id for the bid.                          |                       |
| **validation**/req-validation.js                 | Validator for request sent through API.                          |                       |
| .env.example                       | Your database URI.           |
| .eslintrc                          | Rules for eslint linter.                                     |
| .gitignore                         | Folder and files ignored by git.                             |
| app.js                             | The main application file.                                   |
| Dockerfile                         | Docker configuration file.                                   |
| package.json                       | NPM dependencies.                                            |
| package-lock.json                  | Contains exact versions of NPM dependencies in package.json. |


