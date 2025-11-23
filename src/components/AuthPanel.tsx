/**
 * @file components/AuthPanel.tsx
 * @description Authentication component for Supabase email/password login
 * 
 * Features:
 * - Email/password sign in and sign up
 * - Status messages for user feedback
 * - Hides after successful authentication
 */

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import type { AuthError } from '@supabase/supabase-js'

interface AuthPanelProps {
  /**
   * Current JWT token (if authenticated)
   * Used to determine if auth UI should be shown
   */
  jwt: string | null

  /**
   * Callback when user successfully logs in
   * Called with JWT token for secure storage
   */
  onLogin: (token: string) => Promise<void>
}

type AuthStatus = '' | 'Signing up...' | 'Sign up success. Check email for confirmation.' | 'Logging in...' | 'Logged in' | 'Logged in (no token)' | string

/**
 * AuthPanel Component
 * 
 * Provides email/password authentication interface for Supabase
 * Hides after successful authentication
 * 
 * Note: This is a simple POC implementation. Production apps should:
 * - Use password strength validation
 * - Implement rate limiting
 * - Add email verification
 * - Handle OAuth providers
 * 
 * @param props - Component props
 * @returns Auth form or confirmation message
 */
export default function AuthPanel({ jwt, onLogin }: AuthPanelProps): JSX.Element {
  /** Email input state */
  const [email, setEmail] = useState('')

  /** Password input state */
  const [password, setPassword] = useState('')

  /** Status message for user feedback */
  const [status, setStatus] = useState<AuthStatus>('')

  /**
   * Handle user sign-up
   * Creates new account with email/password
   */
  async function handleSignUp(): Promise<void> {
    setStatus('Signing up...')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        setStatus(`Error: ${(error as AuthError).message}`)
      } else {
        setStatus('Sign up success. Check email for confirmation.')
      }
    } catch (err) {
      setStatus(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  /**
   * Handle user login
   * Authenticates with email/password and stores JWT
   */
  async function handleLogin(): Promise<void> {
    setStatus('Logging in...')
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setStatus(`Error: ${(error as AuthError).message}`)
      } else {
        // Extract JWT from session
        const jwtToken = data.session?.access_token
        if (jwtToken) {
          await onLogin(jwtToken)
          setStatus('Logged in')
        } else {
          setStatus('Logged in (no token)')
        }
      }
    } catch (err) {
      setStatus(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  // Hide auth UI if already authenticated
  if (jwt) {
    return <div>Signed in (token stored)</div>
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Sign in / Sign up</h3>

      {/* Email input */}
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />

      {/* Password input */}
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
      />

      {/* Action buttons */}
      <div style={{ marginTop: 8 }}>
        <button onClick={handleLogin}>Sign in</button>
        <button onClick={handleSignUp} style={{ marginLeft: 8 }}>
          Sign up
        </button>
      </div>

      {/* Status message */}
      {status && <div style={{ marginTop: 8, color: status.includes('Error') ? 'red' : 'green' }}>{status}</div>}
    </div>
  )
}
