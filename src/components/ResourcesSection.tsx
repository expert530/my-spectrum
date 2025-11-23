/**
 * @file components/ResourcesSection.tsx
 * @description Static section displaying curated neurodiversity resources
 * 
 * Features:
 * - Always visible at bottom of page
 * - Links to trusted external resources
 * - Organized by audience (parents/teachers)
 * - Tab-style layout with content below headers
 */

import { useState } from 'react'
import { parentResources, teacherResources } from '@/data/resources'

type ResourceTab = 'parent' | 'teacher' | null

/**
 * ResourcesSection Component
 * 
 * Static section with curated links to evidence-based resources
 * with tab-style navigation for Parents and Educators
 */
export default function ResourcesSection(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ResourceTab>(null)

  const handleTabClick = (tab: ResourceTab) => {
    setActiveTab(activeTab === tab ? null : tab)
  }

  const activeResources = activeTab === 'parent' ? parentResources : 
                          activeTab === 'teacher' ? teacherResources : []

  return (
    <section id="resources" className="resources-section" aria-label="Learn More">
      <h2>📚 Learn More</h2>
      <p className="resources-intro">
        Explore these trusted resources for additional support and guidance.
      </p>

      {/* Tab Headers */}
      <div className="resources-tabs">
        <button
          className={`resources-tab ${activeTab === 'parent' ? 'resources-tab--active' : ''}`}
          onClick={() => handleTabClick('parent')}
          aria-expanded={activeTab === 'parent'}
        >
          <span className="resources-tab__title">👨‍👩‍👧 For Parents & Caregivers</span>
          <span className={`resources-tab__chevron ${activeTab === 'parent' ? 'resources-tab__chevron--expanded' : ''}`}>
            ▼
          </span>
        </button>
        <button
          className={`resources-tab ${activeTab === 'teacher' ? 'resources-tab--active' : ''}`}
          onClick={() => handleTabClick('teacher')}
          aria-expanded={activeTab === 'teacher'}
        >
          <span className="resources-tab__title">👩‍🏫 For Educators</span>
          <span className={`resources-tab__chevron ${activeTab === 'teacher' ? 'resources-tab__chevron--expanded' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Resources Content - Full Width Below Tabs */}
      {activeTab && (
        <div className="resources-content">
          <ul className="resources-list resources-list--grid">
            {activeResources.map((resource, idx) => (
              <li key={idx} className="resource-card">
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-title"
                >
                  {resource.title} ↗
                </a>
                <p className="resource-desc">{resource.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
