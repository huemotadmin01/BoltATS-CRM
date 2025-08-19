// src/index.ts
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

// ✅ use relative imports so compiled JS doesn't reference "@/..."
import { connectDB } from './config/db';
import { specs } from './config/swagger';

// Route modules (adjust if your filenames differ)
import authRoutes from './routes/auth';
import accountsRoutes from './routes/accounts';
import candidatesRoutes from './routes/candidates';
import jobsRoutes from './routes/jobs';
import opportunitiesRoutes from './routes/opportunities';
import applicationsRoutes from './routes/applications';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// ---------- Security & parsers ----------
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------- CORS (register BEFORE routes) ----------
const allowed = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser tools (curl/postman) with no Origin
      if (!origin) return cb(null, true);

      // Always allow localhost/127.0.0.1 during dev (any port)
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return cb(null, true);
      }

      // If no CORS_ORIGINS provided, allow all
      if (allowed.length === 0) return cb(null, true);

      // Whitelist exact matches from env
      if (allowed.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for ${origin}`));
    },
    credentials: true, // keep if you use cookies; ok to leave true
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Ensure preflight works for any path
app.options('*', cors());

// ---------- Rate limit (basic) ----------
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

// ---------- Health & Docs ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// ---------- API routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/applications', applicationsRoutes);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// ---------- Error handler (last) ----------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Optional: log only in dev
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  const status = err.status || 500;
  res
    .status(status)
    .json({ error: err.message || 'Internal Server Error', status });
});

// ---------- Start ----------
async function start() {
  await connectDB(); // throws if cannot connect
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server on :${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📚 Docs -> http://localhost:${PORT}/docs`);
  });
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start', e);
  process.exit(1);
});

export default app;
