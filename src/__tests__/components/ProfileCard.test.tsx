/**
 * @file components/ProfileCard.test.tsx
 * @description Unit tests for ProfileCard component (viewing mode)
 * 
 * Tests cover:
 * - Rendering with different scores
 * - Support level display
 * - Accessibility attributes
 * - Visual elements (progress bar, badges)
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfileCard from '@/components/ProfileCard'
import type { MetricScore } from '@/types'

describe('ProfileCard', () => {
  const defaultProps = {
    name: 'Focus',
    score: 3 as MetricScore,
    description: 'Test description for focus at level 3'
  }

  describe('Basic rendering', () => {
    it('should render the metric name', () => {
      render(<ProfileCard {...defaultProps} />)
      expect(screen.getByText('Focus')).toBeInTheDocument()
    })

    it('should render the description', () => {
      render(<ProfileCard {...defaultProps} />)
      expect(screen.getByText('Test description for focus at level 3')).toBeInTheDocument()
    })

    it('should render the score badge', () => {
      render(<ProfileCard {...defaultProps} />)
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should render the score text (x/5)', () => {
      render(<ProfileCard {...defaultProps} />)
      expect(screen.getByText('3/5')).toBeInTheDocument()
    })
  })

  describe('Emoji display', () => {
    it('should display correct emoji for Focus', () => {
      render(<ProfileCard {...defaultProps} name="Focus" />)
      expect(screen.getByText('🎯')).toBeInTheDocument()
    })

    it('should display correct emoji for Social Interaction', () => {
      render(<ProfileCard {...defaultProps} name="Social Interaction" />)
      expect(screen.getByText('👥')).toBeInTheDocument()
    })

    it('should display correct emoji for Sensory Sensitivity', () => {
      render(<ProfileCard {...defaultProps} name="Sensory Sensitivity" />)
      expect(screen.getByText('👂')).toBeInTheDocument()
    })

    it('should display correct emoji for Motor Skills', () => {
      render(<ProfileCard {...defaultProps} name="Motor Skills" />)
      expect(screen.getByText('🤸')).toBeInTheDocument()
    })

    it('should display correct emoji for Routine Preference', () => {
      render(<ProfileCard {...defaultProps} name="Routine Preference" />)
      expect(screen.getByText('📅')).toBeInTheDocument()
    })

    it('should display correct emoji for Emotional Regulation', () => {
      render(<ProfileCard {...defaultProps} name="Emotional Regulation" />)
      expect(screen.getByText('😌')).toBeInTheDocument()
    })
  })

  describe('Support level display', () => {
    it('should display "High Support" for score 0', () => {
      render(<ProfileCard {...defaultProps} score={0} />)
      expect(screen.getByText('High Support')).toBeInTheDocument()
    })

    it('should display "High Support" for score 1', () => {
      render(<ProfileCard {...defaultProps} score={1} />)
      expect(screen.getByText('High Support')).toBeInTheDocument()
    })

    it('should display "Moderate" for score 2', () => {
      render(<ProfileCard {...defaultProps} score={2} />)
      expect(screen.getByText('Moderate')).toBeInTheDocument()
    })

    it('should display "Moderate" for score 3', () => {
      render(<ProfileCard {...defaultProps} score={3} />)
      expect(screen.getByText('Moderate')).toBeInTheDocument()
    })

    it('should display "Independent" for score 4', () => {
      render(<ProfileCard {...defaultProps} score={4} />)
      expect(screen.getByText('Independent')).toBeInTheDocument()
    })

    it('should display "Independent" for score 5', () => {
      render(<ProfileCard {...defaultProps} score={5} />)
      expect(screen.getByText('Independent')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have role="article" on the card', () => {
      render(<ProfileCard {...defaultProps} />)
      const article = screen.getByRole('article')
      expect(article).toBeInTheDocument()
    })

    it('should have accessible label describing the metric', () => {
      render(<ProfileCard {...defaultProps} />)
      const article = screen.getByRole('article')
      expect(article).toHaveAttribute('aria-label')
      expect(article.getAttribute('aria-label')).toContain('Focus')
      expect(article.getAttribute('aria-label')).toContain('3 out of 5')
    })

    it('should have a progress bar with correct ARIA attributes', () => {
      render(<ProfileCard {...defaultProps} score={3} />)
      const progressBar = screen.getByRole('progressbar')
      
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveAttribute('aria-valuenow', '3')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '5')
    })

    it('should have emoji hidden from screen readers', () => {
      render(<ProfileCard {...defaultProps} />)
      const emoji = screen.getByText('🎯')
      expect(emoji).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Progress bar visualization', () => {
    it('should have 0% width for score 0', () => {
      const { container } = render(<ProfileCard {...defaultProps} score={0} />)
      const fill = container.querySelector('.profile-card__progress-fill')
      expect(fill).toHaveStyle({ width: '0%' })
    })

    it('should have 20% width for score 1', () => {
      const { container } = render(<ProfileCard {...defaultProps} score={1} />)
      const fill = container.querySelector('.profile-card__progress-fill')
      expect(fill).toHaveStyle({ width: '20%' })
    })

    it('should have 60% width for score 3', () => {
      const { container } = render(<ProfileCard {...defaultProps} score={3} />)
      const fill = container.querySelector('.profile-card__progress-fill')
      expect(fill).toHaveStyle({ width: '60%' })
    })

    it('should have 100% width for score 5', () => {
      const { container } = render(<ProfileCard {...defaultProps} score={5} />)
      const fill = container.querySelector('.profile-card__progress-fill')
      expect(fill).toHaveStyle({ width: '100%' })
    })
  })

  describe('CSS classes', () => {
    it('should apply correct color class for Focus', () => {
      const { container } = render(<ProfileCard {...defaultProps} name="Focus" />)
      expect(container.firstChild).toHaveClass('profile-card--focus')
    })

    it('should apply correct color class for Social Interaction', () => {
      const { container } = render(<ProfileCard {...defaultProps} name="Social Interaction" />)
      expect(container.firstChild).toHaveClass('profile-card--social')
    })

    it('should apply correct color class for Emotional Regulation', () => {
      const { container } = render(<ProfileCard {...defaultProps} name="Emotional Regulation" />)
      expect(container.firstChild).toHaveClass('profile-card--emotional')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty description gracefully', () => {
      render(<ProfileCard {...defaultProps} description="" />)
      expect(screen.getByText('Focus')).toBeInTheDocument()
    })

    it('should handle long descriptions without breaking', () => {
      const longDescription = 'A'.repeat(500)
      render(<ProfileCard {...defaultProps} description={longDescription} />)
      expect(screen.getByText(longDescription)).toBeInTheDocument()
    })

    it('should handle unknown metric name for emoji', () => {
      render(<ProfileCard {...defaultProps} name="Unknown Metric" />)
      expect(screen.getByText('✨')).toBeInTheDocument()
    })
  })
})
