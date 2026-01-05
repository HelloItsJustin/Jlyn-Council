import { useState } from 'react';
import { encrypt, decrypt } from '../utils/jlynCipher';

export function useEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const encryptText = async (text: string): Promise<{ key: string; ciphertext: string }> => {
    setIsEncrypting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = encrypt(text);
    setIsEncrypting(false);
    return result;
  };

  const decryptText = async (ciphertext: string, key: string): Promise<string> => {
    setIsDecrypting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = decrypt(ciphertext, key);
    setIsDecrypting(false);
    return result;
  };

  return {
    encryptText,
    decryptText,
    isEncrypting,
    isDecrypting,
  };
}
