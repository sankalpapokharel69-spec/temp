/**
 * Cryptographic helper for secure password hashing using Web Crypto PBKDF2 (SHA-256)
 * Salted, zero external library dependency, works in all modern browsers and Cloudflare Workers.
 */

export async function generateSalt(): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return Array.from(salt)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(
  passwordAttempt: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const hashOfAttempt = await hashPassword(passwordAttempt, storedSalt);
  return hashOfAttempt === storedHash;
}
