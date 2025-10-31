// lib/discord-oidc.ts
import { OAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from './firebase'

export const signInWithDiscordOIDC = async () => {
  try {
    console.log('Starting Discord OIDC flow...')
    
    // Create OIDC provider for Discord
    const provider = new OAuthProvider('oidc.discord')
    
    // Add scopes - only request what you need
    provider.addScope('identify')
    provider.addScope('email')
    
    // Set custom parameters for Discord
    provider.setCustomParameters({
      prompt: 'consent'
    })

    console.log('OIDC Provider configured, attempting sign-in...')
    
    // Sign in with popup
    const result = await signInWithPopup(auth, provider)
    
    // Get the OAuth credential
    const credential = OAuthProvider.credentialFromResult(result)
    console.log('OIDC credential received:', !!credential)
    
    console.log('OIDC Sign-in successful:', {
      user: result.user.email,
      displayName: result.user.displayName,
      uid: result.user.uid,
      providerId: credential?.providerId
    })
    
    return result.user
    
  } catch (error: any) {
    console.error('Detailed Discord OIDC error:', {
      code: error.code,
      message: error.message,
      name: error.name,
      email: error.customData?.email,
      credential: error.credential
    })
    
    let userMessage = 'Failed to sign in with Discord'
    
    switch (error.code) {
      case 'auth/popup-blocked':
        userMessage = 'Popup was blocked by your browser. Please allow popups for this site.'
        break
      case 'auth/popup-closed-by-user':
        userMessage = 'Sign-in was cancelled. Please try again.'
        break
      case 'auth/unauthorized-domain':
        userMessage = 'This domain is not authorized for Discord sign-in.'
        break
      case 'auth/operation-not-supported-in-this-environment':
        userMessage = 'This operation is not supported in your current environment.'
        break
      case 'auth/invalid-credential':
        userMessage = 'Authentication failed. Please try again.'
        break
    }
    
    throw new Error(userMessage)
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    console.log('User signed out successfully')
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}