import * as argon2 from 'argon2';
import { randomBytes, createHash, createCipheriv, createDecipheriv } from 'crypto';
import { config } from '@infrastructure/config';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

// Token generation
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

// Encryption/Decryption
const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 32;
const tagLength = 16;

export function encrypt(text: string): string {
  const iv = randomBytes(ivLength);
  const salt = randomBytes(saltLength);

  const key = createHash('sha256')
    .update(config.security.encryption.key + salt.toString('hex'))
    .digest();

  const cipher = createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

export function decrypt(encryptedText: string): string {
  const buffer = Buffer.from(encryptedText, 'base64');

  const salt = buffer.slice(0, saltLength);
  const iv = buffer.slice(saltLength, saltLength + ivLength);
  const tag = buffer.slice(saltLength + ivLength, saltLength + ivLength + tagLength);
  const encrypted = buffer.slice(saltLength + ivLength + tagLength);

  const key = createHash('sha256')
    .update(config.security.encryption.key + salt.toString('hex'))
    .digest();

  const decipher = createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString('utf8');
}

// Hash functions
export function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function md5(data: string): string {
  return createHash('md5').update(data).digest('hex');
}
