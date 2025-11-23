/**
 * @file types/libsodium-wrappers-sumo.d.ts
 * @description Type declarations for libsodium-wrappers-sumo
 * This package doesn't have official types, so we declare the minimal subset we use
 */

declare module 'libsodium-wrappers-sumo' {
  interface SodiumPlus {
    ready: Promise<void>;
    randombytes_buf(length: number): Uint8Array;
    from_string(str: string): Uint8Array;
    to_string(buf: Uint8Array): string;
    from_base64(b64: string, variant: number): Uint8Array;
    to_base64(buf: Uint8Array, variant: number): string;
    crypto_generichash(outlen: number, message: Uint8Array): Uint8Array;
    crypto_aead_xchacha20poly1305_ietf_NPUBBYTES: number;
    crypto_aead_xchacha20poly1305_ietf_encrypt(
      message: Uint8Array,
      ad: null | Uint8Array,
      secret: null | Uint8Array,
      nonce: Uint8Array,
      key: Uint8Array
    ): Uint8Array;
    crypto_aead_xchacha20poly1305_ietf_decrypt(
      secret: null | Uint8Array,
      ciphertext: Uint8Array,
      ad: null | Uint8Array,
      nonce: Uint8Array,
      key: Uint8Array
    ): Uint8Array;
    base64_variants: {
      ORIGINAL: number;
      ORIGINAL_NO_PADDING: number;
      URLSAFE: number;
      URLSAFE_NO_PADDING: number;
    };
  }

  const sodium: SodiumPlus;
  export default sodium;
}
