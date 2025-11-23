/**
 * @file components/SupportStrategiesSection.test.tsx
 * @description Unit tests for SupportStrategiesSection component
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SupportStrategiesSection from '@/components/SupportStrategiesSection'
import type { Recommendations, MetricsObject } from '@/types'

describe('SupportStrategiesSection', () => {
  const defaultMetrics: MetricsObject = {
    'Focus': 2,
    'Social Interaction': 2,
    'Sensory Sensitivity': 2,
    'Motor Skills': 2,
    'Routine Preference': 2,
    'Emotional Regulation': 2
  }

  const defaultRecommendations: Recommendations = {
    parent: [
      { text: 'Parent strategy 1', source: 'CHADD' },
      { text: 'Parent strategy 2', source: 'Understood' }
    ],
    teacher: [
      { text: 'Teacher strategy 1', source: 'ASAN' },
      { text: 'Teacher strategy 2', source: 'CHADD' }
    ]
  }

  it('should render the section heading', () => {
    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    expect(screen.getByText(/What Helps/i)).toBeInTheDocument()
  })

  it('should render current profile section', () => {
    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    expect(screen.getByText('Your Current Profile')).toBeInTheDocument()
  })

  it('should render all metric names', () => {
    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    expect(screen.getByText('Focus')).toBeInTheDocument()
    expect(screen.getByText('Social Interaction')).toBeInTheDocument()
    expect(screen.getByText('Sensory Sensitivity')).toBeInTheDocument()
    expect(screen.getByText('Motor Skills')).toBeInTheDocument()
    expect(screen.getByText('Routine Preference')).toBeInTheDocument()
    expect(screen.getByText('Emotional Regulation')).toBeInTheDocument()
  })

  it('should render collapsible strategy sections', () => {
    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    // Check for collapsible section headers
    expect(screen.getByText(/For Parents & Caregivers/i)).toBeInTheDocument()
    expect(screen.getByText(/For Educators/i)).toBeInTheDocument()
  })

  it('should render strategies from recommendations when expanded', () => {
    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    // Click to expand the parent strategies section
    const parentButton = screen.getByText(/For Parents & Caregivers/i).closest('button')
    if (parentButton) {
      fireEvent.click(parentButton)
    }
    
    // Click to expand the educator strategies section
    const teacherButton = screen.getByText(/For Educators/i).closest('button')
    if (teacherButton) {
      fireEvent.click(teacherButton)
    }

    expect(screen.getByText('Parent strategy 1')).toBeInTheDocument()
    expect(screen.getByText('Teacher strategy 1')).toBeInTheDocument()
    // Check that source badges are present
    expect(screen.getAllByText('CHADD').length).toBeGreaterThan(0)
    expect(screen.getByText('ASAN')).toBeInTheDocument()
  })

  it('should return null when recommendations is null', () => {
    const { container } = render(
      <SupportStrategiesSection 
        recommendations={null} 
        metrics={defaultMetrics} 
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should return null when recommendations are empty', () => {
    const emptyRecommendations: Recommendations = {
      parent: [],
      teacher: []
    }

    const { container } = render(
      <SupportStrategiesSection 
        recommendations={emptyRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should display correct support level for low scores', () => {
    const lowMetrics: MetricsObject = {
      'Focus': 1,
      'Social Interaction': 2,
      'Sensory Sensitivity': 2,
      'Motor Skills': 2,
      'Routine Preference': 2,
      'Emotional Regulation': 2
    }

    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={lowMetrics} 
      />
    )

    expect(screen.getByText('High Support')).toBeInTheDocument()
  })

  it('should display correct support level for moderate scores', () => {
    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    // All scores are 5, so all should show "Moderate"
    const moderateLabels = screen.getAllByText('Moderate')
    expect(moderateLabels.length).toBe(6)
  })

  it('should display correct support level for high scores', () => {
    const highMetrics: MetricsObject = {
      'Focus': 5,
      'Social Interaction': 2,
      'Sensory Sensitivity': 2,
      'Motor Skills': 2,
      'Routine Preference': 2,
      'Emotional Regulation': 2
    }

    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={highMetrics} 
      />
    )

    expect(screen.getByText('Independent')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <SupportStrategiesSection 
        recommendations={defaultRecommendations} 
        metrics={defaultMetrics} 
      />
    )

    const section = screen.getByRole('region', { name: /what helps/i })
    expect(section).toBeInTheDocument()
  })
})
