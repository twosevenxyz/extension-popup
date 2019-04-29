const token = {
  access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NTY1Njc5MDksImV4cCI6Nzg5OTQ1MTEwOSwiYXVkIjoidGVzdCIsInN1YiI6InR3b3NldmVuLWV4dGVuc2lvbi10ZXN0In0.6q0Vwd3uWteqxFqH0a4L7bzDZWmrzynvq_PFqR1jNgY',
  id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NTY1Njc5MDksImV4cCI6Nzg5OTQ1MTEwOSwiYXVkIjoidGVzdCIsInN1YiI6InR3b3NldmVuLWV4dGVuc2lvbi10ZXN0In0.6q0Vwd3uWteqxFqH0a4L7bzDZWmrzynvq_PFqR1jNgY',
  scope: 'twoseven-extension-test',
  expires_in: 86400,
  token_type: 'Bearer'
}

function randomCredentials () {
  return token
}

function randomAuthResult () {
  return {
    authResult: randomCredentials(),
    profile: {
      nickname: 'test',
      email: 'test@test'
    }
  }
}

function fakeInitialize () {
  window.app.version = '99.99.9.9'
  window.app.updateAuthResults(randomAuthResult())
}

export {
  randomCredentials,
  randomAuthResult,
  fakeInitialize
}
