/**
 * @file components/ShareModal.test.tsx
 * @description Unit tests for ShareModal and URL generation
 */

import { describe, it, expect } from 'vitest'
import { generateShareUrl, KEY_METRIC_MAP } from '@/components/ShareModal'
import type { MetricsObject } from '@/types'

describe('ShareModal', () => {
  describe('generateShareUrl', () => {
    it('should generate a valid URL with metrics', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 4,
        'Sensory Sensitivity': 3,
        'Motor Skills': 2,
        'Routine Preference': 1,
        'Emotional Regulation': 0
      }

      const url = generateShareUrl(metrics)

      expect(url).toContain('f=5')
      expect(url).toContain('si=4')
      expect(url).toContain('ss=3')
      expect(url).toContain('ms=2')
      expect(url).toContain('rp=1')
      expect(url).toContain('er=0')
    })

    it('should include name when provided', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 5,
        'Sensory Sensitivity': 5,
        'Motor Skills': 5,
        'Routine Preference': 5,
        'Emotional Regulation': 5
      }

      const url = generateShareUrl(metrics, 'John Doe')

      expect(url).toContain('name=John')
    })

    it('should trim whitespace from name', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 5,
        'Sensory Sensitivity': 5,
        'Motor Skills': 5,
        'Routine Preference': 5,
        'Emotional Regulation': 5
      }

      const url = generateShareUrl(metrics, '  Jane  ')

      expect(url).toContain('name=Jane')
    })

    it('should not include name parameter when name is empty', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 5,
        'Sensory Sensitivity': 5,
        'Motor Skills': 5,
        'Routine Preference': 5,
        'Emotional Regulation': 5
      }

      const url = generateShareUrl(metrics, '')

      expect(url).not.toContain('name=')
    })

    it('should not include name parameter when name is whitespace only', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 5,
        'Sensory Sensitivity': 5,
        'Motor Skills': 5,
        'Routine Preference': 5,
        'Emotional Regulation': 5
      }

      const url = generateShareUrl(metrics, '   ')

      expect(url).not.toContain('name=')
    })

    it('should handle minimum scores (0)', () => {
      const metrics: MetricsObject = {
        'Focus': 0,
        'Social Interaction': 0,
        'Sensory Sensitivity': 0,
        'Motor Skills': 0,
        'Routine Preference': 0,
        'Emotional Regulation': 0
      }

      const url = generateShareUrl(metrics)

      expect(url).toContain('f=0')
      expect(url).toContain('si=0')
    })

    it('should handle maximum scores (5)', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 5,
        'Sensory Sensitivity': 5,
        'Motor Skills': 5,
        'Routine Preference': 5,
        'Emotional Regulation': 5
      }

      const url = generateShareUrl(metrics)

      expect(url).toContain('f=5')
      expect(url).toContain('si=5')
    })
  })

  describe('KEY_METRIC_MAP', () => {
    it('should map all short keys to metric names', () => {
      expect(KEY_METRIC_MAP['f']).toBe('Focus')
      expect(KEY_METRIC_MAP['si']).toBe('Social Interaction')
      expect(KEY_METRIC_MAP['ss']).toBe('Sensory Sensitivity')
      expect(KEY_METRIC_MAP['ms']).toBe('Motor Skills')
      expect(KEY_METRIC_MAP['rp']).toBe('Routine Preference')
      expect(KEY_METRIC_MAP['er']).toBe('Emotional Regulation')
    })

    it('should have 6 metric mappings', () => {
      expect(Object.keys(KEY_METRIC_MAP).length).toBe(6)
    })
  })
})
