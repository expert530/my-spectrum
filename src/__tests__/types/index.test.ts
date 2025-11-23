/**
 * @file types/index.test.ts
 * @description Unit tests for type definitions and type guards
 */

import { describe, it, expect } from 'vitest'
import type { MetricScore, MetricName, MetricsObject, SupportLevel } from '@/types'

describe('Type Definitions', () => {
  describe('MetricScore', () => {
    it('should allow valid scores 0-5', () => {
      const validScores: MetricScore[] = [0, 1, 2, 3, 4, 5]
      expect(validScores.length).toBe(6)
    })
  })

  describe('MetricName', () => {
    it('should include all 6 metric names', () => {
      const metricNames: MetricName[] = [
        'Focus',
        'Social Interaction',
        'Sensory Sensitivity',
        'Motor Skills',
        'Routine Preference',
        'Emotional Regulation'
      ]
      expect(metricNames.length).toBe(6)
    })
  })

  describe('SupportLevel', () => {
    it('should include all 3 support levels', () => {
      const supportLevels: SupportLevel[] = ['highNeed', 'moderate', 'independent']
      expect(supportLevels.length).toBe(3)
    })
  })

  describe('MetricsObject', () => {
    it('should be constructable with all metric names', () => {
      const metrics: MetricsObject = {
        'Focus': 2,
        'Social Interaction': 2,
        'Sensory Sensitivity': 2,
        'Motor Skills': 2,
        'Routine Preference': 2,
        'Emotional Regulation': 2
      }
      
      expect(Object.keys(metrics).length).toBe(6)
      expect(metrics['Focus']).toBe(2)
    })
  })
})

describe('Helper Functions for Types', () => {
  /**
   * Type guard to check if a value is a valid MetricScore
   */
  function isValidMetricScore(value: number): value is MetricScore {
    return Number.isInteger(value) && value >= 0 && value <= 5
  }

  /**
   * Type guard to check if a string is a valid MetricName
   */
  function isValidMetricName(value: string): value is MetricName {
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
   * Get support level from score (0-5 scale)
   */
  function getSupportLevel(score: MetricScore): SupportLevel {
    if (score <= 1) return 'highNeed'
    if (score <= 3) return 'moderate'
    return 'independent'
  }

  describe('isValidMetricScore', () => {
    it('should return true for valid scores', () => {
      expect(isValidMetricScore(0)).toBe(true)
      expect(isValidMetricScore(2)).toBe(true)
      expect(isValidMetricScore(5)).toBe(true)
    })

    it('should return false for invalid scores', () => {
      expect(isValidMetricScore(-1)).toBe(false)
      expect(isValidMetricScore(6)).toBe(false)
      expect(isValidMetricScore(2.5)).toBe(false)
    })
  })

  describe('isValidMetricName', () => {
    it('should return true for valid metric names', () => {
      expect(isValidMetricName('Focus')).toBe(true)
      expect(isValidMetricName('Social Interaction')).toBe(true)
      expect(isValidMetricName('Motor Skills')).toBe(true)
    })

    it('should return false for invalid metric names', () => {
      expect(isValidMetricName('Invalid')).toBe(false)
      expect(isValidMetricName('focus')).toBe(false) // case sensitive
      expect(isValidMetricName('')).toBe(false)
    })
  })

  describe('getSupportLevel', () => {
    it('should return highNeed for scores 0-1', () => {
      expect(getSupportLevel(0)).toBe('highNeed')
      expect(getSupportLevel(1)).toBe('highNeed')
    })

    it('should return moderate for scores 2-3', () => {
      expect(getSupportLevel(2)).toBe('moderate')
      expect(getSupportLevel(3)).toBe('moderate')
    })

    it('should return independent for scores 4-5', () => {
      expect(getSupportLevel(4)).toBe('independent')
      expect(getSupportLevel(5)).toBe('independent')
    })
  })
})
