/**
 * @file lib/sharing.test.ts
 * @description Comprehensive tests for sharing functionality
 * - CSV generation and validation
 * - URL generation and parsing
 * - Plaintext generation
 */

import { describe, it, expect } from 'vitest'
import {
  generateCSVContent,
  generatePlaintext,
  parseUrlMetrics,
  getSupportLevel,
  escapeCSV,
  validateCSVStructure,
  KEY_METRIC_MAP,
  METRIC_KEY_MAP
} from '@/lib/sharing'
import type { MetricsObject, Recommendations } from '@/types'

// Test fixtures
const defaultMetrics: MetricsObject = {
  'Focus': 2,
  'Social Interaction': 2,
  'Sensory Sensitivity': 2,
  'Motor Skills': 2,
  'Routine Preference': 2,
  'Emotional Regulation': 2
}

const mixedMetrics: MetricsObject = {
  'Focus': 1,
  'Social Interaction': 2,
  'Sensory Sensitivity': 4,
  'Motor Skills': 1,
  'Routine Preference': 3,
  'Emotional Regulation': 5
}

const mockSettingsData: Record<string, { score: number; description: string }[]> = {
  'Focus': Array.from({ length: 6 }, (_, i) => ({ score: i, description: `Focus level ${i} description` })),
  'Social Interaction': Array.from({ length: 6 }, (_, i) => ({ score: i, description: `Social level ${i} description` })),
  'Sensory Sensitivity': Array.from({ length: 6 }, (_, i) => ({ score: i, description: `Sensory level ${i} description` })),
  'Motor Skills': Array.from({ length: 6 }, (_, i) => ({ score: i, description: `Motor level ${i} description` })),
  'Routine Preference': Array.from({ length: 6 }, (_, i) => ({ score: i, description: `Routine level ${i} description` })),
  'Emotional Regulation': Array.from({ length: 6 }, (_, i) => ({ score: i, description: `Emotional level ${i} description` }))
}

const mockRecommendations: Recommendations = {
  parent: [
    { text: 'Parent strategy 1', source: 'CHADD' },
    { text: 'Parent strategy 2', source: 'Understood' },
    { text: 'Shared strategy', source: 'ASAN' }
  ],
  teacher: [
    { text: 'Teacher strategy 1', source: 'CHADD' },
    { text: 'Teacher strategy 2', source: 'Understood' },
    { text: 'Shared strategy', source: 'ASAN' }
  ]
}

const mockParentResources = [
  { title: 'Parent Resource 1', url: 'https://example.com/parent1', description: 'Description 1' },
  { title: 'Parent Resource 2', url: 'https://example.com/parent2', description: 'Description 2' }
]

const mockTeacherResources = [
  { title: 'Teacher Resource 1', url: 'https://example.com/teacher1', description: 'Description 1' },
  { title: 'Teacher Resource 2', url: 'https://example.com/teacher2', description: 'Description 2' }
]

describe('Sharing Utilities', () => {
  describe('getSupportLevel', () => {
    it('should return "High Support" for scores 0-1', () => {
      expect(getSupportLevel(0)).toBe('High Support')
      expect(getSupportLevel(1)).toBe('High Support')
    })

    it('should return "Moderate" for scores 2-3', () => {
      expect(getSupportLevel(2)).toBe('Moderate')
      expect(getSupportLevel(3)).toBe('Moderate')
    })

    it('should return "Independent" for scores 4-5', () => {
      expect(getSupportLevel(4)).toBe('Independent')
      expect(getSupportLevel(5)).toBe('Independent')
    })
  })

  describe('escapeCSV', () => {
    it('should escape double quotes', () => {
      expect(escapeCSV('Hello "World"')).toBe('Hello ""World""')
    })

    it('should handle strings without quotes', () => {
      expect(escapeCSV('Hello World')).toBe('Hello World')
    })

    it('should handle empty strings', () => {
      expect(escapeCSV('')).toBe('')
    })

    it('should handle multiple quotes', () => {
      expect(escapeCSV('"Hello" "World"')).toBe('""Hello"" ""World""')
    })
  })

  describe('generateCSVContent', () => {
    it('should generate valid CSV with all sections', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      expect(csv).toContain('My Spectrum Report')
      expect(csv).toContain('=== METRICS ===')
      expect(csv).toContain('=== SUPPORT STRATEGIES ===')
      expect(csv).toContain('=== RESOURCES FOR PARENTS & CAREGIVERS ===')
      expect(csv).toContain('=== RESOURCES FOR EDUCATORS ===')
    })

    it('should include all metrics with correct format', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      expect(csv).toContain('"Focus",2,"Moderate"')
      expect(csv).toContain('"Social Interaction",2,"Moderate"')
      expect(csv).toContain('"Sensory Sensitivity",2,"Moderate"')
      expect(csv).toContain('"Motor Skills",2,"Moderate"')
      expect(csv).toContain('"Routine Preference",2,"Moderate"')
      expect(csv).toContain('"Emotional Regulation",2,"Moderate"')
    })

    it('should include correct support levels for mixed scores', () => {
      const csv = generateCSVContent(
        mixedMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      expect(csv).toContain('"Focus",1,"High Support"')
      expect(csv).toContain('"Social Interaction",2,"Moderate"')
      expect(csv).toContain('"Sensory Sensitivity",4,"Independent"')
    })

    it('should deduplicate strategies', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      // "Shared strategy" should appear only once
      const matches = csv.match(/Shared strategy/g)
      expect(matches?.length).toBe(1)
    })

    it('should include all resources', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      expect(csv).toContain('Parent Resource 1')
      expect(csv).toContain('Parent Resource 2')
      expect(csv).toContain('Teacher Resource 1')
      expect(csv).toContain('Teacher Resource 2')
    })

    it('should handle null recommendations', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        null,
        mockParentResources,
        mockTeacherResources
      )

      expect(csv).toContain('=== SUPPORT STRATEGIES ===')
      // Should still have the section but be empty
    })

    it('should escape special characters in descriptions', () => {
      const dataWithQuotes = {
        'Focus': [{ score: 0, description: 'Description with "quotes"' }]
      }
      
      const metricsWithZero: MetricsObject = {
        ...defaultMetrics,
        'Focus': 0
      }

      const csv = generateCSVContent(
        metricsWithZero,
        { ...mockSettingsData, ...dataWithQuotes },
        null,
        [],
        []
      )

      expect(csv).toContain('""quotes""')
    })

    it('should have proper CSV header row for metrics', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      expect(csv).toContain('Metric,Score,Level,Description')
    })

    it('should have proper CSV header row for resources', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      expect(csv).toContain('Resource,URL,Description')
    })
  })

  describe('validateCSVStructure', () => {
    it('should validate a well-formed CSV', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      const validation = validateCSVStructure(csv)

      expect(validation.valid).toBe(true)
      expect(validation.hasHeader).toBe(true)
      expect(validation.hasMetrics).toBe(true)
      expect(validation.hasStrategies).toBe(true)
      expect(validation.hasParentResources).toBe(true)
      expect(validation.hasEducatorResources).toBe(true)
      expect(validation.rowCount).toBeGreaterThan(10)
    })

    it('should detect missing sections', () => {
      const incompleteCSV = 'Some random content\nNo proper sections'
      
      const validation = validateCSVStructure(incompleteCSV)

      expect(validation.hasHeader).toBe(false)
      expect(validation.hasMetrics).toBe(false)
      expect(validation.hasStrategies).toBe(false)
    })
  })

  describe('generatePlaintext', () => {
    it('should generate plaintext for all metrics', () => {
      const plaintext = generatePlaintext(defaultMetrics, mockSettingsData)

      expect(plaintext).toContain('Focus: 2')
      expect(plaintext).toContain('Social Interaction: 2')
      expect(plaintext).toContain('Sensory Sensitivity: 2')
      expect(plaintext).toContain('Motor Skills: 2')
      expect(plaintext).toContain('Routine Preference: 2')
      expect(plaintext).toContain('Emotional Regulation: 2')
    })

    it('should include descriptions', () => {
      const plaintext = generatePlaintext(defaultMetrics, mockSettingsData)

      expect(plaintext).toContain('Focus level 2 description')
      expect(plaintext).toContain('Social level 2 description')
    })

    it('should format with proper line breaks', () => {
      const plaintext = generatePlaintext(defaultMetrics, mockSettingsData)

      // Each metric should be separated by double newlines
      expect(plaintext.split('\n\n').length).toBe(6)
    })

    it('should handle missing descriptions gracefully', () => {
      const emptySettingsData: Record<string, { score: number; description: string }[]> = {}
      
      const plaintext = generatePlaintext(defaultMetrics, emptySettingsData)

      expect(plaintext).toContain('No description')
    })
  })

  describe('parseUrlMetrics', () => {
    it('should parse valid URL parameters', () => {
      const result = parseUrlMetrics('f=2&si=4&ss=1&ms=3&rp=3&er=5')

      expect(result).not.toBeNull()
      expect(result?.metrics['Focus']).toBe(2)
      expect(result?.metrics['Social Interaction']).toBe(4)
      expect(result?.metrics['Sensory Sensitivity']).toBe(1)
      expect(result?.metrics['Motor Skills']).toBe(3)
      expect(result?.metrics['Routine Preference']).toBe(3)
      expect(result?.metrics['Emotional Regulation']).toBe(5)
    })

    it('should parse name parameter', () => {
      const result = parseUrlMetrics('f=2&name=John%20Doe')

      expect(result?.name).toBe('John Doe')
    })

    it('should return null when no metrics present', () => {
      const result = parseUrlMetrics('name=John')

      expect(result).toBeNull()
    })

    it('should return null for empty string', () => {
      const result = parseUrlMetrics('')

      expect(result).toBeNull()
    })

    it('should ignore invalid scores (negative)', () => {
      const result = parseUrlMetrics('f=-1&si=3')

      expect(result?.metrics['Focus']).toBeUndefined()
      expect(result?.metrics['Social Interaction']).toBe(3)
    })

    it('should ignore invalid scores (over 5)', () => {
      const result = parseUrlMetrics('f=6&si=3')

      expect(result?.metrics['Focus']).toBeUndefined()
      expect(result?.metrics['Social Interaction']).toBe(3)
    })

    it('should handle partial metrics', () => {
      const result = parseUrlMetrics('f=2&si=4')

      expect(result).not.toBeNull()
      expect(result?.metrics['Focus']).toBe(2)
      expect(result?.metrics['Social Interaction']).toBe(4)
      expect(result?.metrics['Sensory Sensitivity']).toBeUndefined()
    })

    it('should handle edge case score 0', () => {
      const result = parseUrlMetrics('f=0')

      expect(result?.metrics['Focus']).toBe(0)
    })

    it('should handle edge case score 5', () => {
      const result = parseUrlMetrics('f=5')

      expect(result?.metrics['Focus']).toBe(5)
    })
  })

  describe('KEY_METRIC_MAP', () => {
    it('should have all 6 metric mappings', () => {
      expect(Object.keys(KEY_METRIC_MAP).length).toBe(6)
    })

    it('should map short keys to full names', () => {
      expect(KEY_METRIC_MAP['f']).toBe('Focus')
      expect(KEY_METRIC_MAP['si']).toBe('Social Interaction')
      expect(KEY_METRIC_MAP['ss']).toBe('Sensory Sensitivity')
      expect(KEY_METRIC_MAP['ms']).toBe('Motor Skills')
      expect(KEY_METRIC_MAP['rp']).toBe('Routine Preference')
      expect(KEY_METRIC_MAP['er']).toBe('Emotional Regulation')
    })
  })

  describe('METRIC_KEY_MAP', () => {
    it('should have all 6 reverse mappings', () => {
      expect(Object.keys(METRIC_KEY_MAP).length).toBe(6)
    })

    it('should be the inverse of KEY_METRIC_MAP', () => {
      for (const [key, metricName] of Object.entries(KEY_METRIC_MAP)) {
        expect(METRIC_KEY_MAP[metricName]).toBe(key)
      }
    })
  })

  describe('CSV format validation', () => {
    it('should produce RFC 4180 compliant CSV for metrics section', () => {
      const csv = generateCSVContent(
        defaultMetrics,
        mockSettingsData,
        mockRecommendations,
        mockParentResources,
        mockTeacherResources
      )

      // Extract metrics lines
      const lines = csv.split('\n')
      const metricsHeaderIndex = lines.findIndex(l => l === 'Metric,Score,Level,Description')
      
      expect(metricsHeaderIndex).toBeGreaterThan(-1)
      
      // Check first metric line format: "Name",Score,"Level","Description"
      const firstMetricLine = lines[metricsHeaderIndex + 1]
      expect(firstMetricLine).toMatch(/^"[^"]+",\d+,"[^"]+","[^"]*"$/)
    })

    it('should handle commas in descriptions', () => {
      const dataWithCommas = {
        'Focus': [{ score: 0, description: 'Description with, comma, inside' }]
      }
      
      const metricsWithZero: MetricsObject = {
        ...defaultMetrics,
        'Focus': 0
      }

      const csv = generateCSVContent(
        metricsWithZero,
        { ...mockSettingsData, ...dataWithCommas },
        null,
        [],
        []
      )

      // The description should be properly quoted
      expect(csv).toContain('"Description with, comma, inside"')
    })
  })
})
