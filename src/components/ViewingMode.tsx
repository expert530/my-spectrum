/**
 * @file components/ViewingMode.tsx
 * @description Dedicated viewing experience for shared profiles
 * 
 * A clean, attractive, read-only view designed for caregivers, teachers,
 * and others who receive a shared profile link.
 * 
 * Features:
 * - Hero banner with profile name
 * - Read-only profile cards (no editing)
 * - Prominent "What Helps" strategies section
 * - Simplified resources
 * - CTA to create their own profile
 * - Print-friendly design
 */

import { useMemo, useState } from 'react'
import settingsData from '../data/allSettingValues.json'
import ProfileCard from './ProfileCard'
import { generateRecommendations } from '../lib/recommendations'
import { parentResources, teacherResources } from '../data/resources'
import type { MetricsObject, MetricName, Strategy } from '@/types'

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

interface ViewingModeProps {
  /**
   * The profile metrics to display
   */
  metrics: MetricsObject

  /**
   * Optional name of the person whose profile this is
   */
  profileName: string | null

  /**
   * Callback to switch to editor/create mode
   */
  onCreateOwn: () => void
}

/**
 * Get a summary sentence based on highest support needs (0-5 scale)
 */
function getProfileSummary(metrics: MetricsObject): string {
  const highSupportAreas: string[] = []
  const strengthAreas: string[] = []

  for (const [name, score] of Object.entries(metrics)) {
    if (score <= 1) {
      highSupportAreas.push(name.toLowerCase())
    } else if (score >= 4) {
      strengthAreas.push(name.toLowerCase())
    }
  }

  if (highSupportAreas.length === 0 && strengthAreas.length === 0) {
    return 'This profile shows a balanced pattern across all areas with moderate support needs.'
  }

  let summary = ''
  if (highSupportAreas.length > 0) {
    summary += `Areas needing support include ${highSupportAreas.join(', ')}. `
  }
  if (strengthAreas.length > 0) {
    summary += `Strengths include ${strengthAreas.join(', ')}.`
  }

  return summary.trim()
}

/**
 * Get all resources for display in viewing mode
 * Shows complete resource list matching the editing mode
 */
function getAllResources() {
  return {
    parent: parentResources,
    teacher: teacherResources
  }
}

/**
 * ViewingMode Component
 * 
 * A beautiful, read-only presentation of a shared neurodiversity profile
 */
export default function ViewingMode({
  metrics,
  profileName,
  onCreateOwn
}: ViewingModeProps): JSX.Element {
  // State for source info panel visibility
  const [showSourceInfo, setShowSourceInfo] = useState(false)
  // State for tooltip visibility on mobile
  const [visibleTooltip, setVisibleTooltip] = useState<number | null>(null)
  // State for active resource tab
  const [activeResourceTab, setActiveResourceTab] = useState<'parent' | 'teacher' | null>(null)

  // Generate recommendations based on metrics
  const recommendations = useMemo(() => {
    return generateRecommendations(metrics)
  }, [metrics])

  // Get profile summary
  const profileSummary = useMemo(() => {
    return getProfileSummary(metrics)
  }, [metrics])

  // All resources (matching editing mode)
  const allResources = getAllResources()

  // Combine strategies (deduplicated by text)
  const allStrategies = useMemo(() => {
    if (!recommendations) return []
    const seenTexts = new Set<string>()
    const strategies: Strategy[] = []
    for (const strategy of [...recommendations.parent, ...recommendations.teacher]) {
      if (!seenTexts.has(strategy.text)) {
        seenTexts.add(strategy.text)
        strategies.push(strategy)
      }
    }
    return strategies
  }, [recommendations])

  // Display name (sanitized)
  const displayName = profileName 
    ? profileName.slice(0, 50).replace(/[<>]/g, '') 
    : 'This Person'

  return (
    <div className="viewing-mode">
      {/* Skip link for accessibility */}
      <a href="#strategies" className="skip-link">
        Skip to support strategies
      </a>

      {/* Hero Banner */}
      <header className="viewing-header">
        <div className="viewing-header__content">
          <div className="viewing-header__icon" aria-hidden="true">
            🌈
          </div>
          <h1 className="viewing-header__title">
            {profileName ? (
              <><span className="viewing-header__name">{displayName}'s</span> Neurodiversity Profile</>
            ) : (
              <>Shared Neurodiversity Profile</>
            )}
          </h1>
          <p className="viewing-header__subtitle">
            A personalized guide to understanding and supporting unique needs
          </p>
        </div>
      </header>

      {/* Quick Summary */}
      <section className="viewing-summary" aria-label="Profile Summary">
        <div className="viewing-summary__card">
          <h2 className="viewing-summary__heading">
            <span aria-hidden="true">✨</span> At a Glance
          </h2>
          <p className="viewing-summary__text">
            {profileSummary}
          </p>
        </div>
      </section>

      {/* Profile Cards Grid */}
      <section className="viewing-profile" aria-label="Profile Metrics">
        <h2 className="viewing-section-title">
          <span aria-hidden="true">📊</span> Profile Overview
        </h2>
        <div className="viewing-profile__grid">
          {Object.keys(settingsData).map((metricName) => {
            const score = metrics[metricName as MetricName]
            const metricValues = (settingsData as Record<string, Array<{ score: number; description: string }>>)[metricName]
            const description = metricValues?.[score]?.description ?? 'No description available'

            return (
              <ProfileCard
                key={metricName}
                name={metricName}
                score={score}
                description={description}
              />
            )
          })}
        </div>
      </section>

      {/* What Helps - Hero Section */}
      <section id="strategies" className="viewing-strategies" aria-label="Support Strategies">
        <div className="viewing-strategies__header">
          <h2 className="viewing-section-title viewing-section-title--light">
            <span aria-hidden="true">💡</span> How to Help
          </h2>
          <p className="viewing-strategies__intro">
            Evidence-based strategies tailored to this profile. 
            These suggestions are based on the specific metric scores above.
          </p>
          <button 
            className="source-info-trigger source-info-trigger--light"
            onClick={() => setShowSourceInfo(!showSourceInfo)}
            aria-expanded={showSourceInfo}
            aria-controls="viewing-source-info-panel"
            title="Learn about our sources"
          >
            ℹ️ Sources
          </button>
        </div>

        {/* Source Information Panel */}
        {showSourceInfo && (
          <div id="viewing-source-info-panel" className="source-info-panel source-info-panel--dark" role="region" aria-label="Source information">
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
        
        <ul className="viewing-strategies__list">
          {allStrategies.map((strategy, idx) => (
            <li key={idx} className="viewing-strategies__item">
              <span className="viewing-strategies__check" aria-hidden="true">✓</span>
              <span className="viewing-strategies__text">{strategy.text}</span>
              <span 
                className={`strategy-source-badge strategy-source-badge--light ${visibleTooltip === idx ? 'strategy-source-badge--tooltip-visible' : ''}`}
                style={{ backgroundColor: getSourceColor(strategy.source) }}
                onClick={() => setVisibleTooltip(visibleTooltip === idx ? null : idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setVisibleTooltip(visibleTooltip === idx ? null : idx)}
              >
                {strategy.source}
                <span className="strategy-source-tooltip">{getSourceFullName(strategy.source)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Resources - Tab Style */}
      <section className="viewing-resources" aria-label="Helpful Resources">
        <h2 className="viewing-section-title">
          <span aria-hidden="true">📚</span> Learn More
        </h2>
        
        {/* Tab Headers */}
        <div className="viewing-resources__tabs">
          <button
            className={`viewing-resources__tab ${activeResourceTab === 'parent' ? 'viewing-resources__tab--active' : ''}`}
            onClick={() => setActiveResourceTab(activeResourceTab === 'parent' ? null : 'parent')}
            aria-expanded={activeResourceTab === 'parent'}
          >
            <span className="viewing-resources__tab-title">For Parents & Caregivers</span>
            <span className={`viewing-resources__chevron ${activeResourceTab === 'parent' ? 'viewing-resources__chevron--expanded' : ''}`}>
              ▼
            </span>
          </button>
          <button
            className={`viewing-resources__tab ${activeResourceTab === 'teacher' ? 'viewing-resources__tab--active' : ''}`}
            onClick={() => setActiveResourceTab(activeResourceTab === 'teacher' ? null : 'teacher')}
            aria-expanded={activeResourceTab === 'teacher'}
          >
            <span className="viewing-resources__tab-title">For Educators</span>
            <span className={`viewing-resources__chevron ${activeResourceTab === 'teacher' ? 'viewing-resources__chevron--expanded' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {/* Resources Content - Full Width Below Tabs */}
        {activeResourceTab && (
          <div className="viewing-resources__content">
            <ul className="viewing-resources__list viewing-resources__list--grid">
              {(activeResourceTab === 'parent' ? allResources.parent : allResources.teacher).map((resource, idx) => (
                <li key={idx} className="viewing-resources__item">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="viewing-resources__link"
                  >
                    {resource.title}
                    <span className="viewing-resources__arrow" aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Print Button */}
      <div className="viewing-actions">
        <button 
          onClick={() => window.print()}
          className="viewing-actions__btn viewing-actions__btn--secondary"
          aria-label="Print this profile"
        >
          <span aria-hidden="true">🖨️</span> Print Profile
        </button>
      </div>

      {/* CTA to Create Own */}
      <section className="viewing-cta" aria-label="Create Your Own">
        <div className="viewing-cta__card">
          <div className="viewing-cta__icon" aria-hidden="true">✏️</div>
          <h2 className="viewing-cta__title">Want to create your own profile?</h2>
          <p className="viewing-cta__text">
            My Spectrum is a free, privacy-first tool for understanding 
            and sharing neurodiversity profiles. No account required.
          </p>
          <button 
            onClick={onCreateOwn}
            className="viewing-cta__btn"
          >
            Create Your Own Profile
            <span aria-hidden="true"> →</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="viewing-footer">
        <p className="viewing-footer__privacy">
          <span aria-hidden="true">🔒</span> Privacy-first: All data stays on your device
        </p>
        <p className="viewing-footer__credit">
          Made with 💜 by <a href="/" onClick={(e) => { e.preventDefault(); onCreateOwn(); }}>My Spectrum</a>
        </p>
      </footer>
    </div>
  )
}
