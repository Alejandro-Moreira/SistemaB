import React, { useState, useEffect } from 'react';

/**
 * Facturas Component
 * Displays secure invoices for AppleBox Directors (Marco, Ana).
 * Fetches encrypted invoices from Sistema A (3002) which forwards decryption to Micro-backend B (3003).
 */
export default function Facturas({ keycloak }) {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default demo invoices list to choose from
  const demoInvoiceIds = [1, 2, 3];

  const fetchSecureInvoice = async (id) => {
    setLoading(true);
    setError(null);
    setSelectedInvoice(null);
    try {
      const token = keycloak.token;
      console.log("[Facturas] Fetching secure invoice ID:", id);
      const response = await fetch(`http://localhost:3002/api/facturas/${id}/seguro`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("No tienes autorización. Asegúrate de estar logueado con Keycloak.");
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Error del servidor (${response.status})`);
      }

      const data = await response.json();
      console.log("[Facturas] Decrypted data received:", data);
      setSelectedInvoice(data.invoice);
    } catch (err) {
      console.error("[Facturas] Error fetching secure invoice:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section pt-nav" style={{ minHeight: '80vh', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="label">Panel de Facturación</div>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', marginBottom: '2rem', letterSpacing: '0.05em' }}>
        FACTURAS DE DIRECTORES (VÍA KMS + KEYCLOAK)
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '20px' }}>
        {/* Left column: List of invoices */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#888' }}>Seleccione una factura</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {demoInvoiceIds.map((id) => (
              <button
                key={id}
                onClick={() => fetchSecureInvoice(id)}
                style={{
                  background: 'var(--dark)',
                  border: '1px solid var(--mid)',
                  padding: '20px',
                  textAlign: 'left',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--white)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--mid)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--white)' }}>
                    Factura #{id}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4px' }}>
                    Click para solicitar desencriptación KMS
                  </div>
                </div>
                <span style={{ color: '#2980b9', fontWeight: 'bold' }}>Ver →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Invoice details or states */}
        <div style={{ background: 'var(--dark)', border: '1px solid var(--mid)', padding: '32px', borderRadius: '4px', position: 'relative', minHeight: '300px' }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{
                width: 30, height: 30,
                border: '2px solid #333',
                borderTop: '2px solid #2980b9',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginBottom: '10px'
              }} />
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Obteniendo payload cifrado y desencriptando con KMS...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && (
            <div style={{ borderLeft: '4px solid #c0392b', padding: '15px', background: 'rgba(192, 57, 43, 0.1)', height: '100%' }}>
              <h4 style={{ color: '#c0392b', marginBottom: '8px', fontWeight: 'bold' }}>Error de Seguridad</h4>
              <p style={{ fontSize: '0.95rem' }}>{error}</p>
            </div>
          )}

          {!loading && !error && !selectedInvoice && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)' }}>
              <p>Seleccione una factura de la izquierda para ver su contenido desencriptado en tiempo real.</p>
            </div>
          )}

          {!loading && !error && selectedInvoice && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--mid)', paddingBottom: '15px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--white)' }}>
                    {selectedInvoice.numero}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Fecha: {selectedInvoice.fecha}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#27ae60', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {selectedInvoice.estado || 'Procesada'}
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '5px' }}>Pago: {selectedInvoice.forma_pago}</p>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h5 style={{ color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  Cliente
                </h5>
                <p style={{ fontWeight: 600 }}>{selectedInvoice.cliente}</p>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--mid)', textAlign: 'left', color: 'var(--muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '8px 0' }}>Descripción</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Cant.</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Precio</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '12px 0' }}>{item.descripcion}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>{item.cantidad}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>${item.valor || item.precio}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>${(item.cantidad * (item.valor || item.precio)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid var(--mid)', paddingTop: '15px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem', marginRight: '15px' }}>Total Factura:</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#27ae60' }}>
                    ${parseFloat(selectedInvoice.monto).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', background: 'rgba(39, 174, 96, 0.1)', border: '1px solid #27ae60', padding: '12px', borderRadius: '4px', fontSize: '0.8rem', color: '#27ae60' }}>
                🔒 <strong>Criptografía Activa:</strong> Esta información fue almacenada encriptada con AES-256-GCM. La clave de datos fue descifrada en tiempo real utilizando la clave maestra KMS, previa validación del rol del usuario mediante Keycloak.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
