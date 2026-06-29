import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import keycloak from './keycloak';
import reportWebVitals from './reportWebVitals';

/**
 * Root con inicialización de Keycloak.
 * onLoad: 'check-sso' → no fuerza login, solo detecta si ya hay sesión activa
 * en facturacion-realm (SSO con el Sistema A en puerto 3002).
 */
function Root() {
  const [kcReady, setKcReady] = React.useState(false);

  React.useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',           // Obligatorio para clientes públicos
        checkLoginIframe: false,      // Evita problemas de CORS en dev
      })
      .then((authenticated) => {
        console.log(
          '[Keycloak] Init OK — usuario autenticado:',
          authenticated
        );
        if (authenticated) {
          console.log('[Keycloak] Usuario:', keycloak.tokenParsed?.name);
        }
        setKcReady(true);
      })
      .catch((err) => {
        console.warn('[Keycloak] Error de init (continuando sin auth):', err);
        setKcReady(true); // No bloqueamos la UI si Keycloak no responde
      });
  }, []);

  if (!kcReady) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: "'Barlow', sans-serif",
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #333',
          borderTop: '3px solid #f2f2ee',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#888', fontSize: 13, letterSpacing: '0.12em' }}>
          CONECTANDO CON KEYCLOAK…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <App keycloak={keycloak} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Root />
);

reportWebVitals();
