/**
 * @file lib/recommendations.ts
 * @description Evidence-based recommendation engine for neurodiversity support
 * 
 * Generates personalized support strategies based on metric scores
 * Strategies are stratified by difficulty level (highNeed, moderate, independent)
 * Suitable for parents, teachers, and caregivers
 * 
 * Sources:
 * - CHADD: Children and Adults with ADHD (CDC's National Resource Center on ADHD)
 * - Understood: Understood.org (learning differences, 20M+ users)
 * - ASAN: Autistic Self Advocacy Network (neurodiversity-affirming)
 */

import type { MetricsObject, MetricName, SupportLevel, Recommendations, Strategy, StrategySource } from '@/types'

/**
 * Helper to create a strategy with source
 */
function s(text: string, source: StrategySource): Strategy {
  return { text, source }
}

/**
 * Support strategies indexed by metric and audience type, then by difficulty level
 * Each level contains evidence-based strategies with source attribution
 */
type StrategyMap = Record<MetricName, Record<'parent' | 'teacher', Record<SupportLevel, Strategy[]>>>

const supportStrategies: StrategyMap = {
  Focus: {
    parent: {
      highNeed: [
        s('Create a quiet, distraction-free workspace with minimal visual stimuli', 'CHADD'),
        s('Use timers and break down tasks into smaller, manageable chunks (Pomodoro technique)', 'Understood'),
        s('Implement a consistent daily routine to reduce decision fatigue', 'CHADD')
      ],
      moderate: [
        s('Offer structured activity times with breaks between focused work', 'CHADD'),
        s('Use visual schedules and checklists to help with task organization', 'Understood'),
        s('Celebrate small wins to maintain motivation', 'Understood')
      ],
      independent: [
        s('Continue supporting focus with occasional check-ins', 'Understood'),
        s('Encourage self-directed projects that match their interests', 'ASAN'),
        s('Model good focus habits and work alongside them sometimes', 'Understood')
      ]
    },
    teacher: {
      highNeed: [
        s('Seat student near the front, away from distractions; use preferential seating', 'CHADD'),
        s('Provide written instructions in addition to verbal; use visual supports', 'Understood'),
        s('Allow use of fidget tools, headphones, or movement breaks as needed', 'CHADD')
      ],
      moderate: [
        s('Break complex assignments into smaller parts with check-ins', 'CHADD'),
        s('Offer flexible seating and allow movement between tasks', 'Understood'),
        s('Use multimodal instruction (visual, auditory, kinesthetic)', 'Understood')
      ],
      independent: [
        s('Provide choice in how to demonstrate learning', 'Understood'),
        s('Encourage peer collaboration and group projects', 'Understood'),
        s('Offer challenge activities to maintain engagement', 'CHADD')
      ]
    }
  },

  'Social Interaction': {
    parent: {
      highNeed: [
        s('Model social scripts and practice interactions through role-play at home', 'Understood'),
        s('Create structured social opportunities (clubs, small groups) rather than free-for-all events', 'ASAN'),
        s('Use visual supports (social stories, emotion charts) to teach social cues', 'Understood')
      ],
      moderate: [
        s('Support developing 1-2 close friendships over large social circles', 'ASAN'),
        s('Teach self-advocacy and how to ask for help or space', 'ASAN'),
        s('Validate social anxiety and celebrate small social efforts', 'Understood')
      ],
      independent: [
        s('Encourage participation in interest-based groups or communities', 'ASAN'),
        s('Support developing their own social strategies and preferences', 'ASAN'),
        s('Respect their natural social style; not everyone needs a large friend group', 'ASAN')
      ]
    },
    teacher: {
      highNeed: [
        s('Assign a peer buddy or mentor; use structured partner work', 'Understood'),
        s('Teach explicit social rules and expected behaviors; use visual supports', 'Understood'),
        s('Allow breaks from social situations when overwhelmed; provide a safe space', 'ASAN')
      ],
      moderate: [
        s('Facilitate small-group projects with clear roles and responsibilities', 'Understood'),
        s('Teach and reinforce social skills during teachable moments', 'Understood'),
        s('Provide choice in group composition when possible', 'ASAN')
      ],
      independent: [
        s('Include student voice in classroom discussions and community building', 'ASAN'),
        s('Support leadership or mentoring roles if interested', 'Understood'),
        s('Create inclusive classroom where diverse social styles are valued', 'ASAN')
      ]
    }
  },

  'Sensory Sensitivity': {
    parent: {
      highNeed: [
        s('Identify specific triggers (sounds, textures, lights) and create predictable sensory environment', 'ASAN'),
        s('Offer calming tools: weighted blankets, noise-canceling headphones, fidget items', 'Understood'),
        s('Allow withdrawal/quiet time when overwhelmed; don\'t force sensory experiences', 'ASAN')
      ],
      moderate: [
        s('Provide advance warning of sensory changes (loud events, crowded spaces)', 'ASAN'),
        s('Teach sensory self-regulation: deep breathing, counting, movement breaks', 'Understood'),
        s('Respect sensory preferences in clothing, food, and activities', 'ASAN')
      ],
      independent: [
        s('Support self-advocacy about sensory needs to peers and others', 'ASAN'),
        s('Encourage awareness of their own sensory patterns', 'ASAN'),
        s('Celebrate their sensory awareness as a strength', 'ASAN')
      ]
    },
    teacher: {
      highNeed: [
        s('Reduce sensory triggers: dim lights, minimize clutter, control noise levels', 'ASAN'),
        s('Provide access to quiet space or sensory corner when needed', 'Understood'),
        s('Give advance notice of assemblies, fire drills, or unusual auditory/visual events', 'ASAN')
      ],
      moderate: [
        s('Offer headphones during noisy activities; allow movement breaks', 'CHADD'),
        s('Respect seating preferences and classroom positioning needs', 'ASAN'),
        s('Use calming sensory tools (stress balls, fidgets) during instruction', 'Understood')
      ],
      independent: [
        s('Allow student input on classroom sensory environment', 'ASAN'),
        s('Support self-regulation strategies during unstructured times', 'Understood'),
        s('Model sensory awareness and accommodations as normal and positive', 'ASAN')
      ]
    }
  },

  'Motor Skills': {
    parent: {
      highNeed: [
        s('Practice fine motor skills through play: play dough, threading, puzzles, drawing', 'Understood'),
        s('Use adapted utensils, pencil grips, or pencil grips to support writing', 'Understood'),
        s('Be patient with self-care tasks (dressing, eating); offer support without shame', 'ASAN')
      ],
      moderate: [
        s('Encourage activities that build strength and coordination: swimming, sports, climbing', 'Understood'),
        s('Practice handwriting with multi-sensory approaches (sandpaper letters, sky-writing)', 'Understood'),
        s('Celebrate effort and progress, not perfection in physical tasks', 'ASAN')
      ],
      independent: [
        s('Support development of interests in physical activities or sports', 'Understood'),
        s('Encourage self-chosen movement and exercise', 'ASAN'),
        s('Allow natural development of motor skills at their own pace', 'ASAN')
      ]
    },
    teacher: {
      highNeed: [
        s('Provide extra time and modified expectations for handwriting; allow typed work', 'Understood'),
        s('Use adapted grip aids, sloped desks, or alternative writing tools', 'Understood'),
        s('Break physical tasks into smaller steps with demonstration', 'Understood')
      ],
      moderate: [
        s('Offer movement breaks throughout the day', 'CHADD'),
        s('Accept alternative ways to show learning (verbal responses, typing, drawing)', 'Understood'),
        s('Provide encouragement and model persistence with physical tasks', 'Understood')
      ],
      independent: [
        s('Include student in selection of physical activities and PE modifications', 'ASAN'),
        s('Support participation in sports, arts, or movement-based clubs', 'Understood'),
        s('Celebrate diverse ways of being physical', 'ASAN')
      ]
    }
  },

  'Routine Preference': {
    parent: {
      highNeed: [
        s('Establish consistent daily routines and stick to them; use visual schedules', 'Understood'),
        s('Prepare child in advance for any changes; give multiple warnings before transitions', 'ASAN'),
        s('Create rituals around transitions (10-min warning, countdown timer)', 'CHADD')
      ],
      moderate: [
        s('Maintain consistent meal times, bedtimes, and key routines', 'Understood'),
        s('Prepare for changes with pictures or discussions ahead of time', 'Understood'),
        s('Use visual schedules to show daily flow and upcoming changes', 'CHADD')
      ],
      independent: [
        s('Support their preference for structure while allowing some flexibility', 'ASAN'),
        s('Help them develop their own routines and organizational systems', 'Understood'),
        s('Celebrate their ability to organize and plan', 'ASAN')
      ]
    },
    teacher: {
      highNeed: [
        s('Maintain consistent classroom schedule and provide advance notice of changes', 'CHADD'),
        s('Use visual daily schedule visible to all students', 'Understood'),
        s('Create transition rituals; warn before changes (5-min, 2-min, then transition)', 'CHADD')
      ],
      moderate: [
        s('Keep consistent routines for major activities (start of day, lunch, transitions)', 'CHADD'),
        s('Show upcoming schedule and why changes are happening', 'Understood'),
        s('Allow processing time for changes and unexpected situations', 'ASAN')
      ],
      independent: [
        s('Share schedule changes in advance when possible', 'Understood'),
        s('Support student leadership in organizing classroom routines', 'ASAN'),
        s('Respect their preference for structure as a strength', 'ASAN')
      ]
    }
  },

  'Emotional Regulation': {
    parent: {
      highNeed: [
        s('Teach emotion recognition: name feelings, use emotion charts or color codes', 'Understood'),
        s('Build calm-down toolkit together: breathing techniques, music, movement, sensory items', 'CHADD'),
        s('Stay calm during meltdowns; prioritize safety, comfort, and reconnection', 'ASAN')
      ],
      moderate: [
        s('Validate emotions without trying to \'fix\' them immediately', 'ASAN'),
        s('Teach coping strategies: deep breathing, self-talk, physical activity', 'CHADD'),
        s('Create a feelings journal or art project to express emotions', 'Understood')
      ],
      independent: [
        s('Support development of their own emotion regulation strategies', 'ASAN'),
        s('Respect their emotional style and processing time', 'ASAN'),
        s('Celebrate emotional awareness and self-understanding', 'ASAN')
      ]
    },
    teacher: {
      highNeed: [
        s('Teach explicit emotion regulation: breathing, movement, sensory breaks', 'CHADD'),
        s('Provide a safe space (cool-down area) for when emotions are big', 'Understood'),
        s('Use visual supports: emotion thermometers, zones of regulation, feeling cards', 'Understood')
      ],
      moderate: [
        s('Check in regularly about feelings; validate emotions', 'ASAN'),
        s('Teach self-regulation strategies during calm times for use during stress', 'CHADD'),
        s('Offer choices to promote autonomy and reduce frustration', 'ASAN')
      ],
      independent: [
        s('Create a supportive classroom where feelings are discussed openly', 'ASAN'),
        s('Support peer support and empathy building', 'Understood'),
        s('Model emotional regulation for all students', 'CHADD')
      ]
    }
  }
}

/**
 * Determine support level based on metric score
 * Uses 0-5 scale stratified into three levels:
 * - 0-1: highNeed (significant support required)
 * - 2-3: moderate (some structured support helpful)
 * - 4-5: independent (thriving, minimal support needed)
 * 
 * @param score - Metric score (0-5)
 * @returns Support level classification
 */
function getScoreLevel(score: number): SupportLevel {
  if (score <= 1) return 'highNeed'
  if (score <= 3) return 'moderate'
  return 'independent'
}

/**
 * Generate personalized support recommendations based on current metric scores
 * 
 * Algorithm:
 * 1. Identifies the 3 lowest-scoring metrics (priority areas)
 * 2. For each metric, determines support level based on score
 * 3. Collects top 2 parent + top 2 teacher strategies for each metric/level
 * 4. Combines and deduplicates all strategies
 * 5. Returns unified list suitable for any caregiver type
 * 
 * @param metrics - Current metric values (e.g., { Focus: 5, 'Social Interaction': 3, ... })
 * @returns Recommendations object with parent and teacher strategies combined
 * 
 * @example
 * const metrics = { Focus: 3, 'Social Interaction': 2, ... }
 * const recs = generateRecommendations(metrics)
 * // recs.parent and recs.teacher contain relevant strategies with sources
 */
export function generateRecommendations(metrics: MetricsObject): Recommendations {
  // Handle empty metrics
  if (!metrics || Object.keys(metrics).length === 0) {
    return { parent: [], teacher: [] }
  }

  // Sort metrics by score (lowest first) to identify priority areas
  const sortedMetrics = Object.entries(metrics)
    .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
    .slice(0, 3) // Focus on top 3 lowest-scoring metrics

  // Use Map to deduplicate by strategy text while keeping source info
  const parentStrategies = new Map<string, Strategy>()
  const teacherStrategies = new Map<string, Strategy>()

  // For each priority metric, collect relevant strategies
  for (const [metricName, score] of sortedMetrics) {
    const level = getScoreLevel(score)
    const metricStrategies = supportStrategies[metricName as MetricName]

    if (metricStrategies) {
      // Get parent strategies (top 2)
      const parentStrats = metricStrategies.parent[level]
      if (parentStrats) {
        parentStrats.slice(0, 2).forEach((strat) => {
          if (!parentStrategies.has(strat.text)) {
            parentStrategies.set(strat.text, strat)
          }
        })
      }

      // Get teacher strategies (top 2)
      const teacherStrats = metricStrategies.teacher[level]
      if (teacherStrats) {
        teacherStrats.slice(0, 2).forEach((strat) => {
          if (!teacherStrategies.has(strat.text)) {
            teacherStrategies.set(strat.text, strat)
          }
        })
      }
    }
  }

  return {
    parent: Array.from(parentStrategies.values()),
    teacher: Array.from(teacherStrategies.values())
  }
}
