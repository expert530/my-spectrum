/**
 * @file data/resources.ts
 * @description Curated evidence-based resources for neurodiversity support
 * 
 * Resources are sourced from reputable organizations:
 * - Understood.org: 20M+ users, free resources on learning differences
 * - ADDitude: ADHD parenting strategies and tips
 * - CHADD: Nonprofit organization, peer training and support
 * - ASAN: Autistic advocacy, neurodiversity-affirming approaches
 */

import type { Resource, MetricsObject, ResourcesByAudience } from '@/types'

/**
 * Resources targeted at parents and caregivers
 * Cover home-based support, parenting strategies, and emotional support
 */
export const parentResources: Resource[] = [
  {
    title: 'Understood.org',
    url: 'https://www.understood.org/en',
    description:
      'Free resources on ADHD, dyslexia, and other learning differences for parents. Includes articles, guides, and a vibrant community for support.'
  },
  {
    title: 'ADDitude Magazine',
    url: 'https://www.additudemag.com',
    description:
      'Evidence-based articles on ADHD parenting strategies, emotional regulation, and practical tips for supporting neurodivergent children at home.'
  },
  {
    title: 'CHADD (Children & Adults with ADHD)',
    url: 'https://chadd.org/for-parents/overview/',
    description:
      'Nonprofit organization offering parent-to-parent training, webinars, support groups, and research-backed guidance on ADHD.'
  },
  {
    title: 'Autistic Self Advocacy Network (ASAN)',
    url: 'https://autisticadvocacy.org/about-asan/about-autism/',
    description:
      'Resources on autism, acceptance, and self-determination. Written by autistic people and advocates for neurodiversity-affirming approaches.'
  },
  {
    title: 'The Neurodivergent Parent Podcast & Resources',
    url: 'https://www.additudemag.com/category/parenting-adhd-kids/',
    description:
      'Practical parenting advice for ADHD and neurodivergent kids, including sensory needs, emotional regulation, and executive function support.'
  },
  {
    title: 'Calm the Chaos: ADHD Organization Strategies',
    url: 'https://www.additudemag.com/category/manage-adhd-life/home-organization/',
    description:
      'Practical strategies for organizing routines, managing time, and reducing household chaos for families with ADHD.'
  }
]

/**
 * Resources targeted at teachers and educators
 * Cover classroom accommodations, academic support, and inclusive practices
 */
export const teacherResources: Resource[] = [
  {
    title: 'CHADD for Educators',
    url: 'https://chadd.org/for-educators/overview/',
    description:
      'Teacher-to-teacher training, classroom accommodation guides, and evidence-based strategies for supporting students with ADHD in school.'
  },
  {
    title: 'Understood.org (Teacher Resources)',
    url: 'https://www.understood.org/en',
    description:
      'Free classroom resources, lesson planning guides, and accommodation strategies for students with ADHD, dyslexia, and other learning differences.'
  },
  {
    title: 'Autistic Self Advocacy Network - Education Resources',
    url: 'https://autisticadvocacy.org/education/',
    description:
      'Resources on inclusive classroom practices, understanding autism, and creating a neurodiversity-affirming school environment.'
  },
  {
    title: 'ADHD Information Library & Fact Sheets',
    url: 'https://chadd.org/adhd-information-library/',
    description:
      'Comprehensive fact sheets, infographics, and toolkits on ADHD for educators, including classroom accommodations and behavioral strategies.'
  },
  {
    title: 'ADDitude Magazine - School & Learning',
    url: 'https://www.additudemag.com/category/parenting-adhd-kids/school-learning/',
    description:
      'Evidence-based articles on classroom strategies, homework help, IEP/504 planning, and supporting neurodivergent learners academically and socially.'
  },
  {
    title: 'Sensory Needs & Classroom Accommodations',
    url: 'https://chadd.org/adhd-information-library/',
    description:
      'Guidance on managing sensory sensitivities, movement breaks, fidget tools, and environmental modifications for neurodivergent students.'
  }
]

/**
 * Get relevant resources based on metric scores
 * Currently returns all available resources (filtering logic can be added later)
 * 
 * @param _metrics - Current metric values (unused in current implementation)
 * @returns All parent and teacher resources organized by audience
 * 
 * @future Enhancement: Could filter resources based on lowest-scoring metrics
 * Example: If 'Sensory Sensitivity' is low, prioritize sensory-related resources
 */
export function getRelevantResources(_metrics: MetricsObject): ResourcesByAudience {
  // TODO: Implement intelligent resource filtering based on metric scores
  // For now, return all resources
  return {
    parent: parentResources,
    teacher: teacherResources
  }
}
