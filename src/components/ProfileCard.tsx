/**
 * @file components/ProfileCard.tsx
 * @description Read-only profile card for viewing mode
 * 
 * Displays a metric's value as a non-interactive visual card
 * Used in the viewing mode for shared profiles
 * 
 * Features:
 * - Visual progress bar (no slider/editing)
 * - Support level indicator
 * - Description text
 * - Accessible with proper ARIA attributes
 */

import type { MetricScore } from '@/types'
import { getMetricEmoji, getSupportInfo, MAX_METRIC_SCORE } from '@/lib/metrics'

interface ProfileCardProps {
  /**
   * Display name of the metric (e.g., "Focus")
   */
  name: string

  /**
   * Current metric score (0-5)
   */
  score: MetricScore

  /**
   * Description text for this score level
   */
  description: string

  /**
   * Optional color theme override
   */
  colorIndex?: number
}

/**
 * Get metric color class for ProfileCard styling
 */
function getProfileCardColorClass(name: string): string {
  const colorMap: Record<string, string> = {
    'Focus': 'profile-card--focus',
    'Social Interaction': 'profile-card--social',
    'Sensory Sensitivity': 'profile-card--sensory',
    'Motor Skills': 'profile-card--motor',
    'Routine Preference': 'profile-card--routine',
    'Emotional Regulation': 'profile-card--emotional'
  }
  return colorMap[name] || ''
}

/**
 * ProfileCard Component
 * 
 * Non-interactive card displaying a single metric's current state
 */
export default function ProfileCard({
  name,
  score,
  description
}: ProfileCardProps): JSX.Element {
  const supportInfo = getSupportInfo(score)
  const colorClass = getProfileCardColorClass(name)
  const emoji = getMetricEmoji(name)
  const progressPercent = (score / MAX_METRIC_SCORE) * 100

  return (
    <article 
      className={`profile-card ${colorClass}`}
      role="article"
      aria-label={`${name}: ${score} out of ${MAX_METRIC_SCORE}, ${supportInfo.label.toLowerCase()} support level`}
    >
      {/* Header with name and score badge */}
      <header className="profile-card__header">
        <div className="profile-card__title-group">
          <span className="profile-card__emoji" aria-hidden="true">{emoji}</span>
          <h3 className="profile-card__title">{name}</h3>
        </div>
        <div className="profile-card__score-badge" aria-hidden="true">
          {score}
        </div>
      </header>

      {/* Visual progress bar */}
      <div className="profile-card__progress-wrapper">
        <div 
          className="profile-card__progress-bar"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-label={`${name} score: ${score} out of 5`}
        >
          <div 
            className="profile-card__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="profile-card__score-text">{score}/5</span>
      </div>

      {/* Support level badge */}
      <div 
        className="profile-card__support-badge"
        style={{ 
          backgroundColor: supportInfo.bgColor,
          color: supportInfo.color
        }}
      >
        {supportInfo.label}
      </div>

      {/* Description */}
      <p className="profile-card__description">
        {description}
      </p>
    </article>
  )
}
