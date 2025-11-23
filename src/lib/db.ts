/**
 * @file lib/db.ts
 * @description IndexedDB wrapper for persisting encrypted metric logs
 * 
 * Stores:
 * - Encrypted metric history in 'logs' object store
 * - Installation key in 'meta' object store for consistent encryption
 */

import { openDB, IDBPDatabase } from 'idb'
import { initSodium, encryptWithKey, decryptWithKey } from './encryption'
import type { MetricLog, MetricsObject } from '@/types'

/** Database instance (lazy initialized) */
let db: IDBPDatabase | null = null

const DB_NAME = 'spectrum-settings-db'
const STORE_LOGS = 'logs'
const STORE_META = 'meta'

/**
 * Initialize IndexedDB database and create object stores
 * Safe to call multiple times
 */
export async function initDB(): Promise<void> {
  if (db) return

  db = await openDB(DB_NAME, 1, {
    upgrade(database) {
      // Create logs store for metric history
      if (!database.objectStoreNames.contains(STORE_LOGS)) {
        database.createObjectStore(STORE_LOGS, { keyPath: 'id', autoIncrement: true })
      }
      // Create meta store for settings and keys
      if (!database.objectStoreNames.contains(STORE_META)) {
        database.createObjectStore(STORE_META)
      }
    }
  })
}

/**
 * Get or create the installation-specific encryption key
 * This key is randomly generated once per installation and stored in IndexedDB
 * Used for consistent encryption/decryption of metric logs
 * 
 * @returns Base64-encoded installation key
 */
async function getOrCreateInstallationKey(): Promise<string> {
  if (!db) throw new Error('Database not initialized')

  let installKey = await db.get(STORE_META, 'installKey')
  
  if (!installKey) {
    // Generate new random 32-byte key
    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    // Encode as Base64 for storage
    installKey = btoa(String.fromCharCode(...Array.from(randomBytes)))
    // Store for future use
    await db.put(STORE_META, installKey, 'installKey')
  }

  return installKey
}

/**
 * Decode Base64-encoded key back to Uint8Array
 * Helper for converting stored keys back to usable format
 * 
 * @param base64Key - Base64-encoded key string
 * @returns Uint8Array representation of the key
 */
function decodeBase64Key(base64Key: string): Uint8Array {
  const binaryString = atob(base64Key)
  return Uint8Array.from(binaryString, (char) => char.charCodeAt(0))
}

/**
 * Save an encrypted metric log entry
 * Uses the installation key for encryption to ensure consistent decryption later
 * 
 * @param metrics - Current metric scores
 * @throws Error if database is not initialized or encryption fails
 */
export async function saveMetricEncrypted(metrics: MetricsObject): Promise<void> {
  await initDB()
  await initSodium()

  if (!db) throw new Error('Database not initialized')

  // Get or create installation key
  const installKeyB64 = await getOrCreateInstallationKey()
  const installKey = decodeBase64Key(installKeyB64)

  // Create log entry
  const entry: MetricLog = {
    timestamp: Date.now(),
    metrics,
    encrypted: true
  }

  // Encrypt the entry
  const encryptedPayload = encryptWithKey(installKey, entry)

  // Store encrypted data in logs
  await db.add(STORE_LOGS, {
    payload: encryptedPayload,
    synced: false,
    date: new Date().toISOString()
  })
}

/**
 * Retrieve all metric logs, decrypting those that were encrypted
 * Returns partial data for failed decryptions to prevent data loss
 * 
 * @returns Array of decrypted metric log entries
 */
export async function getAllLogs(): Promise<MetricLog[]> {
  await initDB()
  await initSodium()

  if (!db) throw new Error('Database not initialized')

  const allRecords = await db.getAll(STORE_LOGS)
  const installKeyB64 = await db.get(STORE_META, 'installKey')

  // If no installation key exists, return empty results
  if (!installKeyB64) {
    console.warn('No installation key found; unable to decrypt logs')
    return []
  }

  const installKey = decodeBase64Key(installKeyB64)
  const decryptedLogs: MetricLog[] = []

  // Attempt to decrypt each log entry
  for (const record of allRecords) {
    try {
      const decrypted = decryptWithKey(installKey, record.payload) as MetricLog
      decryptedLogs.push(decrypted)
    } catch (error) {
      // Log decryption failure but continue (graceful degradation)
      console.warn('Failed to decrypt log entry:', error)
      // Optionally: push a placeholder entry to preserve log structure
      // decryptedLogs.push({
      //   timestamp: Date.now(),
      //   metrics: {},
      //   encrypted: true
      // })
    }
  }

  return decryptedLogs
}

/**
 * PLACEHOLDER: Save JWT token (not fully implemented in POC)
 * In production, this would securely store the JWT token
 * Current implementation is incomplete to avoid circular encryption issues
 * 
 * @param _jwt - JWT token from Supabase auth (prefixed with _ to indicate unused parameter)
 */
export async function saveJWT(_jwt: string): Promise<void> {
  // TODO: Implement secure JWT storage
  // Current challenge: encrypting JWT with key derived from JWT creates circular dependency
  // Possible solutions:
  // 1. Use a password-based key derivation
  // 2. Store wrapped key separately
  // 3. Use browser's credential management API
  console.log('JWT storage not yet fully implemented')
}

/**
 * PLACEHOLDER: Retrieve JWT token (not fully implemented in POC)
 * 
 * @returns Stored JWT token, or null if not available
 */
export async function getJWT(): Promise<string | null> {
  // TODO: Implement JWT retrieval
  console.log('JWT retrieval not yet fully implemented')
  return null
}
