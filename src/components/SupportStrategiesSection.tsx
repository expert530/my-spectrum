/**
 * @file components/SupportStrategiesSection.tsx
 * @description Inline section displaying personalized support strategies
 * 
 * Features:
 * - Updates dynamically based on metric scores
 * - Shows visual correlation between settings and suggestions
 * - Organized by support level (high need, moderate, independent)
 * - Source attribution tooltip for transparency
 * - Touch-friendly tooltips for mobile
 * - Collapsible sub-sections for Parents & Educators
 */

import { useState } from 'react'
import type { Recommendations, MetricsObject, Strategy } from '@/types'
import { getScoreColor, getSupportLevelLabel, MAX_METRIC_SCORE } from '@/lib/metrics'

interface SupportStrategiesSectionProps {
  /**
   * Generated recommendations based on current metrics
   */
  recommendations: Recommendations | null

  /**
   * Current metric scores for visual display
   */
  metrics: MetricsObject
}

/**
 * Get color for source badge
 */
function getSourceColor(source: Strategy['source']): string {
  switch (source) {
    case 'CHADD': return '#dc2626' // Red
    case 'Understood': return '#2563eb' // Blue
    case 'ASAN': return '#7c3aed' // Purple
    default: return '#6b7280'
  }
}

/**
 * Get full organization name for tooltip
 */
function getSourceFullName(source: Strategy['source']): string {
  switch (source) {
    case 'CHADD': return 'Children and Adults with ADHD (CDC-funded)'
    case 'Understood': return 'Understood.org — Learning Differences Resource'
    case 'ASAN': return 'Autistic Self Advocacy Network'
    default: return source
  }
}

/**
 * SupportStrategiesSection Component
 * 
 * Displays evidence-based strategies inline, updating dynamically
 */
export default function SupportStrategiesSection({
  recommendations,
  metrics
}: SupportStrategiesSectionProps): JSX.Element | null {
  const [showSourceInfo, setShowSourceInfo] = useState(false)
  const [visibleTooltip, setVisibleTooltip] = useState<number | null>(null)
  const [parentStrategiesExpanded, setParentStrategiesExpanded] = useState(false)
  const [teacherStrategiesExpanded, setTeacherStrategiesExpanded] = useState(false)

  // Don't render if no recommendations
  if (!recommendations || (!recommendations.parent.length && !recommendations.teacher.length)) {
    return null
  }

  // Get unique strategies for parents/caregivers
  const parentStrategies: Strategy[] = []
  const parentSeenTexts = new Set<string>()
  for (const strategy of recommendations.parent) {
    if (!parentSeenTexts.has(strategy.text)) {
      parentSeenTexts.add(strategy.text)
      parentStrategies.push(strategy)
    }
  }

  // Get unique strategies for educators
  const teacherStrategies: Strategy[] = []
  const teacherSeenTexts = new Set<string>()
  for (const strategy of recommendations.teacher) {
    if (!teacherSeenTexts.has(strategy.text)) {
      teacherSeenTexts.add(strategy.text)
      teacherStrategies.push(strategy)
    }
  }

  // Toggle tooltip visibility on tap (for mobile)
  const handleBadgeClick = (idx: number) => {
    setVisibleTooltip(visibleTooltip === idx ? null : idx)
  }

  return (
    <section id="strategies" className="strategies-section" aria-label="What Helps">
      <h2>💡 What Helps</h2>
      <p className="strategies-intro">
        Based on your profile, here are evidence-based strategies to provide better support.
        These update automatically as you adjust your settings.
      </p>
      <button 
        className="source-info-trigger"
        onClick={() => setShowSourceInfo(!showSourceInfo)}
        aria-expanded={showSourceInfo}
        aria-controls="source-info-panel"
        title="Learn about our sources"
      >
        ℹ️ Sources
      </button>

      {/* Source Information Panel */}
      {showSourceInfo && (
        <div id="source-info-panel" className="source-info-panel" role="region" aria-label="Source information">
          <h4>📚 Where do these strategies come from?</h4>
          <p>
            Our recommendations are informed by evidence-based practices from trusted organizations:
          </p>
          <ul className="source-list">
            <li>
              <strong>CHADD</strong> (Children and Adults with ADHD) — A nonprofit funded by the CDC's 
              National Resource Center on ADHD, providing research-backed strategies for educators and families.
            </li>
            <li>
              <strong>Understood.org</strong> — A leading resource for learning differences with 20M+ users, 
              offering expert-reviewed accommodations and support strategies.
            </li>
            <li>
              <strong>ASAN</strong> (Autistic Self Advocacy Network) — Neurodiversity-affirming approaches 
              written by and for autistic people, emphasizing acceptance and self-determination.
            </li>
          </ul>
          <p className="source-disclaimer">
            <em>Note: These strategies are general guidance, not medical advice. Every person is unique — 
            work with healthcare providers and educators to customize support plans.</em>
          </p>
        </div>
      )}

      {/* Current Profile Summary - Visual correlation */}
      <div className="profile-summary">
        <h3>Your Current Profile</h3>
        <div className="profile-metrics">
          {Object.entries(metrics).map(([name, score]) => (
            <div key={name} className="profile-metric-item">
              <div className="profile-metric-header">
                <span className="profile-metric-name">{name}</span>
                <span 
                  className="profile-metric-level"
                  style={{ color: getScoreColor(score) }}
                >
                  {getSupportLevelLabel(score)}
                </span>
              </div>
              <div className="profile-metric-bar">
                <div 
                  className="profile-metric-fill"
                  style={{ 
                    width: `${(score / MAX_METRIC_SCORE) * 100}%`,
                    backgroundColor: getScoreColor(score)
                  }}
                />
              </div>
              <span className="profile-metric-score">{score}/{MAX_METRIC_SCORE}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strategies List - Split by audience */}
      <div className="strategies-content">
        {/* For Parents & Caregivers */}
        {parentStrategies.length > 0 && (
          <div className="strategies-subsection">
            <button
              className="strategies-subsection__header"
              onClick={() => setParentStrategiesExpanded(!parentStrategiesExpanded)}
              aria-expanded={parentStrategiesExpanded}
            >
              <h3 className="strategies-subsection__title">👨‍👩‍👧 For Parents & Caregivers</h3>
              <span className={`strategies-subsection__chevron ${parentStrategiesExpanded ? 'strategies-subsection__chevron--expanded' : ''}`}>
                ▼
              </span>
            </button>
            {parentStrategiesExpanded && (
              <ul className="strategies-list">
                {parentStrategies.map((strategy, idx) => (
                  <li key={`parent-${idx}`} className="strategy-item">
                    <span className="strategy-text">{strategy.text}</span>
                    <span 
                      className={`strategy-source-badge ${visibleTooltip === idx ? 'strategy-source-badge--tooltip-visible' : ''}`}
                      style={{ backgroundColor: getSourceColor(strategy.source) }}
                      onClick={() => handleBadgeClick(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleBadgeClick(idx)}
                    >
                      {strategy.source}
                      <span className="strategy-source-tooltip">{getSourceFullName(strategy.source)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* For Educators */}
        {teacherStrategies.length > 0 && (
          <div className="strategies-subsection">
            <button
              className="strategies-subsection__header"
              onClick={() => setTeacherStrategiesExpanded(!teacherStrategiesExpanded)}
              aria-expanded={teacherStrategiesExpanded}
            >
              <h3 className="strategies-subsection__title">👩‍🏫 For Educators</h3>
              <span className={`strategies-subsection__chevron ${teacherStrategiesExpanded ? 'strategies-subsection__chevron--expanded' : ''}`}>
                ▼
              </span>
            </button>
            {teacherStrategiesExpanded && (
              <ul className="strategies-list">
                {teacherStrategies.map((strategy, idx) => (
                  <li key={`teacher-${idx}`} className="strategy-item">
                    <span className="strategy-text">{strategy.text}</span>
                    <span 
                      className={`strategy-source-badge ${visibleTooltip === (idx + 1000) ? 'strategy-source-badge--tooltip-visible' : ''}`}
                      style={{ backgroundColor: getSourceColor(strategy.source) }}
                      onClick={() => handleBadgeClick(idx + 1000)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleBadgeClick(idx + 1000)}
                    >
                      {strategy.source}
                      <span className="strategy-source-tooltip">{getSourceFullName(strategy.source)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
