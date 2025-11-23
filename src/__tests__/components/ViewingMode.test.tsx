/**
 * @file components/ViewingMode.test.tsx
 * @description Unit tests for ViewingMode component
 * 
 * Tests cover:
 * - Profile display with and without name
 * - Metric cards rendering
 * - Support strategies display
 * - Resources section
 * - CTA button functionality
 * - Accessibility
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ViewingMode from '@/components/ViewingMode'
import type { MetricsObject, MetricScore } from '@/types'

describe('ViewingMode', () => {
  const defaultMetrics: MetricsObject = {
    'Focus': 2 as MetricScore,
    'Social Interaction': 3 as MetricScore,
    'Sensory Sensitivity': 4 as MetricScore,
    'Motor Skills': 1 as MetricScore,
    'Routine Preference': 5 as MetricScore,
    'Emotional Regulation': 2 as MetricScore
  }

  const mockOnCreateOwn = vi.fn()

  beforeEach(() => {
    mockOnCreateOwn.mockClear()
  })

  describe('Header rendering', () => {
    it('should display "Shared Neurodiversity Profile" when no name is provided', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText('Shared Neurodiversity Profile')).toBeInTheDocument()
    })

    it('should display personalized header when name is provided', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName="Alex" 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/Alex/)).toBeInTheDocument()
      expect(screen.getByText(/Neurodiversity Profile/)).toBeInTheDocument()
    })

    it('should truncate long names to 50 characters', () => {
      const longName = 'A'.repeat(60)
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={longName} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // Should show truncated name (50 chars)
      const displayedName = screen.getByText(/A{50}/)
      expect(displayedName).toBeInTheDocument()
    })

    it('should sanitize HTML characters in name', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName="<script>alert('xss')</script>" 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // Angle brackets should be stripped
      expect(screen.queryByText('<script>')).not.toBeInTheDocument()
    })

    it('should display subtitle', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/personalized guide/i)).toBeInTheDocument()
    })

    it('should display rainbow emoji in header', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText('🌈')).toBeInTheDocument()
    })
  })

  describe('Profile summary', () => {
    it('should display "At a Glance" section', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/At a Glance/i)).toBeInTheDocument()
    })

    it('should identify high support areas when scores are low', () => {
      const lowMetrics: MetricsObject = {
        'Focus': 0 as MetricScore,
        'Social Interaction': 1 as MetricScore,
        'Sensory Sensitivity': 5 as MetricScore,
        'Motor Skills': 5 as MetricScore,
        'Routine Preference': 5 as MetricScore,
        'Emotional Regulation': 5 as MetricScore
      }
      
      render(
        <ViewingMode 
          metrics={lowMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // The summary section should exist and mention areas
      const summarySection = screen.getByLabelText(/Profile Summary/i)
      expect(summarySection).toBeInTheDocument()
    })

    it('should identify strength areas when scores are high', () => {
      const highMetrics: MetricsObject = {
        'Focus': 5 as MetricScore,
        'Social Interaction': 4 as MetricScore,
        'Sensory Sensitivity': 0 as MetricScore,
        'Motor Skills': 0 as MetricScore,
        'Routine Preference': 0 as MetricScore,
        'Emotional Regulation': 0 as MetricScore
      }
      
      render(
        <ViewingMode 
          metrics={highMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // Should mention strengths in the summary
      const summarySection = screen.getByLabelText(/Profile Summary/i)
      expect(summarySection).toBeInTheDocument()
    })
  })

  describe('Profile cards grid', () => {
    it('should display all 6 metric cards', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText('Focus')).toBeInTheDocument()
      expect(screen.getByText('Social Interaction')).toBeInTheDocument()
      expect(screen.getByText('Sensory Sensitivity')).toBeInTheDocument()
      expect(screen.getByText('Motor Skills')).toBeInTheDocument()
      expect(screen.getByText('Routine Preference')).toBeInTheDocument()
      expect(screen.getByText('Emotional Regulation')).toBeInTheDocument()
    })

    it('should have Profile Overview heading', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/Profile Overview/i)).toBeInTheDocument()
    })
  })

  describe('Support strategies section', () => {
    it('should display "How to Help" section', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/How to Help/i)).toBeInTheDocument()
    })

    it('should display strategies based on metrics', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      const strategiesSection = screen.getByLabelText(/Support Strategies/i)
      expect(strategiesSection).toBeInTheDocument()
      
      // Should have strategy list items with checkmarks
      expect(screen.getAllByText('✓').length).toBeGreaterThan(0)
    })
  })

  describe('Resources section', () => {
    it('should display "Learn More" section', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/Learn More/i)).toBeInTheDocument()
    })

    it('should display parent resources group', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/For Parents & Caregivers/i)).toBeInTheDocument()
    })

    it('should display educator resources group', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // The tabs are buttons, not headings
      expect(screen.getByRole('button', { name: /For Educators/i })).toBeInTheDocument()
    })

    it('should have external links to resources', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      const resourceLinks = screen.getAllByRole('link')
      expect(resourceLinks.length).toBeGreaterThan(0)
      
      // All resource links should open in new tab
      resourceLinks.forEach(link => {
        if (link.getAttribute('href')?.startsWith('http')) {
          expect(link).toHaveAttribute('target', '_blank')
          expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        }
      })
    })
  })

  describe('Print functionality', () => {
    it('should display print button', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByRole('button', { name: /Print/i })).toBeInTheDocument()
    })

    it('should call window.print when print button is clicked', async () => {
      const user = userEvent.setup()
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
      
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      const printButton = screen.getByRole('button', { name: /Print/i })
      await user.click(printButton)
      
      expect(printSpy).toHaveBeenCalled()
      
      printSpy.mockRestore()
    })
  })

  describe('CTA section', () => {
    it('should display "Create Your Own Profile" CTA', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByText(/Want to create your own profile/i)).toBeInTheDocument()
    })

    it('should call onCreateOwn when CTA button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      const ctaButton = screen.getByRole('button', { name: /Create Your Own Profile/i })
      await user.click(ctaButton)
      
      expect(mockOnCreateOwn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Footer', () => {
    it('should display privacy message', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // Footer has privacy-first message
      expect(screen.getByText(/All data stays on your device/i)).toBeInTheDocument()
    })

    it('should display credit link', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // Footer has "Made with" credit text
      expect(screen.getByText(/Made with/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have skip link for strategies', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      const skipLink = screen.getByText(/Skip to support strategies/i)
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#strategies')
    })

    it('should have proper aria labels on sections', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      expect(screen.getByLabelText(/Profile Summary/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Profile Metrics/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Support Strategies/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Helpful Resources/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Create Your Own/i)).toBeInTheDocument()
    })

    it('should have decorative elements hidden from screen readers', () => {
      render(
        <ViewingMode 
          metrics={defaultMetrics} 
          profileName={null} 
          onCreateOwn={mockOnCreateOwn} 
        />
      )
      
      // Rainbow emoji should be hidden
      const rainbowEmoji = screen.getByText('🌈')
      expect(rainbowEmoji).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
