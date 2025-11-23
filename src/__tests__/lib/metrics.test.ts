/**
 * @file lib/metrics.test.ts
 * @description Unit tests for shared metric utilities
 * 
 * Tests cover:
 * - Emoji mapping
 * - Support level calculations
 * - Intensity labels
 * - Score colors
 * - Type guards
 * - Constants validation
 */

import { describe, it, expect } from 'vitest'
import {
  getMetricEmoji,
  METRIC_EMOJI_MAP,
  getMetricColorClass,
  METRIC_COLOR_CLASS_MAP,
  getSupportInfo,
  getSupportLevelLabel,
  getSupportLevel,
  getIntensityLabel,
  getScoreColor,
  isValidMetricScore,
  isValidMetricName,
  METRIC_NAMES,
  MAX_METRIC_SCORE,
  DEFAULT_METRIC_SCORE
} from '@/lib/metrics'
import type { MetricName, MetricScore } from '@/types'

describe('Metric Utilities', () => {
  describe('Constants', () => {
    it('should have MAX_METRIC_SCORE as 5', () => {
      expect(MAX_METRIC_SCORE).toBe(5)
    })

    it('should have DEFAULT_METRIC_SCORE as 2', () => {
      expect(DEFAULT_METRIC_SCORE).toBe(2)
    })

    it('should have all 6 metric names', () => {
      expect(METRIC_NAMES).toHaveLength(6)
      expect(METRIC_NAMES).toContain('Focus')
      expect(METRIC_NAMES).toContain('Social Interaction')
      expect(METRIC_NAMES).toContain('Sensory Sensitivity')
      expect(METRIC_NAMES).toContain('Motor Skills')
      expect(METRIC_NAMES).toContain('Routine Preference')
      expect(METRIC_NAMES).toContain('Emotional Regulation')
    })
  })

  describe('getMetricEmoji', () => {
    it('should return correct emoji for each metric', () => {
      expect(getMetricEmoji('Focus')).toBe('🎯')
      expect(getMetricEmoji('Social Interaction')).toBe('👥')
      expect(getMetricEmoji('Sensory Sensitivity')).toBe('👂')
      expect(getMetricEmoji('Motor Skills')).toBe('🤸')
      expect(getMetricEmoji('Routine Preference')).toBe('📅')
      expect(getMetricEmoji('Emotional Regulation')).toBe('😌')
    })

    it('should return sparkle emoji for unknown metrics', () => {
      expect(getMetricEmoji('Unknown Metric')).toBe('✨')
      expect(getMetricEmoji('')).toBe('✨')
    })

    it('should have all metrics in METRIC_EMOJI_MAP', () => {
      for (const name of METRIC_NAMES) {
        expect(METRIC_EMOJI_MAP[name]).toBeDefined()
      }
    })
  })

  describe('getMetricColorClass', () => {
    it('should return correct class for each metric', () => {
      expect(getMetricColorClass('Focus')).toBe('metric--focus')
      expect(getMetricColorClass('Social Interaction')).toBe('metric--social')
      expect(getMetricColorClass('Sensory Sensitivity')).toBe('metric--sensory')
      expect(getMetricColorClass('Motor Skills')).toBe('metric--motor')
      expect(getMetricColorClass('Routine Preference')).toBe('metric--routine')
      expect(getMetricColorClass('Emotional Regulation')).toBe('metric--emotional')
    })

    it('should return empty string for unknown metrics', () => {
      expect(getMetricColorClass('Unknown')).toBe('')
      expect(getMetricColorClass('')).toBe('')
    })

    it('should have all metrics in METRIC_COLOR_CLASS_MAP', () => {
      for (const name of METRIC_NAMES) {
        expect(METRIC_COLOR_CLASS_MAP[name]).toBeDefined()
      }
    })
  })

  describe('getSupportInfo', () => {
    it('should return highNeed info for scores 0-1', () => {
      const info0 = getSupportInfo(0)
      const info1 = getSupportInfo(1)

      expect(info0.level).toBe('highNeed')
      expect(info0.label).toBe('High Support')
      expect(info0.color).toBe('#dc2626')
      expect(info0.bgColor).toBe('#fef2f2')

      expect(info1.level).toBe('highNeed')
      expect(info1.label).toBe('High Support')
    })

    it('should return moderate info for scores 2-3', () => {
      const info2 = getSupportInfo(2)
      const info3 = getSupportInfo(3)

      expect(info2.level).toBe('moderate')
      expect(info2.label).toBe('Moderate')
      expect(info2.color).toBe('#d97706')
      expect(info2.bgColor).toBe('#fffbeb')

      expect(info3.level).toBe('moderate')
      expect(info3.label).toBe('Moderate')
    })

    it('should return independent info for scores 4-5', () => {
      const info4 = getSupportInfo(4)
      const info5 = getSupportInfo(5)

      expect(info4.level).toBe('independent')
      expect(info4.label).toBe('Independent')
      expect(info4.color).toBe('#059669')
      expect(info4.bgColor).toBe('#ecfdf5')

      expect(info5.level).toBe('independent')
      expect(info5.label).toBe('Independent')
    })
  })

  describe('getSupportLevelLabel', () => {
    it('should return correct labels for all score ranges', () => {
      expect(getSupportLevelLabel(0)).toBe('High Support')
      expect(getSupportLevelLabel(1)).toBe('High Support')
      expect(getSupportLevelLabel(2)).toBe('Moderate')
      expect(getSupportLevelLabel(3)).toBe('Moderate')
      expect(getSupportLevelLabel(4)).toBe('Independent')
      expect(getSupportLevelLabel(5)).toBe('Independent')
    })
  })

  describe('getSupportLevel', () => {
    it('should return correct SupportLevel enum values', () => {
      expect(getSupportLevel(0)).toBe('highNeed')
      expect(getSupportLevel(1)).toBe('highNeed')
      expect(getSupportLevel(2)).toBe('moderate')
      expect(getSupportLevel(3)).toBe('moderate')
      expect(getSupportLevel(4)).toBe('independent')
      expect(getSupportLevel(5)).toBe('independent')
    })

    it('should handle boundary values correctly', () => {
      // Testing exact boundaries
      expect(getSupportLevel(1)).toBe('highNeed')
      expect(getSupportLevel(2)).toBe('moderate') // Boundary: 2 is moderate, not highNeed
      expect(getSupportLevel(3)).toBe('moderate')
      expect(getSupportLevel(4)).toBe('independent') // Boundary: 4 is independent, not moderate
    })
  })

  describe('getIntensityLabel', () => {
    it('should return Low for scores 0-1', () => {
      expect(getIntensityLabel(0)).toBe('Low')
      expect(getIntensityLabel(1)).toBe('Low')
    })

    it('should return Medium for scores 2-3', () => {
      expect(getIntensityLabel(2)).toBe('Medium')
      expect(getIntensityLabel(3)).toBe('Medium')
    })

    it('should return High for scores 4-5', () => {
      expect(getIntensityLabel(4)).toBe('High')
      expect(getIntensityLabel(5)).toBe('High')
    })
  })

  describe('getScoreColor', () => {
    it('should return red for scores 0-1 (high need)', () => {
      expect(getScoreColor(0)).toBe('#ef4444')
      expect(getScoreColor(1)).toBe('#ef4444')
    })

    it('should return amber for scores 2-3 (moderate)', () => {
      expect(getScoreColor(2)).toBe('#f59e0b')
      expect(getScoreColor(3)).toBe('#f59e0b')
    })

    it('should return green for scores 4-5 (independent)', () => {
      expect(getScoreColor(4)).toBe('#10b981')
      expect(getScoreColor(5)).toBe('#10b981')
    })
  })

  describe('isValidMetricScore', () => {
    it('should return true for valid scores 0-5', () => {
      expect(isValidMetricScore(0)).toBe(true)
      expect(isValidMetricScore(1)).toBe(true)
      expect(isValidMetricScore(2)).toBe(true)
      expect(isValidMetricScore(3)).toBe(true)
      expect(isValidMetricScore(4)).toBe(true)
      expect(isValidMetricScore(5)).toBe(true)
    })

    it('should return false for negative numbers', () => {
      expect(isValidMetricScore(-1)).toBe(false)
      expect(isValidMetricScore(-100)).toBe(false)
    })

    it('should return false for numbers greater than 5', () => {
      expect(isValidMetricScore(6)).toBe(false)
      expect(isValidMetricScore(10)).toBe(false)
      expect(isValidMetricScore(100)).toBe(false)
    })

    it('should return false for non-integer values', () => {
      expect(isValidMetricScore(2.5)).toBe(false)
      expect(isValidMetricScore(0.5)).toBe(false)
      expect(isValidMetricScore(4.9)).toBe(false)
    })

    it('should return false for NaN and Infinity', () => {
      expect(isValidMetricScore(NaN)).toBe(false)
      expect(isValidMetricScore(Infinity)).toBe(false)
      expect(isValidMetricScore(-Infinity)).toBe(false)
    })
  })

  describe('isValidMetricName', () => {
    it('should return true for all valid metric names', () => {
      expect(isValidMetricName('Focus')).toBe(true)
      expect(isValidMetricName('Social Interaction')).toBe(true)
      expect(isValidMetricName('Sensory Sensitivity')).toBe(true)
      expect(isValidMetricName('Motor Skills')).toBe(true)
      expect(isValidMetricName('Routine Preference')).toBe(true)
      expect(isValidMetricName('Emotional Regulation')).toBe(true)
    })

    it('should return false for invalid metric names', () => {
      expect(isValidMetricName('focus')).toBe(false) // lowercase
      expect(isValidMetricName('FOCUS')).toBe(false) // uppercase
      expect(isValidMetricName('Invalid')).toBe(false)
      expect(isValidMetricName('')).toBe(false)
      expect(isValidMetricName('Social')).toBe(false) // partial
    })

    it('should be case-sensitive', () => {
      expect(isValidMetricName('focus')).toBe(false)
      expect(isValidMetricName('Focus')).toBe(true)
    })
  })

  describe('Type Guard Integration', () => {
    it('should allow type narrowing with isValidMetricScore', () => {
      const maybeScore: number = 3
      if (isValidMetricScore(maybeScore)) {
        // TypeScript should recognize maybeScore as MetricScore here
        const score: MetricScore = maybeScore
        expect(score).toBe(3)
      }
    })

    it('should allow type narrowing with isValidMetricName', () => {
      const maybeName: string = 'Focus'
      if (isValidMetricName(maybeName)) {
        // TypeScript should recognize maybeName as MetricName here
        const name: MetricName = maybeName
        expect(name).toBe('Focus')
      }
    })
  })

  describe('Consistency Checks', () => {
    it('should have consistent thresholds across all support functions', () => {
      // Ensure getSupportInfo, getSupportLevel, and getSupportLevelLabel agree
      for (let score = 0; score <= 5; score++) {
        const info = getSupportInfo(score)
        const level = getSupportLevel(score)
        const label = getSupportLevelLabel(score)

        expect(info.level).toBe(level)
        expect(info.label).toBe(label)
      }
    })

    it('should have matching intensity and support level thresholds', () => {
      // Low intensity (0-1) should correspond to highNeed
      expect(getIntensityLabel(0)).toBe('Low')
      expect(getSupportLevel(0)).toBe('highNeed')
      expect(getIntensityLabel(1)).toBe('Low')
      expect(getSupportLevel(1)).toBe('highNeed')

      // Medium intensity (2-3) should correspond to moderate
      expect(getIntensityLabel(2)).toBe('Medium')
      expect(getSupportLevel(2)).toBe('moderate')
      expect(getIntensityLabel(3)).toBe('Medium')
      expect(getSupportLevel(3)).toBe('moderate')

      // High intensity (4-5) should correspond to independent
      expect(getIntensityLabel(4)).toBe('High')
      expect(getSupportLevel(4)).toBe('independent')
      expect(getIntensityLabel(5)).toBe('High')
      expect(getSupportLevel(5)).toBe('independent')
    })
  })
})
