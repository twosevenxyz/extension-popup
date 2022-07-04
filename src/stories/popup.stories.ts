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
const tabMedia = ref<Record<string, any>>({})

const fakeMediaEntry = {
  videoSelector: 'web',
  referer: 'https://www.ted.com/talks/alison_killing_how_data_driven_journalism_illuminates_patterns_of_injustice',
  videoURL: 'hls:https://hls.ted.com/project_masters/7817/manifest.m3u8?intro_master_id=2346',
  hash: 'c42287a4e73a0efb02334433980a2c5e',
  entryType: 'media',
  mediaHandlerHash: '0:79cfe565867b423309de6f043ba31a16',
  listeners: {}
}

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
    },
    tabMedia
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
  methods: {
    addFakeMediaEntry () {
      tabMedia.value[`${Date.now()}`] = fakeMediaEntry
    }
  },
  template: `
  <button class="button is-link mb-1" @click="addFakeMediaEntry">Add MediaEntry</button>
  <div id="app-container">
    <div id="app">
      <Popup v-bind="args" ref="popup"/>
    </div>
  </div>`
})

export const Basic = Template.bind({})
