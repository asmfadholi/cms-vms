export const state = () => ({
  printCharacteristic: null,
  device: null
})

export const mutations = {
  setCharacteristic (state, payload) {
    state.printCharacteristic = payload
  },
  setDevice (state, payload) {
    state.device = payload
  }
}

export const actions = {
  async disconnectToBluetooth ({ commit, state }) {
    await state.device.gatt.disconnect()
    commit('setCharacteristic', null)
    commit('setDevice', null)
  },
  async connectToBluetooth ({ commit }) {
    await navigator.bluetooth.requestDevice({
      filters: [{
        services: ['000018f0-0000-1000-8000-00805f9b34fb']
      }]
    })
      .then((device) => {
        commit('setDevice', device)
        return device.gatt.connect()
      })
      .then(server => server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb'))
      .then(service => service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb'))
      .then((characteristic) => {
        commit('setCharacteristic', characteristic)
      })
      .catch((err) => { throw err })
  }
}
