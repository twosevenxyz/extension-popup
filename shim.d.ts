import type { ProtocolWithReturn } from 'webext-bridge'

interface TabUpdate {
  isPausedOnWebsite: boolean
  isPausedOnAllWebsites: boolean
}

interface AuthResult {
  access_token: string
  refresh_token?: string
  id_token?: string
}

interface Profile {
  email: string
  nickname: string
  userHash: string
}

interface LoginSuccess {
  authResult: AuthResult
  profile: Profile
}

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'tab-prev': { title: string | undefined },
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>,
    'version': ProtocolWithReturn<any, string>,
    'login-success': LoginSuccess,
    'credentials': any,
    'last-twoseven-tab': { lastActiveTwoSevenTabId: number },
    'get-last-twoseven-tab': ProtocolWithReturn<any, { lastActiveTwoSevenTabId: number }>,
    'tab-update': TabUpdate,
    'tab-info': ProtocolWithReturn<any, { url: string, tabMedia: any } & TabUpdate>,
    'open-twoseven.xyz': any,
    'show-tab-media': any,
    'pause-on-website': { shouldPause: boolean },
    'pause-on-all-websites': { shouldPause: boolean }
  }
}
