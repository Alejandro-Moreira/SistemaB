import Keycloak from 'keycloak-js';

/**
 * Instancia singleton de Keycloak para el panel de directores AppleBox.
 * Realm: facturacion-realm | Client: applebox-web (público, PKCE)
 */
const keycloak = new Keycloak({
  url:      'http://localhost:8080',
  realm:    'facturacion-realm',
  clientId: 'applebox-web',
});

export default keycloak;
