import { encrypt, decrypt } from './crypto.utils';

describe('Crypto Utils', () => {
  const originalText = 'Hello, World!';
  const encryptedText = encrypt(originalText);
  const decryptedText = decrypt(encryptedText);

  it('should encrypt text', () => {
    expect(encryptedText).not.toBe(originalText);
    expect(encryptedText).toContain(':');
  });

  it('should decrypt text', () => {
    expect(decryptedText).toBe(originalText);
  });
});
