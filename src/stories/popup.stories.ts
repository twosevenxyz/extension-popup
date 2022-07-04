import { ref } from 'vue'
import Popup from '../App.vue'
import './style.scss'

const profile = ref({
  nickname: 'Guru',
  email: 'abc@example.com'
})
const isPausedOnWebsite = ref(false)
const isPausedOnAllWebsites = ref(false)
const loggedIn = ref(false)

export default {
  title: 'Popup',
  component: Popup,
  args: {
    version: '3.0.0',
    profile,
    isPausedOnWebsite,
    isPausedOnAllWebsites,
    loggedIn,
    sendMessage (evt: string, args: any) {
      switch (evt) {
        case 'authenticate': {
          loggedIn.value = true
          break
        }
        case 'logout': {
          loggedIn.value = false
          break
        }
        case 'pause-on-website': {
          isPausedOnWebsite.value = args.shouldPause
          break
        }
        case 'pause-on-all-websites': {
          isPausedOnAllWebsites.value = args.shouldPause
          break
        }
      }
    }
  },
  parameters: {
    controls: {
      exclude: [
        'isPausedOnWebsite',
        'isPausedOnAllWebsites',
        'profile',
        'loggedIn',
        'sendMessage',
        'onMessage',
        'browser'
      ]
    }
  }
}

const Template = (args: any) => ({
  components: { Popup },
  setup () {
    return { args }
  },
  template: `
  <div id="app">
    <Popup v-bind="args" ref="popup"/>
  </div>`
})

export const Basic = Template.bind({})
