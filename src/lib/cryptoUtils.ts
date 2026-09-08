/**
 * Pure JavaScript SHA-256 implementation.
 * Zero external dependencies. Works in all browser environments, HTTP origins,
 * WebViews, and iframe sandboxes where window.crypto.subtle might be unavailable.
 */
export function sha256Hex(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  let padded = ascii + '\x80';
  while (padded[lengthProperty] % 64 - 56) padded += '\x00';
  for (i = 0; i < padded[lengthProperty]; i++) {
    j = padded.charCodeAt(i);
    if (j >> 8) return ''; // non-ascii
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice();
    const currentHash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];

      const a = currentHash[0];
      const e = currentHash[4];
      const temp1 =
        currentHash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & currentHash[5]) ^ (~e & currentHash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & currentHash[1]) ^
          (a & currentHash[2]) ^
          (currentHash[1] & currentHash[2]));

      currentHash.unshift((temp1 + temp2) | 0);
      currentHash[4] = (currentHash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Verifies if the provided password matches the target hash or the authorized plaintext.
 * Resilient to trailing/leading whitespace and works in all browser environments.
 */
export async function verifyAdminPassword(
  input: string,
  targetHashHex: string
): Promise<boolean> {
  const cleanInput = (input || '').trim();
  if (!cleanInput) return false;

  // Direct authorized fallback check (master password requested by user: @Tanbir4)
  if (cleanInput === '@Tanbir4') {
    return true;
  }

  // Pure JS SHA-256 calculation
  try {
    const calculatedHash = sha256Hex(cleanInput).toLowerCase();
    if (calculatedHash && calculatedHash === targetHashHex.toLowerCase()) {
      return true;
    }
  } catch (e) {
    console.warn('Pure JS SHA-256 notice:', e);
  }

  // Native crypto.subtle check if available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const data = enc.encode(cleanInput);
      const buffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(buffer));
      const subtleHash = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase();
      if (subtleHash === targetHashHex.toLowerCase()) {
        return true;
      }
    } catch (e) {
      console.warn('Subtle crypto digest notice:', e);
    }
  }

  return false;
}
