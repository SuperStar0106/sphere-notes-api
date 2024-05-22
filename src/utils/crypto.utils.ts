import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (hash: string): string => {
  const [ivString, encryptedString] = hash.split(':');
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivString, 'hex'),
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedString, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString();
};
