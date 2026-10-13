import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let memoryServerInstance = null;

export async function connectDB() {
  const mongoUri = env.MONGODB_URI;

  try {
    logger.info({ uri: mongoUri.replace(/\/\/.*@/, '//***@') }, 'Attempting MongoDB connection...');
    
    // Attempt connecting to the configured URI with a 3-second timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true,
    });

    logger.info('Connected to MongoDB successfully');
    return mongoose.connection;
  } catch (err) {
    logger.warn({ error: err.message }, 'Could not connect to configured MongoDB URI. Launching embedded MongoMemoryReplSet (zero-docker mode)...');

    try {
      const { MongoMemoryReplSet } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: 'wiredTiger' },
      });

      const memoryUri = memoryServerInstance.getUri();
      logger.info({ uri: memoryUri }, 'Embedded MongoMemoryReplSet started successfully');

      await mongoose.connect(memoryUri, {
        autoIndex: true,
      });

      logger.info('Connected to embedded MongoDB Replica Set successfully');
      return mongoose.connection;
    } catch (fallbackErr) {
      logger.error({ error: fallbackErr.message }, 'Failed to start embedded MongoDB fallback');
      throw fallbackErr;
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
  logger.info('MongoDB disconnected');
}
