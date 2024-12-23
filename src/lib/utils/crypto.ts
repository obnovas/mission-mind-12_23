export async function generateNonce(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

export async function hashNonce(nonce: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateNoncePair(): Promise<{ nonce: string; hashedNonce: string }> {
  const nonce = await generateNonce();
  const hashedNonce = await hashNonce(nonce);
  return { nonce, hashedNonce };
}