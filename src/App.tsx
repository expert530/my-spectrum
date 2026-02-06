/**
 * @file App.tsx
 * @description Main application component for neurodiversity spectrum settings
 * 
 * Features:
 * - Interactive sliders for 6 neurodiversity metrics (0-5)
 * - Real-time support recommendations based on metric scores
 * - QR code sharing with URL query parameters
 * - CSV export of current settings
 * - Plaintext view for easy copying
 * - Load settings from shared URL
 * 
 * Architecture:
 * - Metrics are maintained in controlled component state
 * - Changes trigger recommendation recalculation
 * - Settings can be shared via QR code/URL
 */

import { useEffect, useState, useRef, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import settingsData from './data/allSettingValues.json'
import MetricSlider from './components/MetricSlider'
import { KEY_METRIC_MAP, generateShareUrl } from './components/ShareModal'
import SupportStrategiesSection from './components/SupportStrategiesSection'
import ResourcesSection from './components/ResourcesSection'
import SectionNav from './components/SectionNav'
import ViewingMode from './components/ViewingMode'
import CollapsibleSection from './components/CollapsibleSection'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import { generateRecommendations } from './lib/recommendations'
import { generateCSVContent, generatePlaintext } from './lib/sharing'
import { parentResources, teacherResources } from './data/resources'
import { DEFAULT_METRIC_SCORE, isValidMetricScore, METRIC_NAMES } from './lib/metrics'
import type { MetricsObject, Recommendations, MetricScore, MetricName } from '@/types'

/**
 * Parse URL query parameters to extract metrics and name
 * Returns null if no metrics are present in the URL
 */
function parseUrlMetrics(): { metrics: Partial<MetricsObject>; name: string | null } | null {
  const params = new URLSearchParams(window.location.search)
  const metrics: Partial<MetricsObject> = {}
  let hasMetrics = false
  
  // Parse each metric from query string
  for (const [key, metricName] of Object.entries(KEY_METRIC_MAP)) {
    const value = params.get(key)
    if (value !== null) {
      const score = parseInt(value, 10)
      if (isValidMetricScore(score)) {
        metrics[metricName] = score as MetricScore
        hasMetrics = true
      }
    }
  }
  
  // Get optional name
  const name = params.get('name')
  
  if (!hasMetrics) return null
  
  return { metrics, name }
}

/**
 * Initialize default metrics with middle value
 * Used for fresh app state
 */
function getInitialMetrics(): MetricsObject {
  const initial: Partial<MetricsObject> = {}
  for (const metricName of METRIC_NAMES) {
    initial[metricName] = DEFAULT_METRIC_SCORE
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

  /** Whether we're in viewing mode (from shared URL) */
  const [isViewingMode, setIsViewingMode] = useState(false)

  /** Current metric scores (controlled state) */
  const [metrics, setMetrics] = useState<MetricsObject>(getInitialMetrics())

  /** Generated recommendations based on current metrics */
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null)

  /** Plaintext view visibility state */
  const [showPlaintext, setShowPlaintext] = useState(false)

  /** Name input for sharing */
  const [shareName, setShareName] = useState('')

  /** Copy button feedback state */
  const [copied, setCopied] = useState(false)

  /** Whether share section bump animation has played */
  const [hasAnimatedShare, setHasAnimatedShare] = useState(false)

  /** Current view: 'edit' for editing profile, 'share' for share page */
  const [currentView, setCurrentView] = useState<'edit' | 'share'>('edit')

  /** Current legal page to show (null = main app) */
  const [legalPage, setLegalPage] = useState<'privacy' | 'terms' | null>(null)

  /** Ref for share section to observe intersection */
  const shareSectionRef = useRef<HTMLElement>(null)

  /** Name from shared URL (if present) */
  const [sharedName, setSharedName] = useState<string | null>(null)

  /** Generate shareable URL based on current metrics and name */
  const shareUrl = useMemo(() => {
    return generateShareUrl(metrics, shareName)
  }, [metrics, shareName])

  /**
   * Initialize app services on mount
   * - IndexedDB setup
   * - Encryption initialization
   * - Parse URL query parameters for shared settings
   */
  useEffect(() => {
    async function initializeApp(): Promise<void> {
      try {
        // Check for shared metrics in URL
        const urlData = parseUrlMetrics()
        if (urlData) {
          // Merge URL metrics with defaults (URL takes precedence)
          setMetrics(prev => ({
            ...prev,
            ...urlData.metrics
          }))
          if (urlData.name) {
            setSharedName(urlData.name)
          }
          // Set viewing mode when loading from shared URL
          setIsViewingMode(true)
          // Clean URL after loading (optional - keeps URL clean)
          window.history.replaceState({}, '', window.location.pathname)
        }

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
   * Intersection Observer for share section bump animation
   * Triggers once when 80% of section is visible
   */
  useEffect(() => {
    if (!shareSectionRef.current || hasAnimatedShare || currentView !== 'share') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedShare) {
            setHasAnimatedShare(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.8 }
    )

    observer.observe(shareSectionRef.current)

    return () => observer.disconnect()
  }, [hasAnimatedShare, currentView])

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
   * @param newScore - New score value (0-5)
   */
  function handleMetricChange(
    metricName: MetricName,
    newScore: MetricScore
  ): void {
    // Update state
    setMetrics((prev) => ({
      ...prev,
      [metricName]: newScore
    }))
  }

  /**
   * Dismiss the shared name banner
   */
  function handleDismissSharedName(): void {
    setSharedName(null)
  }

  /**
   * Reset all metrics to default
   */
  function handleResetAll(): void {
    const resetMetrics: Partial<MetricsObject> = {}
    for (const metricName of METRIC_NAMES) {
      resetMetrics[metricName] = DEFAULT_METRIC_SCORE
    }
    setMetrics(resetMetrics as MetricsObject)
  }

  /**
   * Switch from viewing mode to editing mode
   * Resets metrics and clears shared name
   */
  function handleSwitchToEditor(): void {
    setIsViewingMode(false)
    setSharedName(null)
    // Reset to default metrics for a fresh start
    setMetrics(getInitialMetrics())
  }

  /**
   * Export comprehensive CSV with metrics, recommendations, and resources
   * Uses the shared generateCSVContent utility for consistency
   */
  async function handleDownloadCSV(): Promise<void> {
    const csvContent = generateCSVContent(
      metrics,
      settingsData as Record<string, { score: number; description: string }[]>,
      recommendations,
      parentResources,
      teacherResources
    )

    // Create and download blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `my-spectrum-settings-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    // Cleanup
    URL.revokeObjectURL(url)
  }

  /**
   * Copy shareable URL to clipboard
   */
  async function handleCopyUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  // Show loading state while initializing
  if (!isReady) {
    return <div className="container">Loading app...</div>
  }

  // Render viewing mode for shared profiles
  if (isViewingMode) {
    return (
      <ViewingMode
        metrics={metrics}
        profileName={sharedName}
        onCreateOwn={handleSwitchToEditor}
      />
    )
  }

  // Render legal pages
  if (legalPage === 'privacy') {
    return (
      <div className="container">
        <PrivacyPolicy onBack={() => setLegalPage(null)} />
      </div>
    )
  }

  if (legalPage === 'terms') {
    return (
      <div className="container">
        <TermsOfService onBack={() => setLegalPage(null)} />
      </div>
    )
  }

  // Render main editing application
  return (
    <div className="container">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Section Navigation - minimal mode on share view */}
      {currentView === 'share' && <SectionNav minimal />}

      <main id="main-content">

      {/* Edit View - Header, Intro, Metrics, Share Prompt */}
      {currentView === 'edit' && (
        <>
          <h1>My Spectrum</h1>
          
          {/* Shared Settings Banner - shown when loading from shared URL */}
          {sharedName && (
            <div className="shared-banner" role="status">
              <span>📱 Viewing <strong>{sharedName.slice(0, 50).replace(/[<>]/g, '')}'s</strong> settings</span>
              <button 
                onClick={handleDismissSharedName}
                className="dismiss-btn"
                aria-label="Dismiss banner"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="intro-section">
            <p className="intro-tagline">Understand Your Neurodiversity Profile</p>
            <p className="intro-description">
              This tool helps you explore neurodiversity across six key dimensions: Focus, Social Interaction, Sensory Sensitivity, Motor Skills, Routine Preference, and Emotional Regulation. Adjust each metric from 0-5 to receive personalized, evidence-based support strategies tailored to your unique profile. Whether you're a parent, teacher, caregiver, or individual on your own journey, these insights can help create more supportive environments.
            </p>
          </div>

          {/* Metrics Grid */}
          <section id="metrics" aria-label="Neurodiversity Metrics">
            <div className="metrics-header">
              <h2>🎚️ My Profile</h2>
              <button 
                onClick={handleResetAll}
                className="btn btn-small reset-btn"
                title="Reset all metrics to default values"
              >
                ↺ Reset All
              </button>
            </div>
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

          {/* Ready to Share Prompt - clickable to switch to share view */}
          <button 
            className={`share-prompt share-prompt--clickable ${hasAnimatedShare ? 'share-prompt--bumped' : ''}`}
            onClick={() => {
              setCurrentView('share')
              // Use setTimeout to ensure scroll happens after view change
              setTimeout(() => window.scrollTo(0, 0), 0)
            }}
          >
            <span className="share-prompt__icon">✨</span>
            <p className="share-prompt__text">Ready to share your profile?</p>
            <span className="share-prompt__arrow">→</span>
          </button>
        </>
      )}

      {/* Share View - Full share page with back button */}
      {currentView === 'share' && (
        <>
          {/* Back to Edit Button */}
          <button 
            className="back-to-edit-btn"
            onClick={() => setCurrentView('edit')}
          >
            <span className="back-to-edit-btn__arrow">←</span>
            <span className="back-to-edit-btn__text">Edit your profile</span>
          </button>

          {/* Sharing Section - Redesigned */}
          <section 
            id="sharing" 
            ref={shareSectionRef}
            className="sharing-section" 
            aria-label="Share Your Profile"
          >
        <h2>📤 Share Your Profile</h2>
        <p className="section-description">
          Share your neurodiversity profile with teachers, therapists, family members, or anyone who supports you.
        </p>
        
        {/* Main Share Card */}
        <div className="share-card">
          {/* Name Input */}
          <div className="share-name-input">
            <label htmlFor="share-name">Name (optional)</label>
            <input
              id="share-name"
              type="text"
              value={shareName}
              onChange={(e) => setShareName(e.target.value)}
              placeholder="Enter a name to personalize..."
              maxLength={50}
            />
          </div>

          {/* Share Content - Combined view */}
          <div className="share-content">
            <p className="share-content__description">
              Share your profile via link or QR code. Anyone with access can view your settings.
            </p>
            
            {/* QR Code */}
            <div className="qr-code-container">
              <QRCodeSVG
                value={shareUrl}
                size={160}
                level="M"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#1f2937"
              />
              {shareName && (
                <p className="qr-name-label">
                  {shareName}'s Spectrum Settings
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="share-url-container">
              <button
                onClick={handleCopyUrl}
                className="btn copy-btn"
                title="Copy link to clipboard"
              >
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn preview-btn"
                title="Preview your profile in a new tab"
              >
                👁️ Preview <span className="new-tab-hint">(new tab)</span>
              </a>
            </div>
          </div>

          <p className="share-privacy-note">
            🔒 The link contains only your metric scores{shareName ? ' and name' : ''}. 
            No personal data is stored on any server.
          </p>
        </div>

        {/* Secondary Options */}
        <div className="secondary-options">
          <span className="secondary-options__label">More options:</span>
          <button 
            onClick={handleDownloadCSV}
            className="secondary-options__link"
          >
            📥 Download CSV Report
          </button>
          <button 
            onClick={() => setShowPlaintext(!showPlaintext)}
            className="secondary-options__link"
          >
            📋 {showPlaintext ? 'Hide' : 'View'} as Plain Text
          </button>
        </div>

        {/* Plaintext view for easy copying */}
        {showPlaintext && (
          <div className="plaintext-section">
            <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, fontSize: '1rem' }}>
              Select and copy this text:
            </label>
            <pre className="plaintext" aria-live="polite" aria-label="Current metrics in plaintext">
              {generatePlaintext(
                metrics,
                settingsData as Record<string, { score: number; description: string }[]>
              )}
            </pre>
          </div>
        )}
      </section>

      {/* Support Strategies Section - Collapsible */}
      <CollapsibleSection
        id="strategies"
        icon="💡"
        title="What Helps"
        previewText="Evidence-based strategies that update as you adjust your profile settings"
        defaultExpanded={false}
        className="strategies-collapsible"
      >
        <SupportStrategiesSection 
          recommendations={recommendations} 
          metrics={metrics} 
        />
      </CollapsibleSection>

      {/* Resources Section - Collapsible */}
      <CollapsibleSection
        id="resources"
        icon="📚"
        title="Learn More"
        previewText="Trusted resources and guides for parents, caregivers, and educators"
        defaultExpanded={false}
        className="resources-collapsible"
      >
        <ResourcesSection />
      </CollapsibleSection>

      {/* About Section - Collapsible */}
      <CollapsibleSection
        id="about"
        icon="💜"
        title="About This Tool"
        previewText="Why this was built, how to support the project, and how to get in touch"
        defaultExpanded={false}
        className="about-collapsible"
      >
        <div className="about-content">
          <div className="about-story">
            <h3>Why I Built This</h3>
            <p>
              As a parent of a neurodivergent child, I found it challenging to communicate 
              my child's unique needs to teachers, therapists, and family members. 
              This tool was born from that experience – a simple way to visualise and 
              share a neurodiversity profile without lengthy explanations.
            </p>
            <p>
              Full transparency: this project was largely "vibe coded" with AI assistance. 
              That said, I work in the software industry, so while the approach was experimental, 
              I've kept an eye on code quality and best practices along the way.
            </p>
            <p>
              My Spectrum is <strong>completely free</strong>, <strong>open source</strong>, 
              and <strong>privacy-first</strong>. No accounts, no tracking, no data collection. 
              Your information never leaves your device.
            </p>
          </div>

          <div className="about-support">
            <h3>Support This Project</h3>
            <p>
              If you find this tool helpful, consider supporting its development. 
              Your contribution helps keep it free and continuously improving.
            </p>
            <div className="support-buttons">
              <a 
                href="https://ko-fi.com/myspectrumsettings" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn support-btn kofi-btn"
              >
                ☕ Buy me a coffee
              </a>
            </div>
          </div>

          <div className="about-connect">
            <h3>Get In Touch</h3>
            <p>
              Have feedback, suggestions, or just want to say hello? 
              I'd love to hear from you.
            </p>
            <form 
              className="contact-form"
              action="https://api.web3forms.com/submit"
              method="POST"
            >
              <input type="hidden" name="access_key" value="06242b3b-30ed-4a0a-90dc-88e138e594b4" />
              <input type="hidden" name="subject" value="My Spectrum - Contact Form" />
              <input type="hidden" name="from_name" value="My Spectrum Contact" />
              {/* Honeypot field for spam protection */}
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input 
                  type="text" 
                  id="contact-name"
                  name="name" 
                  placeholder="Name (optional)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Your Email</label>
                <input 
                  type="email" 
                  id="contact-email"
                  name="email" 
                  placeholder="Email (optional)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message <span className="required">*</span></label>
                <textarea 
                  id="contact-message"
                  name="message" 
                  placeholder="Your message..."
                  rows={4}
                  required
                />
              </div>
              <button type="submit" className="btn action-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </CollapsibleSection>
        </>
      )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          <strong>💚 Your privacy matters:</strong> All data stays on your device.
          Nothing is sent to any server.
        </p>
        <div className="footer-meta">
          <span className="footer-version">v1.0.1</span>
          <span className="footer-divider">•</span>
          <span className="footer-updated">Last updated: February 2026</span>
          <span className="footer-divider">•</span>
          <a 
            href="https://github.com/expert530/my-spectrum" 
            className="footer-github"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>
        </div>
        <div className="footer-legal">
          <button 
            className="footer-legal-link"
            onClick={() => setLegalPage('privacy')}
          >
            Privacy Policy
          </button>
          <span className="footer-divider">•</span>
          <button 
            className="footer-legal-link"
            onClick={() => setLegalPage('terms')}
          >
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  )
}
