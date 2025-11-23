/**
 * @file lib/metrics.ts
 * @description Shared metric utilities - icons, emojis, colors, and support level calculations
 * 
 * Centralizes metric-related helper functions to avoid duplication across components.
 */

import type { MetricName, MetricScore, SupportLevel } from '@/types'

/**
 * Map of metric names to emoji representations
 * Used for visual indicators in cards and headers
 */
export const METRIC_EMOJI_MAP: Record<MetricName, string> = {
  'Focus': '🎯',
  'Social Interaction': '👥',
  'Sensory Sensitivity': '👂',
  'Motor Skills': '🤸',
  'Routine Preference': '📅',
  'Emotional Regulation': '😌'
}

/**
 * Get emoji for a metric category
 * @param category - The metric name
 * @returns Emoji string, or sparkle for unknown metrics
 */
export function getMetricEmoji(category: string): string {
  return METRIC_EMOJI_MAP[category as MetricName] ?? '✨'
}

/**
 * CSS class names for metric-specific colors
 */
export const METRIC_COLOR_CLASS_MAP: Record<MetricName, string> = {
  'Focus': 'metric--focus',
  'Social Interaction': 'metric--social',
  'Sensory Sensitivity': 'metric--sensory',
  'Motor Skills': 'metric--motor',
  'Routine Preference': 'metric--routine',
  'Emotional Regulation': 'metric--emotional'
}

/**
 * Get the CSS class for metric-specific styling
 * @param name - The metric name
 * @returns CSS class name or empty string
 */
export function getMetricColorClass(name: string): string {
  return METRIC_COLOR_CLASS_MAP[name as MetricName] ?? ''
}

/**
 * Support level thresholds and labels (0-5 scale)
 * 0-1: High Support (needs significant assistance)
 * 2-3: Moderate (benefits from some support)
 * 4-5: Independent (manages well independently)
 */
export interface SupportInfo {
  level: SupportLevel
  label: string
  color: string
  bgColor: string
}

/**
 * Get support level information based on score (0-5 scale)
 * @param score - The metric score (0-5)
 * @returns Support level details including label and colors
 */
export function getSupportInfo(score: number): SupportInfo {
  if (score <= 1) {
    return {
      level: 'highNeed',
      label: 'High Support',
      color: '#dc2626',
      bgColor: '#fef2f2'
    }
  }
  if (score <= 3) {
    return {
      level: 'moderate',
      label: 'Moderate',
      color: '#d97706',
      bgColor: '#fffbeb'
    }
  }
  return {
    level: 'independent',
    label: 'Independent',
    color: '#059669',
    bgColor: '#ecfdf5'
  }
}

/**
 * Get support level label as string (0-5 scale)
 * @param score - The metric score (0-5)
 * @returns Human-readable support level label
 */
export function getSupportLevelLabel(score: number): string {
  return getSupportInfo(score).label
}

/**
 * Get the SupportLevel enum value from score (0-5 scale)
 * @param score - The metric score (0-5)
 * @returns SupportLevel enum value
 */
export function getSupportLevel(score: number): SupportLevel {
  if (score <= 1) return 'highNeed'
  if (score <= 3) return 'moderate'
  return 'independent'
}

/**
 * Get intensity label for a score (used in slider)
 * @param score - The metric score (0-5)
 * @returns Intensity label (Low, Medium, High)
 */
export function getIntensityLabel(score: number): string {
  if (score <= 1) return 'Low'
  if (score <= 3) return 'Medium'
  return 'High'
}

/**
 * Get color based on score level for visual indicators
 * @param score - The metric score (0-5)
 * @returns Hex color code
 */
export function getScoreColor(score: number): string {
  if (score <= 1) return '#ef4444' // red - high need
  if (score <= 3) return '#f59e0b' // amber - moderate
  return '#10b981' // green - independent
}

/**
 * Type guard to check if a value is a valid MetricScore
 * @param value - Value to check
 * @returns True if value is a valid MetricScore (0-5)
 */
export function isValidMetricScore(value: number): value is MetricScore {
  return Number.isInteger(value) && value >= 0 && value <= 5
}

/**
 * Type guard to check if a string is a valid MetricName
 * @param value - String to check
 * @returns True if value is a valid MetricName
 */
export function isValidMetricName(value: string): value is MetricName {
  const validNames: MetricName[] = [
    'Focus',
    'Social Interaction',
    'Sensory Sensitivity',
    'Motor Skills',
    'Routine Preference',
    'Emotional Regulation'
  ]
  return validNames.includes(value as MetricName)
}

/**
 * All metric names in display order
 */
export const METRIC_NAMES: MetricName[] = [
  'Focus',
  'Social Interaction',
  'Sensory Sensitivity',
  'Motor Skills',
  'Routine Preference',
  'Emotional Regulation'
]

/**
 * Maximum score value for metrics
 */
export const MAX_METRIC_SCORE = 5

/**
 * Default/initial metric score
 */
export const DEFAULT_METRIC_SCORE: MetricScore = 2
