/**
 * @file components/MetricSlider.tsx
 * @description Slider component for adjusting individual neurodiversity metrics (0-10)
 * 
 * Features:
 * - Controlled component (value from parent)
 * - Displays current score and description
 * - Animated badge on value change
 * - Semantic HTML for accessibility
 */

import React, { useEffect, useState } from 'react'
import type { MetricScore } from '@/types'

interface MetricLevelValue {
  score: number
  description: string
}

interface MetricSliderProps {
  /**
   * Display name of the metric (e.g., "Focus")
   */
  category: string

  /**
   * Array of value objects with score and description
   * Index corresponds to the score (0-10)
   */
  values: MetricLevelValue[]

  /**
   * Current metric score (controlled value from parent)
   */
  value: MetricScore

  /**
   * Callback when user changes slider
   * Called with new score value
   */
  onChange: (newValue: MetricScore) => void
}

/**
 * Get emoji for metric category
 * @param category - The metric name
 * @returns Emoji string
 */
function getMetricEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Focus': '🎯',
    'Social Interaction': '👥',
    'Sensory Sensitivity': '👂',
    'Motor Skills': '🤸',
    'Routine Preference': '📅',
    'Emotional Regulation': '😌'
  }
  return emojiMap[category] || '✨'
}

/**
 * MetricSlider Component
 * 
 * Provides an interactive slider for adjusting metrics with visual feedback
 * The badge animates when the value changes to draw user attention
 * 
 * @param props - Component props
 * @returns Rendered metric slider card
 */
export default function MetricSlider({
  category,
  values,
  value,
  onChange
}: MetricSliderProps): JSX.Element {
  /** Local animation state */
  const [isAnimating, setIsAnimating] = useState(false)

  /** Timeout ID for clearing animation */
  let animationTimeout: ReturnType<typeof setTimeout> | null = null

  /**
   * Cleanup animation timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout)
      }
    }
  }, [])

  /**
   * Trigger animation when value changes
   */
  useEffect(() => {
    if (isAnimating) {
      animationTimeout = setTimeout(() => setIsAnimating(false), 600)
      return () => {
        if (animationTimeout) clearTimeout(animationTimeout)
      }
    }
    // No cleanup needed when isAnimating is false
    return undefined
  }, [isAnimating])

  /**
   * Handle slider input change
   * Updates local state and notifies parent via onChange callback
   */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = Number(event.target.value) as MetricScore
    setIsAnimating(true)
    onChange(newValue)
  }

  // Get description for current value
  const description =
    values && values[value] ? values[value].description : 'No description available'

  return (
    <div className="card">
      <div className="card-head">
        <h4 className="card-title">{getMetricEmoji(category)} {category}</h4>
        {/* Badge shows current score and animates on change */}
        <div className={`badge ${isAnimating ? 'badge-anim' : ''}`}>{value}</div>
      </div>

      <div className="card-body">
        {/* Range slider: 0-10 */}
        <input
          className="slider"
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={handleChange}
          aria-label={`${category} metric slider`}
        />
        {/* Description text for current score level */}
        <div className="desc">
          <small>{description}</small>
        </div>
      </div>
    </div>
  )
}
