import 'dotenv/config';

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://priyanshusahu:Huemot@1234@cluster0.boeqbxu.mongodb.net/?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  corsOrigins: (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
};