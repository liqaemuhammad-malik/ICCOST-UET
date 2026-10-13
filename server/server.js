import { app } from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { logger } from './src/utils/logger.js';
import { runSeed } from './src/seed/seed.js';
import { ParticipantCategory } from './src/modules/categories/category.model.js';

async function bootstrap() {
  try {
    await connectDB();

    // Auto-seed if database has no categories yet
    const categoryCount = await ParticipantCategory.countDocuments();
    if (categoryCount === 0) {
      logger.info('Fresh database detected. Automatically running initial seed...');
      await runSeed();
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`================================================================`);
      logger.info(`  ICOSST 2026 Backend Platform Server running on port ${env.PORT}  `);
      logger.info(`  Environment: ${env.NODE_ENV} | Client URL: ${env.CLIENT_URL} `);
      logger.info(`  Health check: http://localhost:${env.PORT}/health              `);
      logger.info(`================================================================`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      logger.info({ signal }, 'Graceful shutdown initiated...');
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        process.exit(0);
      });

      // Force exit if not completed within 5 seconds
      setTimeout(() => {
        logger.error('Forcefully terminating process');
        process.exit(1);
      }, 5000);
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (err) {
    logger.error({ err }, 'Fatal error during server bootstrap');
    process.exit(1);
  }
}

bootstrap();
