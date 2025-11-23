/**
 * @file components/SupportRecommendations.tsx
 * @description Modal component for displaying personalized support strategies and resources
 * 
 * Features:
 * - Single unified button for all users (parents, teachers, caregivers)
 * - Modal dialog with strategies and curated resources
 * - Links open in new tabs for non-intrusive browsing
 */

import { useState } from 'react'
import { getRelevantResources } from '@/data/resources'
import type { Recommendations, MetricsObject } from '@/types'

interface SupportRecommendationsProps {
  /**
   * Generated recommendations based on current metrics
   * Contains parent and teacher strategies
   */
  recommendations: Recommendations | null

  /**
   * Current metric scores
   * Used to determine relevant resources
   */
  metrics: MetricsObject
}

/**
 * SupportRecommendations Component
 * 
 * Displays a modal with evidence-based strategies and curated resources
 * Combines parent and teacher strategies for a unified recommendation experience
 * 
 * @param props - Component props
 * @returns Modal trigger button and modal dialog, or null if no recommendations
 */
export default function SupportRecommendations({
  recommendations,
  metrics
}: SupportRecommendationsProps): JSX.Element | null {
  /** Modal visibility state */
  const [showModal, setShowModal] = useState(false)

  /** Get curated resources for current metrics */
  const resources = getRelevantResources(metrics)

  // Don't render if no recommendations available
  if (!recommendations || (!recommendations.parent.length && !recommendations.teacher.length)) {
    return null
  }

  // Combine and deduplicate strategies from both audiences
  const allStrategies = [
    ...new Set([...recommendations.parent, ...recommendations.teacher])
  ]

  return (
    <>
      {/* CTA Button - rendered inline in parent's button section */}
      <button
        className="support-btn help-btn"
        onClick={() => setShowModal(true)}
        aria-label="View personalized support strategies"
      >
        💡 How can I help?
      </button>

      {/* Modal Backdrop (semi-transparent overlay) */}
      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowModal(false)}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Unified Support Modal */}
      {showModal && (
        <div
          className="modal support-modal"
          role="dialog"
          aria-labelledby="support-modal-title"
          aria-modal="true"
        >
          <div className="modal-content">
            {/* Close Button */}
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <h2 id="support-modal-title">💡 Personalized Support Strategies</h2>
            <p className="modal-intro">
              Based on the current settings, here are evidence-based strategies to provide better
              support across all environments.
            </p>

            {/* Strategies Section */}
            <div className="modal-section">
              <h3>Key Strategies</h3>
              <ul className="modal-list">
                {allStrategies.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Resources Section */}
            <div className="modal-section">
              <h3>Resources & Further Learning</h3>
              <p className="resource-intro">Explore these trusted, evidence-based resources:</p>
              <ul className="resource-list">
                {/* Combine and display all resources */}
                {[...resources.parent, ...resources.teacher].map((resource, idx) => (
                  <li key={idx} className="resource-item">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      {resource.title} ↗
                    </a>
                    <p className="resource-description">{resource.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
