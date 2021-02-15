// require('dotenv').config()

export default (context, inject) => {
  const generateUUID = () => {
    let dt = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }
  // Inject $hello(msg) in Vue, context and store.
  inject('uuid', generateUUID)
  // For Nuxt <= 2.12, also add 👇
  context.$uuid = generateUUID
}
