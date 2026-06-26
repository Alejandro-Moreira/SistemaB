import { createRemoteJWKSet, jwtVerify } from 'jose';
import dotenv from 'dotenv';
dotenv.config();

const KEYCLOAK_URL   = process.env.KEYCLOAK_URL   || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'facturacion-realm';

// URL del endpoint JWKS de Keycloak (claves públicas para verificar firmas)
const JWKS_URL = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`;

let JWKS;
try {
  // Carga las claves públicas de Keycloak
  JWKS = createRemoteJWKSet(new URL(JWKS_URL));
} catch (err) {
  console.error('[keycloakGuard] Error al inicializar JWKS:', err.message);
}

/**
 * Middleware que valida el Bearer token de Keycloak.
 * Rechaza con 401 si el token es inválido, expirado o ausente.
 */
export async function keycloakGuard(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No autorizado: se requiere Authorization: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!JWKS) {
      JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    }

    // Verificar la firma del JWT contra las claves públicas del realm
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
    });

    // Adjuntar el payload al request para uso posterior
    req.user = {
      sub:      payload.sub,
      name:     payload.name,
      email:    payload.email,
      username: payload.preferred_username,
      roles:    payload.realm_access?.roles || [],
    };

    console.log(`[keycloakGuard] Acceso autorizado: ${req.user.username}`);
    next();

  } catch (err) {
    console.warn('[keycloakGuard] Token inválido:', err.message);

    if (err.code === 'ERR_JWT_EXPIRED') {
      return res.status(401).json({ error: 'Token expirado. Vuelve a iniciar sesión.' });
    }

    return res.status(401).json({ error: `Token inválido o no autorizado: ${err.message}` });
  }
}
