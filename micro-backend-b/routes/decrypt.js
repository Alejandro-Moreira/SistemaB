import express from 'express';
import crypto from 'node:crypto';
import { decryptDataKey } from '../services/kms.js';

const router = express.Router();

/**
 * POST /decrypt
 *
 * Body esperado:
 * {
 *   "encryptedData": "<base64 del ciphertext AES-GCM>",
 *   "encryptedKey":  "<base64 de la data key encriptada por KMS>",
 *   "iv":            "<base64 del IV usado en AES-GCM>",
 *   "authTag":       "<base64 del authentication tag de GCM>"
 * }
 *
 * Response:
 * { "invoice": { ...datos de la factura... } }
 */
router.post('/', async (req, res) => {
  try {
    const { encryptedData, encryptedKey, iv, authTag } = req.body;

    if (!encryptedData || !encryptedKey || !iv || !authTag) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: encryptedData, encryptedKey, iv, authTag',
      });
    }

    // PASO 1: Desencriptar la llave de datos con KMS (o mock)
    const plainTextKey = await decryptDataKey(encryptedKey);

    // PASO 2: Desencriptar el ciphertext usando AES-256-GCM
    const ivBuffer = Buffer.from(iv, 'base64');
    const authTagBuffer = Buffer.from(authTag, 'base64');
    const cipherBuffer = Buffer.from(encryptedData, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', plainTextKey, ivBuffer);
    decipher.setAuthTag(authTagBuffer);

    const decryptedBuffer = Buffer.concat([
      decipher.update(cipherBuffer),
      decipher.final(),
    ]);

    // PASO 3: Devolver el JSON descifrado
    const invoice = JSON.parse(decryptedBuffer.toString('utf8'));
    
    console.log(`[/decrypt] Desencriptación exitosa de factura: ${invoice.numero || invoice.id}`);
    return res.status(200).json({ invoice });

  } catch (err) {
    console.error('[/decrypt] Error de desencriptación:', err.message);
    return res.status(500).json({
      error: `Error al desencriptar: ${err.message}`,
    });
  }
});

export default router;
