import mongoose from 'mongoose';
import { config } from './env';

export async function connectDB() {
  await mongoose.connect(config.mongoUri);
  console.log('✅ MongoDB connected');
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
