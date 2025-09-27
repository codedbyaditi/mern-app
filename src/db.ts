import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || '';

export const connectDB = async (mongoUri?: string): Promise<typeof mongoose | null> => {
  const uri = mongoUri || MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set — skipping DB connection (fallback mode)');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, DEFAULT_OPTIONS);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    return mongoose;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    return null;
  }
};

export function getDBState() {
  const readyState = mongoose.connection.readyState; // 0 disconnected,1 connected
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    readyState,
    state: stateMap[readyState] || 'unknown',
    host: mongoose.connection.host || null,
    port: (mongoose.connection.port as number) || null,
  };
}

export default mongoose;
