/**
 * @file data/resources.test.ts
 * @description Unit tests for resource data
 */

import { describe, it, expect } from 'vitest'
import { parentResources, teacherResources, getRelevantResources } from '@/data/resources'
import type { MetricsObject } from '@/types'

describe('Resources Data', () => {
  describe('parentResources', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(parentResources)).toBe(true)
      expect(parentResources.length).toBeGreaterThan(0)
    })

    it('should have valid resource structure', () => {
      parentResources.forEach(resource => {
        expect(resource).toHaveProperty('title')
        expect(resource).toHaveProperty('url')
        expect(resource).toHaveProperty('description')
        expect(typeof resource.title).toBe('string')
        expect(typeof resource.url).toBe('string')
        expect(typeof resource.description).toBe('string')
      })
    })

    it('should have valid URLs', () => {
      parentResources.forEach(resource => {
        expect(resource.url).toMatch(/^https?:\/\//)
      })
    })

    it('should have non-empty titles and descriptions', () => {
      parentResources.forEach(resource => {
        expect(resource.title.length).toBeGreaterThan(0)
        expect(resource.description.length).toBeGreaterThan(0)
      })
    })
  })

  describe('teacherResources', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(teacherResources)).toBe(true)
      expect(teacherResources.length).toBeGreaterThan(0)
    })

    it('should have valid resource structure', () => {
      teacherResources.forEach(resource => {
        expect(resource).toHaveProperty('title')
        expect(resource).toHaveProperty('url')
        expect(resource).toHaveProperty('description')
        expect(typeof resource.title).toBe('string')
        expect(typeof resource.url).toBe('string')
        expect(typeof resource.description).toBe('string')
      })
    })

    it('should have valid URLs', () => {
      teacherResources.forEach(resource => {
        expect(resource.url).toMatch(/^https?:\/\//)
      })
    })
  })

  describe('getRelevantResources', () => {
    it('should return resources by audience', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 5,
        'Sensory Sensitivity': 5,
        'Motor Skills': 5,
        'Routine Preference': 5,
        'Emotional Regulation': 5
      }

      const result = getRelevantResources(metrics)

      expect(result).toHaveProperty('parent')
      expect(result).toHaveProperty('teacher')
      expect(Array.isArray(result.parent)).toBe(true)
      expect(Array.isArray(result.teacher)).toBe(true)
    })

    it('should return all parent and teacher resources', () => {
      const metrics: MetricsObject = {
        'Focus': 5,
        'Social Interaction': 5,
        'Sensory Sensitivity': 5,
        'Motor Skills': 5,
        'Routine Preference': 5,
        'Emotional Regulation': 5
      }

      const result = getRelevantResources(metrics)

      expect(result.parent.length).toBe(parentResources.length)
      expect(result.teacher.length).toBe(teacherResources.length)
    })
  })
})
