// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

let _app: any = null
let _auth: any = null

export async function getAuthClient() {
  if (typeof window === 'undefined') return null
  if (_auth) return _auth

  const { initializeApp } = await import('firebase/app')
  const { getAuth } = await import('firebase/auth')

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!firebaseConfig.apiKey) {
    console.warn('Missing NEXT_PUBLIC_FIREBASE_API_KEY or other env vars')
  }

  _app = initializeApp(firebaseConfig)
  _auth = getAuth(_app)
  return _auth
}