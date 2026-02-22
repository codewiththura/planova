'use server'

import { redirect } from 'next/navigation'

export async function continueWithGoogle(source: 'signup' | 'login') {
  // Mock backend logic
  // "Backend checks for user. Backend creates user + Org/Workspace (since they came from /signup)."
  
  if (source === 'signup') {
    // Redirect to Onboarding
    redirect('/onboarding')
  } else if (source === 'login') {
    // "If they use the same button on the /login page and the account doesn't exist, Create it, 
    // redirect them to a 'Welcome! Let's set up your profile' page"
    redirect('/onboarding?welcome=true')
  }
}

export async function loginWithEmail(formData: FormData) {
  // Mock simple email/password auth
  redirect('/onboarding')
}

export async function signupWithEmail(formData: FormData) {
  // Mock simple email/password auth
  redirect('/onboarding')
}
