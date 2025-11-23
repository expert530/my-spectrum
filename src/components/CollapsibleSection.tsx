/**
 * @file components/CollapsibleSection.tsx
 * @description Reusable collapsible section component with smooth animations
 * 
 * Features:
 * - Smooth height transition on expand/collapse
 * - Rotating chevron indicator
 * - Preview text shown when collapsed
 * - Accessible with aria-expanded
 */

import { useState, useRef, useEffect, type ReactNode } from 'react'

interface CollapsibleSectionProps {
  /** Section ID for navigation anchoring */
  id: string
  /** Section title text */
  title: string
  /** Emoji or icon to display */
  icon: string
  /** Preview text shown when collapsed */
  previewText: string
  /** Whether section starts expanded */
  defaultExpanded?: boolean
  /** Section content */
  children: ReactNode
  /** Optional className for custom styling */
  className?: string
}

/**
 * CollapsibleSection Component
 * 
 * A section that can be expanded/collapsed with smooth animations.
 * Shows a preview description when collapsed.
 */
export default function CollapsibleSection({
  id,
  title,
  icon,
  previewText,
  defaultExpanded = false,
  children,
  className = ''
}: CollapsibleSectionProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    defaultExpanded ? undefined : 0
  )
  const contentRef = useRef<HTMLDivElement>(null)

  // Update content height when expanded state changes
  useEffect(() => {
    if (!contentRef.current) return undefined

    if (isExpanded) {
      // Set to actual height for animation, then remove for auto-height
      setContentHeight(contentRef.current.scrollHeight)
      const timeout = setTimeout(() => {
        setContentHeight(undefined)
      }, 300) // Match CSS transition duration
      return () => clearTimeout(timeout)
    } else {
      // First set to current height, then animate to 0
      setContentHeight(contentRef.current.scrollHeight)
      requestAnimationFrame(() => {
        setContentHeight(0)
      })
      return undefined
    }
  }, [isExpanded])

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev)
  }

  return (
    <section
      id={id}
      className={`collapsible-section ${isExpanded ? 'collapsible-section--expanded' : ''} ${className}`}
      aria-label={title}
    >
      <button
        className="collapsible-section__header"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
      >
        <div className="collapsible-section__title-row">
          <span className="collapsible-section__icon">{icon}</span>
          <h2 className="collapsible-section__title">{title}</h2>
          <span 
            className={`collapsible-section__chevron ${isExpanded ? 'collapsible-section__chevron--expanded' : ''}`}
            aria-hidden="true"
          >
            ▼
          </span>
        </div>
        {!isExpanded && (
          <p className="collapsible-section__preview">{previewText}</p>
        )}
      </button>

      <div
        id={`${id}-content`}
        ref={contentRef}
        className="collapsible-section__content"
        style={{
          height: contentHeight !== undefined ? `${contentHeight}px` : 'auto',
          overflow: isExpanded && contentHeight === undefined ? 'visible' : 'hidden'
        }}
        aria-hidden={!isExpanded}
      >
        <div className="collapsible-section__inner">
          {children}
        </div>
      </div>
    </section>
  )
}
