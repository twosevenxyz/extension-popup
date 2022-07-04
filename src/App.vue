<script setup lang="ts">
import { Ref, ref, defineComponent } from 'vue'
import { computed } from '@vue/reactivity'
import type { onMessage as OnMessage, sendMessage as SendMessage } from 'webext-bridge'

import type { Browser } from 'webextension-polyfill'
import is from 'is_js'
import Spinner from './components/spinner.vue'
import { Profile } from '../shim'

const props = defineProps<{
  browser: Browser,
  onMessage: typeof OnMessage,
  sendMessage: typeof SendMessage,
  version: String,
  loggedIn: Ref<boolean>,
  origin: string,
  isPausedOnWebsite: Ref<boolean>,
  isPausedOnAllWebsites: Ref<boolean>,
  tabMedia: any,
  profile: Ref<Profile>,
  lastActiveTwoSevenTabId: number
}>()

const waitingForBG = ref(false)

function isEmpty (obj: any) {
  if (!obj) {
    return true
  }
  if (obj instanceof Object) {
    return Object.keys(obj).length === 0
  } else if (obj instanceof Array) {
    return obj.length === 0
  }
  throw new Error(`isEmpty not implemented for instance: '${typeof obj}'`)
}

const avatarSrc = computed<string>(() => {
  return `https://twoseven.xyz/api/gravatar/${props.profile.value?.userHash}/64`
})

const nickname = computed<string | undefined>(() => {
  return props.profile.value?.nickname
})

const validOrigin = computed<boolean>(() => {
  if (origin && origin.startsWith('chrome')) {
    return false
  }
  return true
})

const shouldShowMedia = computed<boolean>(() => {
  if (isEmpty(props.tabMedia)) {
    return false
  }
  // We have some media that was detected on this tab
  if (is.mobile()) {
    // Mobile devices cannot login. So check whether they have a twoseven tab open
    // If they do, we can simply load it in there without requiring login check
    return (props.lastActiveTwoSevenTabId || -1) > -1
  }
  return props.loggedIn.value
})

const login = async () => {
  await props.sendMessage('authenticate', {})
}

const logout = () => {
  // Remove the idToken from storage
  props.sendMessage('logout', {})
}

// Actions
const openTwoSeven = async () => {
  await props.sendMessage('open-twoseven.xyz', {})
}

const showTabMedia = async () => {
  await props.sendMessage('show-tab-media', {})
}

const handlePauseOnWebiste = async () => {
  await props.sendMessage('pause-on-website', { shouldPause: !props.isPausedOnWebsite.value })
}

const handlePauseOnAllWebsites = async () => {
  props.sendMessage('pause-on-all-websites', { shouldPause: !props.isPausedOnAllWebsites.value })
}
const openSettings = () => {
  return props.browser.runtime.openOptionsPage()
}
</script>

<template>
  <div class="root dropdown is-active">
    <div class="options dropdown-content pb-0">
      <div v-if="waitingForBG" class="" style="margin: 8px 0;">
        <Spinner color="#009688" :size="48" style="margin: auto" />
      </div>
      <div v-else-if="!loggedIn.value">
        <div class="dropdown-item has-text-centered login-container">
          <h5 class="is-size-5 has-text-weight-bold"> You are not logged in </h5>
          <button class="button" style="margin-bottom: 8px" @click="login">Login to twoseven.xyz</button>
        </div>
        <hr class="dropdown-divider" />
      </div>

      <div v-if="loggedIn.value" class="dropdown-item">
        <div id="profile">
          <figure class="image is-32x32 is-inline-block">
            <img :src="avatarSrc" class="is-rounded" :alt="nickname" />
          </figure>
          <span class="nickname">{{ nickname }}</span>
          <button class="button is-small" @click="logout">Logout</button>
        </div>
        <div class="divider"></div>
      </div>

      <a v-if="shouldShowMedia" class="dropdown-item option" @click="showTabMedia">
        <div class="is-flex is-flex-direction-row">
          <span class="icon-text is-flex-grow-1">
            <span class="icon">
              <i-carbon-media-library />
            </span>
            <span>Show Media</span>
          </span>
          <span class="badge media-badge" style="margin-right: -24px">{{ Object.keys(tabMedia).length }}</span>
        </div>
      </a>

      <a class="dropdown-item option" @click="openSettings">
        <span class="icon-text">
          <span class="icon">
            <i-cil-settings />
          </span>
          <span> Settings </span>
        </span>
      </a>

      <a v-if="validOrigin" class="dropdown-item option" @click="handlePauseOnWebiste">
        <span class="icon-text">
          <span class="icon">
            <i-mdi-play v-if="isPausedOnWebsite.value" />
            <i-mdi-pause v-else />
          </span>
          <span> {{ isPausedOnWebsite.value ? 'Unpause' : 'Pause' }} on this website</span>
        </span>
      </a>

      <a class="dropdown-item option" @click="handlePauseOnAllWebsites">
        <span class="icon-text">
          <span class="icon">
            <i-mdi-play v-if="isPausedOnAllWebsites.value" />
            <i-mdi-pause v-else />
          </span>
          <span> {{ isPausedOnAllWebsites.value ? 'Unpause' : 'Pause' }} on all websites</span>
        </span>
      </a>

      <a class="dropdown-item option" @click="openTwoSeven">
        <span class="icon-text">
          <span class="icon">
            <img src="/assets/icon-512x512.png" />
          </span>
          <span>Go to twoseven.xyz</span>
        </span>
      </a>

      <div style="position: absolute; bottom: 8px; right: 16px;">
        <span class="is-family-monospace is-size-7">v{{ version }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'app',
  components: { Spinner },
  mounted () {
    window.app = this
  }
})
</script>

<style lang="scss">
@import 'bulma/bulma.sass';

html,
body {
  margin: 0;
  padding: 0;
}

.root {
  --background-primary: #009688;
  --text-on-primary: #fff;
  position: relative;
  width: 100%;
  height: 100%;

  .login-container {
    position: relative;
  }
}

.dropdown {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: inherit;

  .dropdown-content {
    height: inherit;
    background: inherit;
  }

  .dropdown-item {
    font-size: inherit;
    padding-right: 2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}

#options {
  border-radius: 0 !important;
  border-top: none;

  font-size: 1.2em;
}

#profile {
  width: 100%;
  margin-top: 1em;
  margin-bottom: 2em;
  display: flex;
  flex-direction: row;
  align-items: center;

  .image {
    display: flex;
  }

  .nickname {
    display: flex;
    margin-left: 8px;
    font-size: 1.2em;
    font-weight: 600;
    flex: 1;
  }

  button {
    margin-right: -24px;
  }
}

.collection-item.option {
  color: #000 !important;
  font-size: 1.4em;
  cursor: pointer;
}

@-moz-document url-prefix() {
  .collection-item.option {
    font-size: 14px;
  }

  #profile .nickname {
    font-size: 16px;
  }
}

.badge.media-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  margin-left: 14px;
  font-weight: bold;
  font-size: 0.9rem;
  color: var(--text-on-primary);
  background-color: var(--background-primary);
  border-radius: 2px;
  min-width: 2em;
}

.btn.logout-btn {
  height: 32px;
}

.logout-btn:hover {
  background-color: grey;
  color: white;
}
</style>
