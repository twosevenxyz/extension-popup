import { createApp } from 'vue'
import { App } from './lib'
import { randomCredentials, randomAuthResult, fakeInitialize } from './js/test'

const app = createApp(App)
app.mount('#app')

window.randomCredentials = randomCredentials
window.randomAuthResult = randomAuthResult
window.fakeInitialize = fakeInitialize
