/**
 * @file lib/recommendations.ts
 * @description Evidence-based recommendation engine for neurodiversity support
 * 
 * Generates personalized support strategies based on metric scores
 * Strategies are stratified by difficulty level (highNeed, moderate, independent)
 * Suitable for parents, teachers, and caregivers
 */

import type { MetricsObject, MetricName, SupportLevel, Recommendations } from '@/types'

/**
 * Support strategies indexed by metric and audience type, then by difficulty level
 * Each level contains evidence-based strategies
 */
type StrategyMap = Record<MetricName, Record<'parent' | 'teacher', Record<SupportLevel, string[]>>>

const supportStrategies: StrategyMap = {
  Focus: {
    parent: {
      highNeed: [
        'Create a quiet, distraction-free workspace with minimal visual stimuli',
        'Use timers and break down tasks into smaller, manageable chunks (Pomodoro technique)',
        'Implement a consistent daily routine to reduce decision fatigue'
      ],
      moderate: [
        'Offer structured activity times with breaks between focused work',
        'Use visual schedules and checklists to help with task organization',
        'Celebrate small wins to maintain motivation'
      ],
      independent: [
        'Continue supporting focus with occasional check-ins',
        'Encourage self-directed projects that match their interests',
        'Model good focus habits and work alongside them sometimes'
      ]
    },
    teacher: {
      highNeed: [
        'Seat student near the front, away from distractions; use preferential seating',
        'Provide written instructions in addition to verbal; use visual supports',
        'Allow use of fidget tools, headphones, or movement breaks as needed'
      ],
      moderate: [
        'Break complex assignments into smaller parts with check-ins',
        'Offer flexible seating and allow movement between tasks',
        'Use multimodal instruction (visual, auditory, kinesthetic)'
      ],
      independent: [
        'Provide choice in how to demonstrate learning',
        'Encourage peer collaboration and group projects',
        'Offer challenge activities to maintain engagement'
      ]
    }
  },

  'Social Interaction': {
    parent: {
      highNeed: [
        'Model social scripts and practice interactions through role-play at home',
        'Create structured social opportunities (clubs, small groups) rather than free-for-all events',
        'Use visual supports (social stories, emotion charts) to teach social cues'
      ],
      moderate: [
        'Support developing 1-2 close friendships over large social circles',
        'Teach self-advocacy and how to ask for help or space',
        'Validate social anxiety and celebrate small social efforts'
      ],
      independent: [
        'Encourage participation in interest-based groups or communities',
        'Support developing their own social strategies and preferences',
        'Respect their natural social style; not everyone needs a large friend group'
      ]
    },
    teacher: {
      highNeed: [
        'Assign a peer buddy or mentor; use structured partner work',
        'Teach explicit social rules and expected behaviors; use visual supports',
        'Allow breaks from social situations when overwhelmed; provide a safe space'
      ],
      moderate: [
        'Facilitate small-group projects with clear roles and responsibilities',
        'Teach and reinforce social skills during teachable moments',
        'Provide choice in group composition when possible'
      ],
      independent: [
        'Include student voice in classroom discussions and community building',
        'Support leadership or mentoring roles if interested',
        'Create inclusive classroom where diverse social styles are valued'
      ]
    }
  },

  'Sensory Sensitivity': {
    parent: {
      highNeed: [
        'Identify specific triggers (sounds, textures, lights) and create predictable sensory environment',
        'Offer calming tools: weighted blankets, noise-canceling headphones, fidget items',
        'Allow withdrawal/quiet time when overwhelmed; don\'t force sensory experiences'
      ],
      moderate: [
        'Provide advance warning of sensory changes (loud events, crowded spaces)',
        'Teach sensory self-regulation: deep breathing, counting, movement breaks',
        'Respect sensory preferences in clothing, food, and activities'
      ],
      independent: [
        'Support self-advocacy about sensory needs to peers and others',
        'Encourage awareness of their own sensory patterns',
        'Celebrate their sensory awareness as a strength'
      ]
    },
    teacher: {
      highNeed: [
        'Reduce sensory triggers: dim lights, minimize clutter, control noise levels',
        'Provide access to quiet space or sensory corner when needed',
        'Give advance notice of assemblies, fire drills, or unusual auditory/visual events'
      ],
      moderate: [
        'Offer headphones during noisy activities; allow movement breaks',
        'Respect seating preferences and classroom positioning needs',
        'Use calming sensory tools (stress balls, fidgets) during instruction'
      ],
      independent: [
        'Allow student input on classroom sensory environment',
        'Support self-regulation strategies during unstructured times',
        'Model sensory awareness and accommodations as normal and positive'
      ]
    }
  },

  'Motor Skills': {
    parent: {
      highNeed: [
        'Practice fine motor skills through play: play dough, threading, puzzles, drawing',
        'Use adapted utensils, pencil grips, or pencil grips to support writing',
        'Be patient with self-care tasks (dressing, eating); offer support without shame'
      ],
      moderate: [
        'Encourage activities that build strength and coordination: swimming, sports, climbing',
        'Practice handwriting with multi-sensory approaches (sandpaper letters, sky-writing)',
        'Celebrate effort and progress, not perfection in physical tasks'
      ],
      independent: [
        'Support development of interests in physical activities or sports',
        'Encourage self-chosen movement and exercise',
        'Allow natural development of motor skills at their own pace'
      ]
    },
    teacher: {
      highNeed: [
        'Provide extra time and modified expectations for handwriting; allow typed work',
        'Use adapted grip aids, sloped desks, or alternative writing tools',
        'Break physical tasks into smaller steps with demonstration'
      ],
      moderate: [
        'Offer movement breaks throughout the day',
        'Accept alternative ways to show learning (verbal responses, typing, drawing)',
        'Provide encouragement and model persistence with physical tasks'
      ],
      independent: [
        'Include student in selection of physical activities and PE modifications',
        'Support participation in sports, arts, or movement-based clubs',
        'Celebrate diverse ways of being physical'
      ]
    }
  },

  'Routine Preference': {
    parent: {
      highNeed: [
        'Establish consistent daily routines and stick to them; use visual schedules',
        'Prepare child in advance for any changes; give multiple warnings before transitions',
        'Create rituals around transitions (10-min warning, countdown timer)'
      ],
      moderate: [
        'Maintain consistent meal times, bedtimes, and key routines',
        'Prepare for changes with pictures or discussions ahead of time',
        'Use visual schedules to show daily flow and upcoming changes'
      ],
      independent: [
        'Support their preference for structure while allowing some flexibility',
        'Help them develop their own routines and organizational systems',
        'Celebrate their ability to organize and plan'
      ]
    },
    teacher: {
      highNeed: [
        'Maintain consistent classroom schedule and provide advance notice of changes',
        'Use visual daily schedule visible to all students',
        'Create transition rituals; warn before changes (5-min, 2-min, then transition)'
      ],
      moderate: [
        'Keep consistent routines for major activities (start of day, lunch, transitions)',
        'Show upcoming schedule and why changes are happening',
        'Allow processing time for changes and unexpected situations'
      ],
      independent: [
        'Share schedule changes in advance when possible',
        'Support student leadership in organizing classroom routines',
        'Respect their preference for structure as a strength'
      ]
    }
  },

  'Emotional Regulation': {
    parent: {
      highNeed: [
        'Teach emotion recognition: name feelings, use emotion charts or color codes',
        'Build calm-down toolkit together: breathing techniques, music, movement, sensory items',
        'Stay calm during meltdowns; prioritize safety, comfort, and reconnection'
      ],
      moderate: [
        'Validate emotions without trying to \'fix\' them immediately',
        'Teach coping strategies: deep breathing, self-talk, physical activity',
        'Create a feelings journal or art project to express emotions'
      ],
      independent: [
        'Support development of their own emotion regulation strategies',
        'Respect their emotional style and processing time',
        'Celebrate emotional awareness and self-understanding'
      ]
    },
    teacher: {
      highNeed: [
        'Teach explicit emotion regulation: breathing, movement, sensory breaks',
        'Provide a safe space (cool-down area) for when emotions are big',
        'Use visual supports: emotion thermometers, zones of regulation, feeling cards'
      ],
      moderate: [
        'Check in regularly about feelings; validate emotions',
        'Teach self-regulation strategies during calm times for use during stress',
        'Offer choices to promote autonomy and reduce frustration'
      ],
      independent: [
        'Create a supportive classroom where feelings are discussed openly',
        'Support peer support and empathy building',
        'Model emotional regulation for all students'
      ]
    }
  }
}

/**
 * Determine support level based on metric score
 * Uses 0-10 scale stratified into three levels:
 * - 0-2: highNeed (significant support required)
 * - 3-6: moderate (some structured support helpful)
 * - 7-10: independent (thriving, minimal support needed)
 * 
 * @param score - Metric score (0-10)
 * @returns Support level classification
 */
function getScoreLevel(score: number): SupportLevel {
  if (score <= 2) return 'highNeed'
  if (score <= 6) return 'moderate'
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
 * // recs.parent and recs.teacher contain relevant strategies
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

  const parentStrategies = new Set<string>()
  const teacherStrategies = new Set<string>()

  // For each priority metric, collect relevant strategies
  for (const [metricName, score] of sortedMetrics) {
    const level = getScoreLevel(score)
    const metricStrategies = supportStrategies[metricName as MetricName]

    if (metricStrategies) {
      // Get parent strategies (top 2)
      const parentStrats = metricStrategies.parent[level]
      if (parentStrats) {
        parentStrats.slice(0, 2).forEach((strat) => parentStrategies.add(strat))
      }

      // Get teacher strategies (top 2)
      const teacherStrats = metricStrategies.teacher[level]
      if (teacherStrats) {
        teacherStrats.slice(0, 2).forEach((strat) => teacherStrategies.add(strat))
      }
    }
  }

  return {
    parent: Array.from(parentStrategies),
    teacher: Array.from(teacherStrategies)
  }
}
