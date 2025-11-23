/**
 * @file components/AuthButton.tsx
 * @description Compact authentication button with hover tooltip
 * 
 * Features:
 * - Small button in top right corner
 * - Hover tooltip explaining benefits
 * - Links to full auth panel modal
 */

import { useState } from 'react'
import AuthModal from './AuthModal'

interface AuthButtonProps {
  jwt: string | null
  onLogin: (token: string) => Promise<void>
}

export default function AuthButton({ jwt, onLogin }: AuthButtonProps): JSX.Element {
  const [showModal, setShowModal] = useState(false)

  // Don't show if already authenticated
  if (jwt) {
    return (
      <div className="auth-button-container">
        <div className="auth-button authenticated" title="You are signed in">
          ✓ Signed in
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="auth-button-container">
        <button className="auth-button" onClick={() => setShowModal(true)}>
          👤 Sign In/Sign Up
          <div className="auth-tooltip">
            <strong>Save Your Settings</strong>
            <p>Sign in to save your personalized spectrum settings to your profile. Your data persists across devices so you can access your preferences anytime.</p>
          </div>
        </button>
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} onLogin={onLogin} />}
    </>
  )
}
