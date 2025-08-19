import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { config } from './config/env';
import { generalRateLimit } from './middleware/rateLimit';
import { errorHandler } from './middleware/error';

import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import candidateRoutes from './routes/candidates';
import applicationRoutes from './routes/applications';
import accountRoutes from './routes/accounts';
import opportunityRoutes from './routes/opportunities';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(generalRateLimit);
app.use(express.json({ limit: '1mb' }));
if (config.nodeEnv !== 'test') app.use(morgan('combined'));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/opportunities', opportunityRoutes);

app.use('*', (_req, res) => res.status(404).json({ error: { message: 'Route not found' } }));
app.use(errorHandler);

async function main() {
  await connectDB();
  app.listen(config.port, () => console.log(`🚀 API on :${config.port}`));
}

if (require.main === module) main();

export default app;