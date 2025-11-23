/**
 * @file lib/sharing.ts
 * @description Utilities for sharing functionality - CSV generation, URL parsing, plaintext
 */

import type { MetricsObject, Recommendations, MetricName } from '@/types'

/**
 * Resource type for CSV export
 */
interface Resource {
  title: string
  url: string
  description: string
}

/**
 * Settings data type for metric descriptions
 */
interface MetricLevelData {
  score: number
  description: string
}

/**
 * Get support level label based on score (0-5 scale)
 */
export function getSupportLevel(score: number): string {
  if (score <= 1) return 'High Support'
  if (score <= 3) return 'Moderate'
  return 'Independent'
}

/**
 * Escape a string for CSV (double quotes become double-double quotes)
 */
export function escapeCSV(str: string): string {
  return str.replace(/"/g, '""')
}

/**
 * Generate CSV content from metrics, recommendations, and resources
 */
export function generateCSVContent(
  metrics: MetricsObject,
  settingsData: Record<string, MetricLevelData[]>,
  recommendations: Recommendations | null,
  parentResources: Resource[],
  teacherResources: Resource[]
): string {
  const rows: string[] = []
  const currentDate = new Date().toLocaleDateString()

  // Header section
  rows.push('My Spectrum Report')
  rows.push(`Generated: ${currentDate}`)
  rows.push('')

  // Metrics section
  rows.push('=== METRICS ===')
  rows.push('Metric,Score,Level,Description')
  
  for (const [metricName, score] of Object.entries(metrics)) {
    const metricData = settingsData[metricName]
    const description = metricData?.[score]?.description ?? ''
    const level = getSupportLevel(score)
    const escapedDesc = escapeCSV(description)
    rows.push(`"${metricName}",${score},"${level}","${escapedDesc}"`)
  }
  rows.push('')

  // Recommendations section
  rows.push('=== SUPPORT STRATEGIES ===')
  if (recommendations) {
    // Deduplicate by strategy text
    const seenTexts = new Set<string>()
    const allStrategies = [...recommendations.parent, ...recommendations.teacher].filter(s => {
      if (seenTexts.has(s.text)) return false
      seenTexts.add(s.text)
      return true
    })
    allStrategies.forEach((strategy, idx) => {
      const escapedStrategy = escapeCSV(strategy.text)
      rows.push(`${idx + 1},"${escapedStrategy}"`)
    })
  }
  rows.push('')

  // Resources section
  rows.push('=== RESOURCES FOR PARENTS & CAREGIVERS ===')
  rows.push('Resource,URL,Description')
  parentResources.forEach(resource => {
    const escapedTitle = escapeCSV(resource.title)
    const escapedDesc = escapeCSV(resource.description)
    rows.push(`"${escapedTitle}","${resource.url}","${escapedDesc}"`)
  })
  rows.push('')

  rows.push('=== RESOURCES FOR EDUCATORS ===')
  rows.push('Resource,URL,Description')
  teacherResources.forEach(resource => {
    const escapedTitle = escapeCSV(resource.title)
    const escapedDesc = escapeCSV(resource.description)
    rows.push(`"${escapedTitle}","${resource.url}","${escapedDesc}"`)
  })

  return rows.join('\n')
}

/**
 * Generate plaintext representation of metrics
 */
export function generatePlaintext(
  metrics: MetricsObject,
  settingsData: Record<string, MetricLevelData[]>
): string {
  return Object.keys(metrics)
    .map((k) => {
      const metricName = k as MetricName
      const score = metrics[metricName]
      const metricData = settingsData[k]
      const description = metricData?.[score]?.description ?? 'No description'
      return `${metricName}: ${score}\n  ${description}`
    })
    .join('\n\n')
}

/**
 * URL parameter key to metric name mapping
 */
export const KEY_METRIC_MAP: Record<string, MetricName> = {
  f: 'Focus',
  si: 'Social Interaction',
  ss: 'Sensory Sensitivity',
  ms: 'Motor Skills',
  rp: 'Routine Preference',
  er: 'Emotional Regulation'
}

/**
 * Metric name to URL parameter key mapping (reverse)
 */
export const METRIC_KEY_MAP: Record<MetricName, string> = {
  'Focus': 'f',
  'Social Interaction': 'si',
  'Sensory Sensitivity': 'ss',
  'Motor Skills': 'ms',
  'Routine Preference': 'rp',
  'Emotional Regulation': 'er'
}

/**
 * Parse URL query parameters to extract metrics and name
 * Returns null if no metrics are present in the URL
 */
export function parseUrlMetrics(searchParams: string): { metrics: Partial<MetricsObject>; name: string | null } | null {
  const params = new URLSearchParams(searchParams)
  const metrics: Partial<MetricsObject> = {}
  let hasMetrics = false
  
  // Parse each metric from query string (0-5 scale)
  for (const [key, metricName] of Object.entries(KEY_METRIC_MAP)) {
    const value = params.get(key)
    if (value !== null) {
      const score = parseInt(value, 10)
      if (score >= 0 && score <= 5) {
        metrics[metricName] = score as MetricsObject[typeof metricName]
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
 * Validate CSV structure - checks for proper formatting
 */
export function validateCSVStructure(csv: string): {
  valid: boolean
  hasHeader: boolean
  hasMetrics: boolean
  hasStrategies: boolean
  hasParentResources: boolean
  hasEducatorResources: boolean
  rowCount: number
} {
  const lines = csv.split('\n')
  
  return {
    valid: lines.length > 10,
    hasHeader: lines[0] === 'My Spectrum Report',
    hasMetrics: csv.includes('=== METRICS ==='),
    hasStrategies: csv.includes('=== SUPPORT STRATEGIES ==='),
    hasParentResources: csv.includes('=== RESOURCES FOR PARENTS & CAREGIVERS ==='),
    hasEducatorResources: csv.includes('=== RESOURCES FOR EDUCATORS ==='),
    rowCount: lines.length
  }
}
