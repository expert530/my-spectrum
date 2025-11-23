/**
 * @file components/ShareModal.tsx
 * @description Modal component for generating shareable QR codes
 * 
 * Features:
 * - Generates QR code from current metrics
 * - Optional name field to personalize the share
 * - Creates URL with query string parameters
 * - Displays shareable link for copying
 */

import { useState, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { MetricsObject, MetricName } from '@/types'

interface ShareModalProps {
  metrics: MetricsObject
  isOpen: boolean
  onClose: () => void
}

/**
 * Map metric names to short keys for URL query strings
 * Keeps URLs shorter and cleaner
 */
const METRIC_KEY_MAP: Record<MetricName, string> = {
  'Focus': 'f',
  'Social Interaction': 'si',
  'Sensory Sensitivity': 'ss',
  'Motor Skills': 'ms',
  'Routine Preference': 'rp',
  'Emotional Regulation': 'er'
}

/**
 * Reverse map for decoding query strings back to metric names
 */
export const KEY_METRIC_MAP: Record<string, MetricName> = {
  'f': 'Focus',
  'si': 'Social Interaction',
  'ss': 'Sensory Sensitivity',
  'ms': 'Motor Skills',
  'rp': 'Routine Preference',
  'er': 'Emotional Regulation'
}

/**
 * Generate a shareable URL with metrics as query parameters
 */
export function generateShareUrl(metrics: MetricsObject, name?: string): string {
  const baseUrl = window.location.origin + window.location.pathname
  const params = new URLSearchParams()
  
  // Add name if provided
  if (name?.trim()) {
    params.set('name', name.trim())
  }
  
  // Add all metrics with short keys
  for (const [metricName, score] of Object.entries(metrics)) {
    const key = METRIC_KEY_MAP[metricName as MetricName]
    if (key) {
      params.set(key, String(score))
    }
  }
  
  return `${baseUrl}?${params.toString()}`
}

/**
 * ShareModal Component
 * 
 * Displays a modal with QR code for sharing current metrics
 */
export default function ShareModal({
  metrics,
  isOpen,
  onClose
}: ShareModalProps): JSX.Element | null {
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  
  // Generate shareable URL based on current metrics and name
  const shareUrl = useMemo(() => {
    return generateShareUrl(metrics, name)
  }, [metrics, name])
  
  /**
   * Copy URL to clipboard
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
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="modal share-modal" role="dialog" aria-labelledby="share-modal-title">
        <div className="modal-content">
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close share modal"
          >
            ✕
          </button>
          
          <h2 id="share-modal-title">📱 Share Your Settings</h2>
          
          <p className="share-description">
            Generate a QR code to share your spectrum settings. Others can scan it 
            to instantly load your profile.
          </p>
          
          {/* Name Input */}
          <div className="share-name-input">
            <label htmlFor="share-name">
              Name (optional)
            </label>
            <input
              id="share-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={50}
            />
          </div>
          
          {/* QR Code Display */}
          <div className="qr-code-container">
            <QRCodeSVG
              value={shareUrl}
              size={200}
              level="M"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1f2937"
            />
            {name && (
              <p className="qr-name-label">
                {name}'s Spectrum Settings
              </p>
            )}
          </div>
          
          {/* Shareable URL */}
          <div className="share-url-section">
            <label htmlFor="share-url">Shareable Link</label>
            <div className="share-url-container">
              <input
                id="share-url"
                type="text"
                value={shareUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={handleCopyUrl}
                className="btn copy-btn"
                title="Copy link to clipboard"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
          
          {/* Current Metrics Summary */}
          <div className="share-metrics-summary">
            <h3>Current Settings</h3>
            <div className="metrics-list">
              {Object.entries(metrics).map(([metricName, score]) => (
                <div key={metricName} className="metric-item">
                  <span className="metric-name">{metricName}</span>
                  <span className="metric-score">{score}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="share-privacy-note">
            🔒 The QR code contains only your metric scores{name ? ' and name' : ''}. 
            No personal data is stored on any server.
          </p>
        </div>
      </div>
    </>
  )
}
