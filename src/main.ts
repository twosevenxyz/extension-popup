import { createApp } from 'vue'
import { App } from './lib'
import { randomCredentials, randomAuthResult, fakeInitialize } from './js/test'

const app = createApp(App)
app.mount('#app')

;(window as any).randomCredentials = randomCredentials
;(window as any).randomAuthResult = randomAuthResult
;(window as any).fakeInitialize = fakeInitialize
