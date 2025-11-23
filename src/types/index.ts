/**
 * @file types/index.ts
 * @description Central location for all shared TypeScript interfaces and types
 * Used across the application to ensure type safety and consistency
 */

/**
 * Represents a single metric score level (0-5)
 */
export type MetricScore = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Maximum score value for metrics
 */
export const MAX_METRIC_SCORE = 5;

/**
 * Represents the three difficulty levels for support strategies
 */
export type SupportLevel = 'highNeed' | 'moderate' | 'independent';

/**
 * Metric names for neurodiversity settings
 */
export type MetricName = 
  | 'Focus'
  | 'Social Interaction'
  | 'Sensory Sensitivity'
  | 'Motor Skills'
  | 'Routine Preference'
  | 'Emotional Regulation';

/**
 * Map of metric names to their current scores (0-5)
 * Example: { Focus: 2, "Social Interaction": 1, ... }
 */
export type MetricsObject = Record<MetricName, MetricScore>;

/**
 * Metadata for a single metric describing its characteristics at a specific score level
 */
export interface MetricLevelInfo {
  score: number;
  description: string;
}

/**
 * Complete definition of a metric with all score levels and descriptions
 */
export interface MetricDefinition {
  name: MetricName;
  description: string;
  levels: MetricLevelInfo[];
}

/**
 * Source attribution for recommendations
 * - CHADD: Children and Adults with ADHD (CDC-funded)
 * - Understood: Understood.org (learning differences)
 * - ASAN: Autistic Self Advocacy Network
 */
export type StrategySource = 'CHADD' | 'Understood' | 'ASAN';

/**
 * A single support strategy with source attribution
 */
export interface Strategy {
  text: string;
  source: StrategySource;
}

/**
 * Recommendations generated based on metric scores
 * Contains support strategies for different audiences
 */
export interface Recommendations {
  parent: Strategy[];
  teacher: Strategy[];
}

/**
 * A single resource with URL and description
 */
export interface Resource {
  title: string;
  url: string;
  description: string;
}

/**
 * Resources grouped by audience
 */
export interface ResourcesByAudience {
  parent: Resource[];
  teacher: Resource[];
}

/**
 * Structure for storing metric history in IndexedDB
 */
export interface MetricLog {
  id?: number;
  timestamp: number;
  metrics: MetricsObject;
  encrypted: boolean;
}
