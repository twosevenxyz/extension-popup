<template>
  <div id="app">
    <div class="row">
      <div class="col s12" style="padding: 0;">
        <div v-if="waitingForBG" class="center" style="margin: 8px 0;">
          <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!loggedIn" class="center login-container">
          <h5> You are not logged in </h5>
          <a class="btn waves-teal waves-effect" style="margin-bottom: 8px" @click="login">Login to twoseven.xyz</a>
          <div class="divider"></div>
        </div>
        <div>
          <div id="options" class="collection" style="margin-top: 0;">
            <div v-if="loggedIn">
              <div id="profile" style="display: inline-block;">
                <img :src="avatarSrc" class="circle avatar" :alt="nickname"/>
                <span class="nickname">{{ nickname }}</span>
                <a class="btn btn-small btn-flat right logout-btn" @click="logout">Logout</a>
              </div>
              <div class="divider"></div>
            </div>

            <a v-if="shouldShowMedia" class="collection-item option" @click="showTabMedia">
              <div>
                <span> Show Media </span>
                <span class="right new badge media-badge" data-badge-caption="">{{ Object.keys(tabMedia).length }}</span>
              </div>
            </a>

            <a class="collection-item option" @click="openSettings">
              <div>
                <span> Settings </span>
              </div>
            </a>

            <a v-if="validOrigin" class="collection-item option" @click="handlePauseOnWebiste">
              <span>
                <span v-if="isPausedOnWebsite">Unpause</span>
                <span v-else>Pause</span>
                on this website
              </span>
            </a>

            <a class="collection-item option" @click="handlePauseOnAllWebsites">
              <span>
                <span v-if="isPausedOnAllWebsites">Unpause</span>
                <span v-else>Pause</span>
                on all websites
              </span>
            </a>

            <a class="collection-item option" @click="openTwoSeven">
              Go to twoseven.xyz
            </a>
          </div>
        </div>

        <div style="position: fixed; bottom: 0; width: 100%;">
          <div>
            <code style="float: right;padding: 8px 16px;">v{{ version }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import jwtDecode from 'jwt-decode'
import URI from 'urijs'
import is from 'is_js'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

const tag = 'browser-action'

function isEmpty (obj) {
  if (!obj) {
    return true
  }
  if (obj instanceof Object) {
    return Object.keys(obj).length > 0
  } else if (obj instanceof Array) {
    return obj.length > 0
  }
  throw new Error(`isEmpty not implemented for instance: '${typeof obj}'`)
}

const browser = window.chrome || window.browser

export default {
  name: 'app',
  data: function () {
    return {
      version: '',
      authResult: undefined,
      origin: undefined,
      isPausedOnWebsite: false,
      isPausedOnAllWebsites: false,
      tabMedia: undefined,
      profile: undefined,
      lastActiveTwoSevenTabId: undefined,
      waitingForBG: false,
      port: undefined
    }
  },
  computed: {
    loggedIn () {
      return this.authResult && this.isLoggedIn(this.authResult.access_token) && this.profile
    },
    isMobile () {
      return is.mobile()
    },
    userHash () {
      return md5(this.profile.email)
    },
    avatarSrc () {
      return `https://twoseven.xyz/api/gravatar/${this.userHash}/64`
    },
    nickname () {
      return this.profile.nickname
    },
    validOrigin () {
      if (this.origin && this.origin.startsWith('chrome')) {
        return false
      }
      return true
    },
    tabHasMedia () {
      if (!this.tabMedia) {
        return false
      }
      return isEmpty(this.tabMedia)
    },
    shouldShowMedia () {
      const { lastActiveTwoSevenTabId, loggedIn, tabHasMedia } = this
      if (!tabHasMedia) {
        return false
      }
      // We have some media that was detected on this tab
      if (is.mobile()) {
        // Mobile devices cannot login. So check whether they have a twoseven tab open
        // If they do, we can simply load it in there without requiring login check
        return lastActiveTwoSevenTabId > -1
      }
      return loggedIn
    }
  },
  watch: {
    pausedTabs () {
      localStorage.pausedTabs = JSON.stringify(this.pausedTabs)
    }
  },
  methods: {
    isLoggedIn (token) {
      if (!token) {
        return
      }
      // The user is logged in if their token isn't expired
      return jwtDecode(token).exp > Date.now() / 1000
    },

    logout () {
      // Remove the idToken from storage
      this.authResult = undefined
      this.profile = undefined
      this.triggerAction('logout', 'auth-bg')
    },
    async waitForEvent (evt) {
      const { port } = this
      this.waitingForBG = true
      await new Promise((resolve, reject) => {
        port.onMessage.addListener(function once (msg) {
          if (msg.action === evt) {
            port.onMessage.removeListener(once)
            resolve()
          }
        })
      })
      this.waitingForBG = false
    },
    async login () {
      this.triggerAction('authenticate', 'auth-bg', 'login-success')
    },
    async triggerAction (action, to, waitForEvent, data = {}) {
      const { port } = this
      port.postMessage({
        from: tag,
        to,
        action,
        ...data
      })
      if (waitForEvent) {
        await this.waitForEvent(waitForEvent)
      }
    },
    updateAuthResults ({ authResult, profile }) {
      this.authResult = authResult
      this.profile = profile
    },
    openTwoSeven () {
      this.triggerAction('open-twoseven.xyz', 'base-bg')
    },
    showTabMedia () {
      this.triggerAction('show-tab-media', 'tab-media-bg')
    },
    handlePauseOnWebiste () {
      this.triggerAction('pause-on-website', 'base-bg', false, { shouldPause: !this.isPausedOnWebsite })
    },
    handlePauseOnAllWebsites () {
      this.triggerAction('pause-on-all-websites', 'base-bg', false, { shouldPause: !this.isPausedOnAllWebsites })
    },
    openSettings () {
      browser.runtime.openOptionsPage()
    }
  },
  async beforeMount () {
    const self = this
    const port = browser.runtime.connect({ name: tag })
    this.port = port
    port.onMessage.addListener((msg) => {
      switch (msg.action) {
        case 'version':
          self.version = msg.version
          break
        case 'login-success':
        case 'credentials':
          self.updateAuthResults(msg)
          break
        case 'tab-info':
          self.origin = new URI(msg.url).origin()
          self.tabMedia = msg.tabMedia
          self.isPausedOnWebsite = msg.isPausedOnWebsite
          self.isPausedOnAllWebsites = msg.isPausedOnAllWebsites
          break
        case 'last-twoseven-tab':
          self.lastActiveTwoSevenTabId = msg.lastActiveTwoSevenTabId
          break
        case 'tab-update':
          console.log('Received tab update')
          self.isPausedOnWebsite = msg.isPausedOnWebsite
          self.isPausedOnAllWebsites = msg.isPausedOnAllWebsites
          break
      }
    })

    await this.triggerAction('version', 'base-bg', 'version')
    await this.triggerAction('credentials', 'auth-bg', 'login-success')
    await this.triggerAction('last-twoseven-tab', 'base-bg', 'last-twoseven-tab')
    await this.triggerAction('tab-info', 'base-bg', 'tab-info')
  },
  mounted () {
    window.app = this
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  position: relative;
  .row {
    height: 100%;
    .col {
      position: relative;
      height: inherit;
    }
    .login-container {
      position: relative;
    }
  }
}

#options {
  border-radius: 0 !important;
  border-top: none;
}

#profile {
  width: 100%;
  margin-top: 1em;
  margin-bottom: 2em;
}

#profile .avatar {
  margin-left: 8%;
  margin-right: 3%;
  height: 32px;
  width: 32px;
  vertical-align: middle;
}

#profile .nickname {
  font-size: 1.2em;
  font-weight: 600;
  vertical-align: middle;
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
