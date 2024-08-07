describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://api.trello.com/1/members/me/boards', {
      qs: {
        key: '6b85b037822a8f75c99afe4506e20f8d',
        token: 'ATTAf02eedcf370af73075b465a6627a6ce50c7d277812f83f77cefc8a7ab1799967162ADBA0'
      },
    })
  })
})