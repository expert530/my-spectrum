/**
 * @file components/MetricSlider.test.tsx
 * @description Unit tests for MetricSlider component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MetricSlider from '@/components/MetricSlider'

describe('MetricSlider', () => {
  const mockOnChange = vi.fn()

  // Sample values array matching the component's expected structure (0-5 scale)
  const sampleValues = [
    { score: 0, description: 'Level 0 description' },
    { score: 1, description: 'Level 1 description' },
    { score: 2, description: 'Level 2 description' },
    { score: 3, description: 'Level 3 description' },
    { score: 4, description: 'Level 4 description' },
    { score: 5, description: 'Level 5 description' }
  ]

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('should render with the provided category', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={3}
        onChange={mockOnChange}
      />
    )

    // Category appears in the heading along with emoji
    expect(screen.getByRole('heading', { name: /Focus/i })).toBeInTheDocument()
  })

  it('should render the icon for the category', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={3}
        onChange={mockOnChange}
      />
    )

    // Check for the SVG icon container
    const iconContainer = document.querySelector('.metric-icon')
    expect(iconContainer).toBeInTheDocument()
    expect(iconContainer?.querySelector('svg')).toBeInTheDocument()
  })

  it('should display the current value', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={4}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('should have a range input with correct attributes', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={3}
        onChange={mockOnChange}
      />
    )

    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '5')
    expect(slider).toHaveValue('3')
  })

  it('should call onChange when slider value changes', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={3}
        onChange={mockOnChange}
      />
    )

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '4' } })

    expect(mockOnChange).toHaveBeenCalledWith(4)
  })

  it('should display intensity label based on value', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={1}
        onChange={mockOnChange}
      />
    )

    // Check the intensity label specifically (not the button)
    // With 0-5 scale: 0-1 = Low, 2-3 = Medium, 4-5 = High
    expect(screen.getByLabelText('Intensity: Low')).toBeInTheDocument()
  })

  it('should have preset buttons', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={3}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByRole('button', { name: /low intensity/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /medium intensity/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /high intensity/i })).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <MetricSlider
        category="Focus"
        values={sampleValues}
        value={3}
        onChange={mockOnChange}
      />
    )

    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-label', 'Focus metric slider')
  })
})
