const authData = require('../fixtures/api_config.json')
const token = authData.token
const key = authData.key
const auth = "key=" + key + "&token=" + token

describe('Trello API', () => {

    const authPath = (path) => {
      return path.includes("?") ? `${path}&${auth}` : `${path}?${auth}`
    }

    const getItems = (path) => {
      return cy.request({
        url: authPath(path),
        failOnStatusCode: false 
      })
      .its('body')
    }

    const addItem = (path, item) => {
      return cy.request('POST', authPath(path), item)
      .its('body')
      .then((resp) => {
        return resp.id
      })
    }

    const deleteItem = (path, id) => {
      return cy.request({
        method: 'DELETE',
        url: authPath(`${path}/${id}`),
        failOnStatusCode: false 
      })
    }

    const deleteAllBoards = () => {
      return getItems('/members/me/boards')
      .each((item) => { 
        deleteItem('/boards', item.id)
      })
    }

    const reset = () => {
      deleteAllBoards()
    }

    beforeEach(reset)
    afterEach(reset)
  
    it('returns JSON', () => {
      cy.request('/members/me/boards?' + auth)
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
    })

    //criar board
    it('Creates a Board', () => {
      const randomId = Cypress._.random(0, 10000)
      const board = { name: `test_board_${randomId}` }

      addItem('/boards', board).then((boardId) => {
        getItems('/members/me/boards').then((boards) => {
          expect(JSON.stringify(boards)).to.contain(boardId)
        })
      })
    })

    // deletar board
    it('Delete a Board', () => {
      const randomId = Cypress._.random(0, 10000)
      const board = { name: `test_board_${randomId}` }

      addItem('/boards', board).then((boardId) => {
        deleteItem('/boards', boardId).then(() => {
          getItems('/members/me/boards').then((boards) => {
            expect(JSON.stringify(boards)).not.to.contain(boardId)
          })
        })
      })
    })
      //criar card
    it('Creates a Card', () => {
      const randomId = Cypress._.random(0, 10000)
      const board = { name: `test_board_${randomId}` }
      const card = { name: `test_card_${randomId}` }

      addItem('/boards', board).then((boardId) => {
        getItems(`/boards/${boardId}/lists`).then((lists) => {
          const listId = lists[0].id

          addItem(`/cards?idList=${listId}`, card).then((cardId) => {
            getItems(`/cards/${cardId}`).then((cards) => {
              expect(JSON.stringify(cards)).to.contain(cardId)
            })
          })
        })
      })
    })

    //deletar card
    it('Delete a Card', () => {
      const randomId = Cypress._.random(0, 10000)
      const board = { name: `test_board_${randomId}` }
      const card = { name: `test_card_${randomId}` }

      addItem('/boards', board).then((boardId) => {
        getItems(`/boards/${boardId}/lists`).then((lists) => {
          const listId = lists[0].id

          addItem(`/cards?idList=${listId}`, card).then((cardId) => {
            deleteItem('/cards/', cardId).then(() => {
              getItems(`/cards/${cardId}`).then((cards) => {
                expect(JSON.stringify(cards)).not.to.contain(cardId)
              })
            })
          })
        })
      })
    })

})

