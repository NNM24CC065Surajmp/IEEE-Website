import cluster from 'cluster';
import os from 'os';
import { startServer } from './index.js';

/**
 * Cluster Controller
 * Spawns worker processes across CPU cores for maximum concurrency.
 * Supports scaling from 50-100 to 1,000+ concurrent requests.
 */
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`[Primary ${process.pid}] Launching IEEE cluster with ${numCPUs} CPU cores...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`[Primary] Worker ${worker.process.pid} died (${signal || code}). Auto-restarting replacement...`);
    cluster.fork();
  });
} else {
  // Worker process
  startServer();
}
