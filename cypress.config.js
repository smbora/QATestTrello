const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://api.trello.com/1',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
