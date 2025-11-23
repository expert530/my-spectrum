/**
 * @file lib/recommendations.test.ts
 * @description Unit tests for the recommendation engine
 * 
 * Tests cover:
 * - Strategy generation for different score combinations
 * - Priority ordering (lowest scores get attention)
 * - Strategy deduplication
 * - Edge cases (empty metrics, all high, all low)
 */

import { describe, it, expect } from 'vitest'
import { generateRecommendations } from '@/lib/recommendations'
import type { MetricsObject, MetricScore, Strategy } from '@/types'

describe('Recommendations Engine', () => {
  // Helper to create metrics with all same score
  function createUniformMetrics(score: MetricScore): MetricsObject {
    return {
      'Focus': score,
      'Social Interaction': score,
      'Sensory Sensitivity': score,
      'Motor Skills': score,
      'Routine Preference': score,
      'Emotional Regulation': score
    }
  }

  // Helper to get all strategy texts
  function getAllStrategyTexts(strategies: Strategy[]): string {
    return strategies.map(s => s.text).join(' ').toLowerCase()
  }

  describe('generateRecommendations', () => {
    describe('Basic functionality', () => {
      it('should return recommendations with parent and teacher arrays', () => {
        const metrics = createUniformMetrics(2)
        const result = generateRecommendations(metrics)

        expect(result).toHaveProperty('parent')
        expect(result).toHaveProperty('teacher')
        expect(Array.isArray(result.parent)).toBe(true)
        expect(Array.isArray(result.teacher)).toBe(true)
      })

      it('should return non-empty arrays for valid metrics', () => {
        const metrics = createUniformMetrics(2)
        const result = generateRecommendations(metrics)

        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })

      it('should return Strategy objects with text and source', () => {
        const metrics = createUniformMetrics(2)
        const result = generateRecommendations(metrics)

        result.parent.forEach(strategy => {
          expect(strategy).toHaveProperty('text')
          expect(strategy).toHaveProperty('source')
          expect(typeof strategy.text).toBe('string')
          expect(strategy.text.length).toBeGreaterThan(0)
          expect(['CHADD', 'Understood', 'ASAN']).toContain(strategy.source)
        })
        result.teacher.forEach(strategy => {
          expect(strategy).toHaveProperty('text')
          expect(strategy).toHaveProperty('source')
          expect(typeof strategy.text).toBe('string')
          expect(strategy.text.length).toBeGreaterThan(0)
          expect(['CHADD', 'Understood', 'ASAN']).toContain(strategy.source)
        })
      })
    })

    describe('Edge cases', () => {
      it('should handle empty metrics object', () => {
        const result = generateRecommendations({} as MetricsObject)

        expect(result.parent).toEqual([])
        expect(result.teacher).toEqual([])
      })

      it('should handle null/undefined metrics gracefully', () => {
        const result1 = generateRecommendations(null as unknown as MetricsObject)
        const result2 = generateRecommendations(undefined as unknown as MetricsObject)

        expect(result1.parent).toEqual([])
        expect(result1.teacher).toEqual([])
        expect(result2.parent).toEqual([])
        expect(result2.teacher).toEqual([])
      })
    })

    describe('Score-based strategy selection', () => {
      it('should return highNeed strategies for scores 0-1', () => {
        const lowMetrics: MetricsObject = {
          'Focus': 0,
          'Social Interaction': 1,
          'Sensory Sensitivity': 0,
          'Motor Skills': 1,
          'Routine Preference': 0,
          'Emotional Regulation': 1
        }
        const result = generateRecommendations(lowMetrics)

        // Strategies should mention more intensive support approaches
        const allStrategies = getAllStrategyTexts([...result.parent, ...result.teacher])
        
        // Should contain terms associated with high support
        expect(
          allStrategies.includes('quiet') ||
          allStrategies.includes('distraction') ||
          allStrategies.includes('visual') ||
          allStrategies.includes('break') ||
          allStrategies.includes('support')
        ).toBe(true)
      })

      it('should return independent strategies for scores 4-5', () => {
        const highMetrics: MetricsObject = {
          'Focus': 4,
          'Social Interaction': 5,
          'Sensory Sensitivity': 4,
          'Motor Skills': 5,
          'Routine Preference': 4,
          'Emotional Regulation': 5
        }
        const result = generateRecommendations(highMetrics)

        // Strategies should mention independence and self-direction
        const allStrategies = getAllStrategyTexts([...result.parent, ...result.teacher])
        
        // Should contain terms associated with independence
        expect(
          allStrategies.includes('encourage') ||
          allStrategies.includes('support') ||
          allStrategies.includes('self') ||
          allStrategies.includes('choice') ||
          allStrategies.includes('independent')
        ).toBe(true)
      })

      it('should return moderate strategies for scores 2-3', () => {
        const moderateMetrics: MetricsObject = {
          'Focus': 2,
          'Social Interaction': 3,
          'Sensory Sensitivity': 2,
          'Motor Skills': 3,
          'Routine Preference': 2,
          'Emotional Regulation': 3
        }
        const result = generateRecommendations(moderateMetrics)

        // Should return strategies
        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })
    })

    describe('Priority-based selection', () => {
      it('should prioritize metrics with lower scores', () => {
        // Focus is the only low score - its strategies should appear
        const mixedMetrics: MetricsObject = {
          'Focus': 0, // Lowest - should be prioritized
          'Social Interaction': 5,
          'Sensory Sensitivity': 5,
          'Motor Skills': 5,
          'Routine Preference': 5,
          'Emotional Regulation': 5
        }
        const result = generateRecommendations(mixedMetrics)

        // Strategies should include Focus-related content
        const allStrategies = getAllStrategyTexts([...result.parent, ...result.teacher])
        expect(
          allStrategies.includes('focus') ||
          allStrategies.includes('distraction') ||
          allStrategies.includes('workspace') ||
          allStrategies.includes('timer')
        ).toBe(true)
      })

      it('should handle multiple low-scoring metrics', () => {
        const mixedMetrics: MetricsObject = {
          'Focus': 1,
          'Social Interaction': 1,
          'Sensory Sensitivity': 5,
          'Motor Skills': 5,
          'Routine Preference': 5,
          'Emotional Regulation': 5
        }
        const result = generateRecommendations(mixedMetrics)

        // Should return strategies for at least Focus and Social
        expect(result.parent.length).toBeGreaterThanOrEqual(2)
        expect(result.teacher.length).toBeGreaterThanOrEqual(2)
      })

      it('should focus on top 3 lowest-scoring metrics', () => {
        const metrics: MetricsObject = {
          'Focus': 1, // #1 priority
          'Social Interaction': 2, // #2 priority
          'Sensory Sensitivity': 3, // #3 priority
          'Motor Skills': 4, // Not prioritized
          'Routine Preference': 5, // Not prioritized
          'Emotional Regulation': 5  // Not prioritized
        }
        const result = generateRecommendations(metrics)

        // Should have reasonable number of strategies (2 per metric x 3 metrics = ~6 per audience)
        expect(result.parent.length).toBeLessThanOrEqual(12)
        expect(result.teacher.length).toBeLessThanOrEqual(12)
      })
    })

    describe('Strategy deduplication', () => {
      it('should not contain duplicate strategies within parent array', () => {
        const metrics = createUniformMetrics(2)
        const result = generateRecommendations(metrics)

        const uniqueParent = new Set(result.parent.map(s => s.text))
        expect(uniqueParent.size).toBe(result.parent.length)
      })

      it('should not contain duplicate strategies within teacher array', () => {
        const metrics = createUniformMetrics(2)
        const result = generateRecommendations(metrics)

        const uniqueTeacher = new Set(result.teacher.map(s => s.text))
        expect(uniqueTeacher.size).toBe(result.teacher.length)
      })
    })

    describe('Strategy content validation', () => {
      it('should return actionable strategies (not empty or placeholder)', () => {
        const metrics = createUniformMetrics(1)
        const result = generateRecommendations(metrics)

        result.parent.forEach(strategy => {
          expect(strategy.text.trim().length).toBeGreaterThan(10)
        })
        result.teacher.forEach(strategy => {
          expect(strategy.text.trim().length).toBeGreaterThan(10)
        })
      })

      it('should return strategies without HTML or special formatting', () => {
        const metrics = createUniformMetrics(2)
        const result = generateRecommendations(metrics)

        const allStrategies = [...result.parent, ...result.teacher]
        allStrategies.forEach(strategy => {
          expect(strategy.text).not.toMatch(/<[^>]*>/)  // No HTML tags
          expect(strategy.text).not.toMatch(/\n\n+/)     // No excessive newlines
        })
      })
    })

    describe('Boundary conditions', () => {
      it('should handle score of exactly 0', () => {
        const metrics = createUniformMetrics(0)
        const result = generateRecommendations(metrics)

        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })

      it('should handle score of exactly 5', () => {
        const metrics = createUniformMetrics(5)
        const result = generateRecommendations(metrics)

        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })

      it('should handle boundary score of 1 (high need boundary)', () => {
        const metrics = createUniformMetrics(1)
        const result = generateRecommendations(metrics)

        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })

      it('should handle boundary score of 2 (moderate boundary)', () => {
        const metrics = createUniformMetrics(2)
        const result = generateRecommendations(metrics)

        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })

      it('should handle boundary score of 4 (independent boundary)', () => {
        const metrics = createUniformMetrics(4)
        const result = generateRecommendations(metrics)

        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })
    })

    describe('All metrics coverage', () => {
      const metricNames = [
        'Focus',
        'Social Interaction',
        'Sensory Sensitivity',
        'Motor Skills',
        'Routine Preference',
        'Emotional Regulation'
      ]

      it.each(metricNames)('should generate strategies when %s is lowest', (metricName) => {
        const metrics: MetricsObject = {
          'Focus': 5,
          'Social Interaction': 5,
          'Sensory Sensitivity': 5,
          'Motor Skills': 5,
          'Routine Preference': 5,
          'Emotional Regulation': 5
        }
        // Set the target metric to low score
        metrics[metricName as keyof MetricsObject] = 0 as MetricScore

        const result = generateRecommendations(metrics)

        expect(result.parent.length).toBeGreaterThan(0)
        expect(result.teacher.length).toBeGreaterThan(0)
      })
    })
  })
})
