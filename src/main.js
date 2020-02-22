import Vue from 'vue'
import App from './App.vue'

import { randomCredentials, randomAuthResult, fakeInitialize } from '@/js/test'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

window.randomCredentials = randomCredentials
window.randomAuthResult = randomAuthResult
window.fakeInitialize = fakeInitialize
