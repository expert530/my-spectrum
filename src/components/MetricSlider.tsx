/**
 * @file components/MetricSlider.tsx
 * @description Accessible slider component for adjusting individual neurodiversity metrics (0-5)
 * 
 * Features:
 * - Controlled component (value from parent)
 * - Full keyboard support (arrow keys, Home, End)
 * - WCAG 2.1 AA accessible with aria attributes
 * - Displays current score and description
 * - Animated badge on value change
 * - Semantic HTML for accessibility
 * - Inline preset buttons (Low, Medium, High)
 * - Reset to default functionality
 */

import React, { useState, useRef } from 'react'
import type { MetricScore } from '@/types'
import { getIntensityLabel, MAX_METRIC_SCORE, DEFAULT_METRIC_SCORE } from '@/lib/metrics'

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
   * Index corresponds to the score (0-5)
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
 * SVG icon components for each metric category
 * Clean, professional icons that work at any size
 */
const MetricIcons: Record<string, JSX.Element> = {
  'Focus': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  'Social Interaction': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  'Sensory Sensitivity': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  'Motor Skills': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <path d="M8 16l4 4 4-4"/>
      <line x1="5" y1="12" x2="8" y2="9"/>
      <line x1="19" y1="12" x2="16" y2="9"/>
    </svg>
  ),
  'Routine Preference': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <path d="M8 14h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 18h.01"/>
      <path d="M12 18h.01"/>
    </svg>
  ),
  'Emotional Regulation': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

/**
 * Get the SVG icon for a metric
 * @param category - The metric name
 * @returns JSX element for the icon
 */
function getMetricIcon(category: string): JSX.Element {
  return MetricIcons[category] || (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

/**
 * MetricSlider Component
 * 
 * Provides an accessible, interactive slider for adjusting metrics with visual feedback.
 * Supports keyboard navigation and preset buttons for quick adjustments.
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
  /** Track if slider is being interacted with */
  const [isActive, setIsActive] = useState(false)

  /** Ref to slider input for keyboard focus */
  const sliderRef = useRef<HTMLInputElement>(null)

  /**
   * Handle slider input change
   */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = Number(event.target.value) as MetricScore
    onChange(newValue)
  }

  /**
   * Handle keyboard input for accessibility
   * Supports: arrows, Home, End, Page Up/Down
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    const currentValue = value
    let newValue = currentValue

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        newValue = Math.min(MAX_METRIC_SCORE, currentValue + 1) as MetricScore
        event.preventDefault()
        break
      case 'ArrowDown':
      case 'ArrowLeft':
        newValue = Math.max(0, currentValue - 1) as MetricScore
        event.preventDefault()
        break
      case 'Home':
        newValue = 0 as MetricScore
        event.preventDefault()
        break
      case 'End':
        newValue = MAX_METRIC_SCORE as MetricScore
        event.preventDefault()
        break
      case 'PageUp':
        newValue = Math.min(MAX_METRIC_SCORE, currentValue + 1) as MetricScore
        event.preventDefault()
        break
      case 'PageDown':
        newValue = Math.max(0, currentValue - 1) as MetricScore
        event.preventDefault()
        break
      default:
        return
    }

    if (newValue !== currentValue) {
      onChange(newValue)
    }
  }

  /**
   * Quick preset selection
   */
  function handlePreset(preset: 'low' | 'medium' | 'high'): void {
    let newValue: MetricScore
    switch (preset) {
      case 'low':
        newValue = 1 as MetricScore
        break
      case 'medium':
        newValue = 2 as MetricScore
        break
      case 'high':
        newValue = 4 as MetricScore
        break
    }
    setIsActive(true)
    onChange(newValue)
    // Brief delay then remove active state
    setTimeout(() => setIsActive(false), 300)
  }

  /**
   * Handle reset to default (middle of 0-5)
   */
  function handleReset(): void {
    setIsActive(true)
    onChange(DEFAULT_METRIC_SCORE)
    // Brief delay then remove active state
    setTimeout(() => setIsActive(false), 300)
  }

  // Get description for current value
  const description =
    values && values[value] ? values[value].description : 'No description available'

  const intensityLabel = getIntensityLabel(value)

  return (
    <div className="card" role="region" aria-labelledby={`metric-${category}`}>
      <div className="card-head">
        <div>
          <h4 className="card-title" id={`metric-${category}`}>
            <span className="metric-icon" aria-hidden="true">
              {getMetricIcon(category)}
            </span>
            {category}
          </h4>
          <span className="intensity-label" aria-label={`Intensity: ${intensityLabel}`}>
            {intensityLabel}
          </span>
        </div>
        {/* Badge shows current score and animates when slider is active */}
        <div
          className={`badge ${isActive ? 'badge-anim' : ''}`}
          role="status"
          aria-live="polite"
          aria-label={`Score: ${value} out of 5`}
        >
          {value}
        </div>
      </div>

      <div className="card-body">
        {/* Slider with step indicators */}
        <div className="slider-wrapper">
          <input
            ref={sliderRef}
            className="slider"
            type="range"
            id={`slider-${category}`}
            min="0"
            max="5"
            step="1"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            onTouchStart={() => setIsActive(true)}
            onTouchEnd={() => setIsActive(false)}
            aria-label={`${category} metric slider`}
            aria-valuemin={0}
            aria-valuemax={5}
            aria-valuenow={value}
            aria-valuetext={`${value} out of 5, ${intensityLabel} intensity`}
            aria-describedby={`desc-${category}`}
          />
          {/* Step notches underneath */}
          <div className="slider-notches" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="slider-notch" />
            ))}
          </div>
        </div>

        {/* Description text for current score level */}
        <div className="desc" id={`desc-${category}`}>
          <small>{description}</small>
        </div>

        {/* Preset buttons for quick adjustment */}
        <div className="preset-buttons">
          <button
            className="preset-btn preset-low"
            onClick={() => handlePreset('low')}
            aria-label="Set to low intensity (1)"
            type="button"
          >
            Low
          </button>
          <button
            className="preset-btn preset-medium"
            onClick={() => handlePreset('medium')}
            aria-label="Set to medium intensity (2)"
            type="button"
          >
            Mid
          </button>
          <button
            className="preset-btn preset-high"
            onClick={() => handlePreset('high')}
            aria-label="Set to high intensity (4)"
            type="button"
          >
            High
          </button>
          <button
            className="preset-btn preset-reset"
            onClick={handleReset}
            aria-label="Reset to default"
            title="Reset to default value (2)"
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
