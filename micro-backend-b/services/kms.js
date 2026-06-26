import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
dotenv.config();

const KMS_MODE = process.env.KMS_MODE || 'mock';

// For the local mock, we use a stable mock master key derived from a seed or a static buffer.
// Let's use a 32-byte key.
const MOCK_MASTER_KEY = crypto.scryptSync('applebox-studios-kms-master-secret-key-salt-seed', 'salt', 32);

// AWS KMS client setup (only if KMS_MODE === 'aws')
let kmsClient = null;
if (KMS_MODE === 'aws') {
  const isLocalStack = process.env.KMS_ENDPOINT === 'http://localhost:4566';
  kmsClient = new KMSClient({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(isLocalStack && {
      endpoint: process.env.KMS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    }),
  });
}

/**
 * Desencripta una data key usando KMS (o el mock local).
 * @param {string} encryptedKeyBase64 - La data key encriptada en Base64
 * @returns {Promise<Buffer>} - La data key en texto plano
 */
export async function decryptDataKey(encryptedKeyBase64) {
  if (KMS_MODE === 'mock') {
    // Mock decrypt: encryptedKeyBase64 contains iv + encrypted data key
    const encryptedBuffer = Buffer.from(encryptedKeyBase64, 'base64');
    
    if (encryptedBuffer.length < 32) {
      throw new Error('El buffer encriptado es demasiado corto en modo mock.');
    }
    
    const iv = encryptedBuffer.subarray(0, 16);
    const ciphertext = encryptedBuffer.subarray(16);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', MOCK_MASTER_KEY, iv);
    const plainKey = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    
    return plainKey;
  } else {
    // Real AWS / LocalStack KMS
    const encryptedKeyBuffer = Buffer.from(encryptedKeyBase64, 'base64');
    const command = new DecryptCommand({
      CiphertextBlob: encryptedKeyBuffer,
    });
    
    const response = await kmsClient.send(command);
    if (!response.Plaintext) {
      throw new Error('KMS no devolvió la llave en texto plano');
    }
    return Buffer.from(response.Plaintext);
  }
}

/**
 * Encripta una data key (usado por el mock para simular la encriptación de claves).
 * @param {Buffer} plainKey - La data key en texto plano
 * @returns {Promise<string>} - La data key encriptada en Base64
 */
export async function encryptDataKey(plainKey) {
  if (KMS_MODE === 'mock') {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', MOCK_MASTER_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(plainKey), cipher.final()]);
    const result = Buffer.concat([iv, encrypted]);
    return result.toString('base64');
  } else {
    throw new Error('La encriptación de llaves maestras en modo producción se delega a AWS KMS GenerateDataKey.');
  }
}
