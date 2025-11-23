/**
 * @file components/AuthModal.tsx
 * @description Modal for authentication (sign in / sign up)
 */

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import type { AuthError } from '@supabase/supabase-js'

interface AuthModalProps {
  onClose: () => void
  onLogin: (token: string) => Promise<void>
}

type AuthStatus = '' | 'Signing up...' | 'Sign up success. Check email for confirmation.' | 'Logging in...' | 'Logged in' | 'Logged in (no token)' | string

export default function AuthModal({ onClose, onLogin }: AuthModalProps): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<AuthStatus>('')

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
        const jwtToken = data.session?.access_token
        if (jwtToken) {
          await onLogin(jwtToken)
          setStatus('Logged in')
          onClose()
        } else {
          setStatus('Logged in (no token)')
        }
      }
    } catch (err) {
      setStatus(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} role="presentation" aria-hidden="true" />
      <div className="modal" role="dialog" aria-labelledby="auth-modal-title" aria-modal="true">
        <div className="modal-content">
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>

          <h2 id="auth-modal-title">Sign In / Sign Up</h2>
          <p className="modal-intro">
            Create an account or sign in to save your personalized spectrum settings and access them across devices.
          </p>

          <div style={{ marginTop: 24 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleLogin}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                Sign Up
              </button>
            </div>

            {status && (
              <div
                style={{
                  marginTop: 16,
                  padding: '12px',
                  borderRadius: '6px',
                  background: status.includes('Error') ? '#fee2e2' : '#d1fae5',
                  color: status.includes('Error') ? '#991b1b' : '#065f46',
                  fontSize: '0.9rem'
                }}
              >
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
