const PRINTABLE_ASCII = (() => {
  const chars: string[] = [];
  for (let i = 32; i <= 126; i++) {
    chars.push(String.fromCharCode(i));
  }
  return chars.sort().join('');
})();

const CHARSET_LENGTH = PRINTABLE_ASCII.length;

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export function generateKey(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

export function generateStarMap(key: Uint8Array): number[] {
  let seed = 0;
  for (let i = 0; i < key.length; i++) {
    seed = (seed * 256 + key[i]) % 2147483647;
  }

  const rng = new SeededRandom(seed);
  const indices = Array.from({ length: CHARSET_LENGTH }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

export function encrypt(plaintext: string, key?: Uint8Array): { key: string; ciphertext: string } {
  const encryptionKey = key || generateKey();
  const starMap = generateStarMap(encryptionKey);

  const charToIndex = new Map<string, number>();
  for (let i = 0; i < CHARSET_LENGTH; i++) {
    charToIndex.set(PRINTABLE_ASCII[i], i);
  }

  let ciphertext = '';
  for (const char of plaintext) {
    const index = charToIndex.get(char);
    if (index !== undefined) {
      const mappedIndex = starMap[index];
      ciphertext += PRINTABLE_ASCII[mappedIndex];
    } else {
      ciphertext += char;
    }
  }

  const keyHex = Array.from(encryptionKey)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { key: keyHex, ciphertext };
}

export function decrypt(ciphertext: string, keyHex: string): string {
  const key = new Uint8Array(
    keyHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );

  const starMap = generateStarMap(key);

  const reverseMap = new Array(CHARSET_LENGTH);
  for (let i = 0; i < CHARSET_LENGTH; i++) {
    reverseMap[starMap[i]] = i;
  }

  const charToIndex = new Map<string, number>();
  for (let i = 0; i < CHARSET_LENGTH; i++) {
    charToIndex.set(PRINTABLE_ASCII[i], i);
  }

  let plaintext = '';
  for (const char of ciphertext) {
    const index = charToIndex.get(char);
    if (index !== undefined) {
      const originalIndex = reverseMap[index];
      plaintext += PRINTABLE_ASCII[originalIndex];
    } else {
      plaintext += char;
    }
  }

  return plaintext;
}

export function getCharacterSet(): string {
  return PRINTABLE_ASCII;
}

export { PRINTABLE_ASCII };
