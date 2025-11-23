/**
 * @file components/SectionNav.tsx
 * @description Navigation component for jumping between page sections
 * 
 * Features:
 * - Fixed position on desktop (sidebar)
 * - Sticky bottom bar on mobile
 * - Smooth scroll navigation
 * - Active section highlighting
 */

import { useEffect, useState } from 'react'

interface Section {
  id: string
  label: string
  icon: string
}

const allSections: Section[] = [
  { id: 'metrics', label: 'My Profile', icon: '👤' },
  { id: 'sharing', label: 'Share', icon: '📤' },
  { id: 'strategies', label: 'What Helps', icon: '💡' },
  { id: 'resources', label: 'Learn More', icon: '📖' },
  { id: 'about', label: 'About', icon: '💜' }
]

const minimalSections: Section[] = [
  { id: 'sharing', label: 'Share', icon: '📤' },
  { id: 'strategies', label: 'What Helps', icon: '💡' },
  { id: 'resources', label: 'Learn More', icon: '📖' },
  { id: 'about', label: 'About', icon: '💜' }
]

interface SectionNavProps {
  /** When true, shows only share-related sections (no metrics) */
  minimal?: boolean
}

/**
 * SectionNav Component
 * 
 * Provides quick navigation between main sections
 */
export default function SectionNav({ minimal = false }: SectionNavProps): JSX.Element {
  const sections = minimal ? minimalSections : allSections
  const [activeSection, setActiveSection] = useState(minimal ? 'sharing' : 'metrics')

  /**
   * Handle smooth scroll to section
   */
  function scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  /**
   * Track active section on scroll
   */
  useEffect(() => {
    function handleScroll(): void {
      const scrollPosition = window.scrollY + 150

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="section-nav" aria-label="Page sections">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
          aria-current={activeSection === section.id ? 'true' : undefined}
        >
          <span className="section-nav-icon">{section.icon}</span>
          <span className="section-nav-label">{section.label}</span>
        </button>
      ))}
    </nav>
  )
}
