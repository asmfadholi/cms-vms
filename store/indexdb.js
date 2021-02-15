export const state = () => ({
  shopId: null,
  db: null,
  products: [],
  transactions: []
})

export const mutations = {
  setShopId (state, payload) {
    state.shopId = payload
  },

  setProducts (state, payload) {
    state.products = payload
  },

  setData (state, { propertyState, payload }) {
    state[propertyState] = payload.sort((a, b) => b.id - a.id)
  },

  setDB (state, payload) {
    state.db = payload
  }
}

export const actions = {
  async getDb ({ commit }) {
    try {
      const db = await new Promise((resolve, reject) => {
        const request = window.indexedDB.open('market', 2)

        request.onerror = (e) => {
          console.log('Error opening db', e)
          reject(e)
        }

        request.onsuccess = (e) => {
          console.log('success opening db', e.target.result)
          resolve(e.target.result)
        }

        request.onupgradeneeded = (e) => {
          console.log('onupgradeneeded')
          const db = e.target.result
          if (!db.objectStoreNames.products) {
            db.createObjectStore('products', { autoIncrement: true, keyPath: 'id' })
          }

          if (!db.objectStoreNames.transactions) {
            db.createObjectStore('transactions', { autoIncrement: true, keyPath: 'id' })
          }
        }
      })
      commit('setDB', db)
    } catch (err) {
      console.log('Error opening db', err)
    }
  },

  async addData ({ dispatch, state }, { data, propertyState }) {
    if (state[propertyState].length < 1) {
      await dispatch('getDatas', { propertyState })
    }

    if (!state.db) {
      await dispatch('getDb')
    }

    const checkData = state[propertyState].filter(item => item.id === data.id)
    if (checkData.length > 0) { return }
    return await new Promise((resolve, reject) => {
      const trans = state.db.transaction([propertyState], 'readwrite')
      trans.oncomplete = (e) => {
        resolve(e)
      }

      const store = trans.objectStore(propertyState)
      store.add(data)
    })
  },

  async deleteData ({ state, dispatch }, { id, propertyState }) {
    if (!state.db) {
      await dispatch('getDb')
    }
    return await new Promise((resolve, reject) => {
      const trans = state.db.transaction([propertyState], 'readwrite')
      trans.oncomplete = (e) => {
        resolve(e)
      }

      const store = trans.objectStore(propertyState)
      store.delete(id)
    })
  },

  async getDatas ({ commit, state, dispatch }, { propertyState }) {
    if (!state.db) {
      await dispatch('getDb')
    }
    const payload = await new Promise((resolve, reject) => {
      const trans = state.db.transaction([propertyState], 'readonly')

      const store = trans.objectStore(propertyState)
      const products = []

      trans.oncomplete = (e) => {
        resolve(products)
      }

      store.openCursor().onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
          products.push(cursor.value)
          cursor.continue()
        }
      }
    })
    const newPayload = payload.filter(fil => fil.shop.id === state.shopId)
    commit('setData', { propertyState, payload: newPayload })
  },

  async getProducts ({ dispatch }) {
    return await dispatch('getDatas', { propertyState: 'products' })
  },

  async addProduct ({ dispatch }, product) {
    return await dispatch('addData', { data: product, propertyState: 'products' })
  },

  async deleteProduct ({ dispatch }, id) {
    return await dispatch('deleteData', { id, propertyState: 'products' })
  },

  async getTransactions ({ dispatch }) {
    return await dispatch('getDatas', { propertyState: 'transactions' })
  },

  async addTransaction ({ dispatch }, transaction) {
    return await dispatch('addData', { data: transaction, propertyState: 'transactions' })
  },

  async deleteTransaction ({ dispatch }, id) {
    return await dispatch('deleteData', { id, propertyState: 'transactions' })
  }
}
