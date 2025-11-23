/**
 * @file lib/supabaseClient.ts
 * @description Supabase client factory for authentication
 * 
 * Creates a singleton Supabase client initialized with environment variables
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set
 */

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

/** Singleton Supabase client instance */
let client: SupabaseClient | null = null

/**
 * Get or create the Supabase client
 * Reads credentials from environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 * 
 * @returns Initialized Supabase client
 * @throws Error if environment variables are not set
 */
export function createClient(): SupabaseClient {
  // Return existing client if already initialized
  if (client) return client

  // Read environment variables
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

  // Validate credentials
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase credentials. ' +
      'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    )
  }

  // Create and cache client
  client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return client
}
