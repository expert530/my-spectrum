/**
 * @file App.tsx
 * @description Main application component for neurodiversity spectrum settings
 * 
 * Features:
 * - Interactive sliders for 6 neurodiversity metrics (0-10)
 * - Real-time support recommendations based on metric scores
 * - Encrypted local storage of metric logs
 * - CSV export of current settings
 * - Plaintext view for easy copying
 * - Optional Supabase authentication
 * 
 * Architecture:
 * - Metrics are maintained in controlled component state
 * - Changes trigger recommendation recalculation
 * - All data is encrypted before storage
 */

import { useEffect, useState } from 'react'
import settingsData from '../allSettingValues.json'
import MetricSlider from './components/MetricSlider'
import AuthButton from './components/AuthButton'
import SupportRecommendations from './components/SupportRecommendations'
import { generateRecommendations } from './lib/recommendations'
import { initDB, saveMetricEncrypted, saveJWT } from './lib/db'
import { initSodium } from './lib/encryption'
import type { MetricsObject, Recommendations, MetricScore, MetricName } from '@/types'

/**
 * Initialize default metrics with middle value (5)
 * Used for fresh app state
 */
function getInitialMetrics(): MetricsObject {
  const initial: Partial<MetricsObject> = {}
  for (const metricName of Object.keys(settingsData)) {
    initial[metricName as MetricName] = 5 as MetricScore
  }
  return initial as MetricsObject
}

/**
 * Root App Component
 * 
 * Manages global app state and initializes background services
 * Coordinates between UI components and data storage
 * 
 * @returns Rendered application UI
 */
export default function App(): JSX.Element {
  /** App initialization state */
  const [isReady, setIsReady] = useState(false)

  /** Current user's JWT token (from Supabase) */
  const [userJwt, setUserJwt] = useState<string | null>(null)

  /** Current metric scores (controlled state) */
  const [metrics, setMetrics] = useState<MetricsObject>(getInitialMetrics())

  /** Generated recommendations based on current metrics */
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null)

  /** Plaintext view visibility state */
  const [showPlaintext, setShowPlaintext] = useState(false)

  /**
   * Initialize app services on mount
   * - IndexedDB setup
   * - Encryption initialization
   * - Listen for online/offline events
   */
  useEffect(() => {
    async function initializeApp(): Promise<void> {
      try {
        // Initialize database and encryption
        await initDB()
        await initSodium()

        // Try to load existing JWT (POC: not yet fully implemented)
        // const jwt = await getJWT()
        // if (jwt) setUserJwt(jwt)

        setIsReady(true)
      } catch (error) {
        console.error('Failed to initialize app:', error)
        // Still mark as ready to allow offline use
        setIsReady(true)
      }
    }

    initializeApp()

    // Listen for online/offline events for future sync implementation
    const handleOnline = () => {
      console.log('App is online - ready for sync')
      // TODO: Trigger background sync to Supabase
    }

    const handleOffline = () => {
      console.log('App is offline - using local data')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup listeners
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  /**
   * Recalculate recommendations whenever metrics change
   * This keeps the support suggestions in sync with current state
   */
  useEffect(() => {
    setRecommendations(generateRecommendations(metrics))
  }, [metrics])

  /**
   * Handle metric value change
   * - Updates controlled state
   * - Saves encrypted log entry
   * 
   * @param metricName - Name of the metric being changed
   * @param newScore - New score value (0-10)
   */
  async function handleMetricChange(
    metricName: MetricName,
    newScore: MetricScore
  ): Promise<void> {
    // Update state
    setMetrics((prev) => ({
      ...prev,
      [metricName]: newScore
    }))

    // Save encrypted log entry
    try {
      await saveMetricEncrypted({
        ...metrics,
        [metricName]: newScore
      } as MetricsObject)
    } catch (error) {
      console.error('Failed to save metric:', error)
      // Continue operation even if save fails (offline tolerance)
    }
  }

  /**
   * Export current metric values as CSV
   * Useful for sharing settings with healthcare providers, teachers, etc.
   */
  async function handleExportCSV(): Promise<void> {
    const header = ['Metric', 'Score', 'Description']
    const rows: string[] = [header.join(',')]

    // Build CSV rows from current metrics
    for (const [metricName, score] of Object.entries(metrics)) {
      // Use index access to avoid TypeScript key matching issues with JSON imports
      const metricData = (settingsData as Record<string, unknown[]>)[metricName]
      const description = (metricData as any)?.[score]?.description ?? ''

      // Escape quotes in description for CSV format
      const escapedDesc = description.replace(/"/g, '""')
      const row = [metricName, String(score), `"${escapedDesc}"`]
      rows.push(row.join(','))
    }

    // Create and download blob
    const csvContent = rows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `spectrum-settings-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    // Cleanup
    URL.revokeObjectURL(url)
  }

  /**
   * Handle successful login
   * Stores JWT and updates authentication state
   * 
   * @param jwt - JWT token from Supabase
   */
  async function handleLogin(jwt: string): Promise<void> {
    try {
      await saveJWT(jwt)
      setUserJwt(jwt)
    } catch (error) {
      console.error('Failed to save JWT:', error)
    }
  }

  // Show loading state while initializing
  if (!isReady) {
    return <div className="container">Loading app...</div>
  }

  // Render main application
  return (
    <div className="container">
      {/* Auth Button - Top Right (responsive positioning) */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 50 }}>
        <AuthButton jwt={userJwt} onLogin={handleLogin} />
      </div>

      <h1>My Spectrum Settings</h1>
      <p style={{ fontSize: 'clamp(0.9em, 2.5vw, 1.05em)', color: '#4b5563', lineHeight: '1.6', marginTop: '12px' }}>
        <strong>Understand Your Neurodiversity Profile</strong> — This tool helps you explore your neurodiversity across six key dimensions: Focus, Social Interaction, Sensory Sensitivity, Motor Skills, Routine Preference, and Emotional Regulation. By adjusting these metrics from 0-10, you get personalized support strategies and resources tailored to your specific profile. Whether you're a parent, teacher, caregiver, or individual exploring your own neurodiversity, this tool provides evidence-based recommendations to help create more supportive environments. Your data stays private on your device, and signing in lets you save your personalized profile across all devices.
      </p>

      {/* Metrics Grid */}
      <section aria-label="Neurodiversity Metrics">
        <h2>Metrics</h2>
        <div className="grid">
          {Object.keys(settingsData).map((metricName) => {
            // Use index access to avoid TypeScript key matching issues
            const metricValues = (settingsData as Record<string, unknown[]>)[metricName] as Array<{
              score: number
              description: string
            }>
            return (
              <MetricSlider
                key={metricName}
                category={metricName}
                values={metricValues}
                value={metrics[metricName as MetricName]}
                onChange={(newScore) =>
                  handleMetricChange(metricName as MetricName, newScore)
                }
              />
            )
          })}
        </div>
      </section>

      {/* Support Recommendations */}
      {/* Button section below metrics */}
      <section style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={handleExportCSV} className="btn">
          📥 Export CSV
        </button>

        <SupportRecommendations recommendations={recommendations} metrics={metrics} />

        <button 
          onClick={() => {
            setShowPlaintext(!showPlaintext)
            if (!showPlaintext) {
              // Scroll to plaintext section after a brief delay to allow state update
              setTimeout(() => {
                const plaintextSection = document.querySelector('.plaintext-section')
                plaintextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 100)
            }
          }}
          className="btn"
          style={{ background: '#8b5cf6' }}
        >
          📋 Show Copy & Paste Text
        </button>
      </section>

      {/* Plaintext view for easy copying - Only shown when button is clicked */}
      {showPlaintext && (
        <section className="plaintext-section" style={{ marginTop: 30 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Plaintext metrics (select &amp; copy):
          </label>
          <pre className="plaintext" aria-live="polite" aria-label="Current metrics in plaintext">
            {Object.keys(metrics)
              .map((k) => {
                const metricName = k as MetricName
                const score = metrics[metricName]
                const metricData = (settingsData as Record<string, unknown[]>)[k]
                const description = (metricData as any)?.[score]?.description ?? 'No description'
                return `${metricName}: ${score}\n  ${description}`
              })
              .join('\n\n')}
          </pre>
        </section>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e5e7eb', color: '#666', fontSize: '0.85em' }}>
        <p>
          💚 <strong>Your privacy matters</strong>: Metric data is encrypted locally on your device.
          No data is sent anywhere unless you explicitly enable Supabase sync in your environment.
        </p>
        <p>This is a proof-of-concept. For production use, review security settings and enable full authentication.</p>
      </footer>
    </div>
  )
}
