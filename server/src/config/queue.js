import { EventEmitter } from 'events';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

class InMemoryQueue extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.jobs = new Map();
    this.handlers = new Map();
    this.delayedJobs = new Map();
  }

  process(handler) {
    this.handlers.set('default', handler);
  }

  async add(jobName, data, options = {}) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job = { id: jobId, name: jobName, data, opts: options, attempts: 0 };

    if (options.delay && options.delay > 0) {
      const timer = setTimeout(async () => {
        this.delayedJobs.delete(jobId);
        await this._execute(job);
      }, options.delay);
      this.delayedJobs.set(jobId, timer);
      return job;
    }

    setImmediate(async () => {
      await this._execute(job);
    });

    return job;
  }

  async _execute(job) {
    const handler = this.handlers.get('default');
    if (!handler) {
      logger.warn({ queue: this.name, job: job.name }, 'No handler registered for queue job');
      return;
    }

    try {
      await handler(job);
    } catch (err) {
      logger.error({ queue: this.name, job: job.name, error: err.message }, 'Job execution failed in queue');
      this.emit('failed', job, err);
    }
  }
}

// Queue registry
export const emailQueue = new InMemoryQueue('emailQueue');
export const holdExpiryQueue = new InMemoryQueue('holdExpiryQueue');
export const reconciliationQueue = new InMemoryQueue('reconciliationQueue');

logger.info('Initialized in-memory background job queues (hold expiry, email, reconciliation)');
