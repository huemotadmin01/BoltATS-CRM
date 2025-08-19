import dotenv from 'dotenv';
dotenv.config();

const get = (k: string, def = '') => process.env[k] ?? def;

export const config = {
  nodeEnv: get('NODE_ENV', 'development'),
  port: Number(get('PORT', '4000')),
  mongoUri: get('MONGODB_URI', get('MONGO_URL', 'mongodb://127.0.0.1:27017/atscrm')),
  jwtSecret: get('JWT_SECRET', 'changeme'),
  corsOriginsRaw: get('CORS_ORIGINS', 'http://localhost:5173'),
  get corsOrigins(): string[] {
    const raw = this.corsOriginsRaw;
    return Array.isArray(raw) ? raw : raw.split(',').map(s => s.trim()).filter(Boolean);
  }
};
