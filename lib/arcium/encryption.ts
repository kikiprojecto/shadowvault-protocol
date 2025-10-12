/*
  Encryption utilities for Arcium MPC integration.
  Uses AES-GCM with provided secret key material. No storage side-effects.
*/

export interface KeyMaterial {
  key: CryptoKey
}

export async function importAesKey(rawKey: ArrayBuffer | Uint8Array): Promise<KeyMaterial> {
  const keyData = rawKey instanceof Uint8Array ? rawKey.buffer.slice(0) : rawKey
  const keyArray = new Uint8Array(keyData)
  if (keyArray.byteLength !== 32) {
    throw new Error('AES-256-GCM key must be 32 bytes')
  }
  const key = await crypto.subtle.importKey(
    'raw',
    keyData as ArrayBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
  return { key }
}

export async function encryptData<T>(key: KeyMaterial, data: T, aad?: Uint8Array): Promise<{ ciphertext: Uint8Array; nonce: Uint8Array }> {
  const enc = new TextEncoder()
  const nonce = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = enc.encode(JSON.stringify(data))
  const alg: AesGcmParams = { name: 'AES-GCM', iv: nonce, additionalData: aad ? (aad.buffer.slice(0) as ArrayBuffer) : undefined }
  const ct = new Uint8Array(await crypto.subtle.encrypt(alg, key.key, plaintext))
  return { ciphertext: ct, nonce }
}

export async function decryptData<T>(key: KeyMaterial, ciphertext: Uint8Array, nonce: Uint8Array, aad?: Uint8Array): Promise<T> {
  const alg: AesGcmParams = { name: 'AES-GCM', iv: nonce.buffer.slice(0) as ArrayBuffer, additionalData: aad ? (aad.buffer.slice(0) as ArrayBuffer) : undefined }
  const pt = new Uint8Array(await crypto.subtle.decrypt(alg, key.key, ciphertext.buffer.slice(0) as ArrayBuffer))
  const dec = new TextDecoder()
  return JSON.parse(dec.decode(pt)) as T
}
