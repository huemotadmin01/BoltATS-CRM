import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { connectDB } from '@/config/db';
import { config } from '@/config/env';
import { specs } from '@/config/swagger';

// routes (adjust paths to what you actually have)
import healthRoutes from '@/routes/health';
import authRoutes from '@/routes/auth';
import jobRoutes from '@/routes/jobs';
import candidateRoutes from '@/routes/candidates';
import applicationRoutes from '@/routes/applications';
import accountRoutes from '@/routes/accounts';
import opportunityRoutes from '@/routes/opportunities';

const app = express();

// trust proxy (good for Render)
app.set('trust proxy', 1);

// security
app.use(helmet());

// CORS: allow list
const allowed = new Set(config.corsOrigins);
app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser tools & same-origin
      if (!origin || allowed.has(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ATS + CRM API'
}));

// routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/opportunities', opportunityRoutes);

// 404
app.use('*', (_req, res) => {
  return res.status(404).json({ error: { message: 'Route not found', code: 'ROUTE_NOT_FOUND' } });
});

// start
async function main() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 Server on :${config.port}`);
    console.log(`📚 Docs -> http://localhost:${config.port}/docs`);
  });
}

if (require.main === module) {
  // @ts-ignore - using CommonJS runtime check in TS
  main().catch((e) => {
    console.error('❌ Failed to start', e);
    process.exit(1);
  });
}

export default app;
