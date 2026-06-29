import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import decryptRouter from './routes/decrypt.js';
import { keycloakGuard } from './middleware/keycloakGuard.js';

dotenv.config();

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3003;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3002';

// Configure CORS to only accept requests from the main billing system (Sistema A)
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));

// Public health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'micro-backend-b', time: new Date() });
});

// Protect decryption endpoint with Keycloak verification middleware
app.use('/decrypt', keycloakGuard, decryptRouter);

// Start server
app.listen(PORT, () => {
  console.log(`[micro-backend-b] Servidor de descifrado iniciado.`);
  console.log(`[micro-backend-b] URL: http://localhost:${PORT}`);
  console.log(`[micro-backend-b] CORS configurado para origen: ${ALLOWED_ORIGIN}`);
});
