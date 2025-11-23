/**
 * @file lib/encryption.ts
 * @description Symmetric encryption utilities using libsodium
 * 
 * Uses XChaCha20-Poly1305 for authenticated encryption
 * NOTE: This is symmetric encryption. For true post-quantum security,
 * consider adding a KEM like Kyber via liboqs-js in the future.
 */

import sodium from 'libsodium-wrappers-sumo'

/** Track if libsodium has been initialized */
let _sodiumReady = false

/**
 * Initialize the libsodium library
 * Must be called before any encryption/decryption operations
 * Safe to call multiple times (idempotent)
 */
export async function initSodium(): Promise<void> {
  if (_sodiumReady) return
  await sodium.ready
  _sodiumReady = true
}

/**
 * Derive a symmetric encryption key from a JWT
 * Uses libsodium's generic hash function (BLAKE2b) for key derivation
 * 
 * @param jwt - The JWT token to derive from
 * @param context - Optional context string to make key derivation unique (default: 'spectrum-v1')
 * @returns 32-byte symmetric key (suitable for XChaCha20-Poly1305)
 * @throws Error if sodium is not initialized
 */
export function deriveKeyFromJWT(jwt: string, context = 'spectrum-v1'): Uint8Array {
  if (!_sodiumReady) {
    throw new Error('Sodium must be initialized before deriving keys')
  }
  const input = sodium.from_string(jwt + '|' + context)
  const key = sodium.crypto_generichash(32, input)
  return key
}

/**
 * Encrypt data using XChaCha20-Poly1305 AEAD cipher
 * 
 * @param key - 32-byte symmetric key (from deriveKeyFromJWT)
 * @param plaintext - Data to encrypt (will be JSON stringified if not a string)
 * @returns Base64-encoded (URL-safe) string containing: [nonce || ciphertext || tag]
 * @throws Error if encryption fails
 */
export function encryptWithKey(
  key: Uint8Array,
  plaintext: unknown
): string {
  // Generate random nonce
  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  )

  // Prepare message (convert to JSON if not a string)
  const message = sodium.from_string(
    typeof plaintext === 'string' ? plaintext : JSON.stringify(plaintext)
  )

  // Encrypt: returns ciphertext with authentication tag appended
  const cipher = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    message,
    null, // no additional data
    null, // secret key is sufficient
    nonce,
    key
  )

  // Combine nonce and ciphertext using Uint8Array.set
  // (libsodium-wrappers-sumo doesn't export a concat function)
  const combined = new Uint8Array(nonce.length + cipher.length)
  combined.set(nonce, 0)
  combined.set(cipher, nonce.length)

  // Encode to URL-safe Base64 for storage/transmission
  return sodium.to_base64(combined, sodium.base64_variants.URLSAFE)
}

/**
 * Decrypt data encrypted with encryptWithKey
 * 
 * @param key - 32-byte symmetric key (must match encryption key)
 * @param b64 - Base64-encoded ciphertext from encryptWithKey
 * @returns Decrypted data, parsed as JSON object if encrypted data was stringified
 * @throws Error if decryption fails (tampered data, wrong key, or corrupted format)
 */
export function decryptWithKey(
  key: Uint8Array,
  b64: string
): unknown {
  // Decode from Base64
  const raw = sodium.from_base64(b64, sodium.base64_variants.URLSAFE)

  // Extract nonce and ciphertext
  const nonceLength = sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  const nonce = raw.slice(0, nonceLength)
  const cipher = raw.slice(nonceLength)

  // Decrypt: verifies authentication tag and returns plaintext
  const message = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null, // secret key is sufficient
    cipher,
    null, // no additional data
    nonce,
    key
  )

  // Convert to string and parse JSON
  const jsonString = sodium.to_string(message)
  return JSON.parse(jsonString)
}
