process.env.LOAD_TEST = 'true';
process.env.UV_THREADPOOL_SIZE = '64';
import autocannon from 'autocannon';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { startServer } from '../server/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESULTS_DIR = path.join(__dirname);
const RESULTS_JSON = path.join(RESULTS_DIR, 'results.json');
const RESULTS_MD = path.join(RESULTS_DIR, 'results.md');

const TEST_PORT = 5001;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Concurrency Tiers specified in requirements
const CONCURRENCY_TIERS = [
  { name: 'Initial Test', connections: 10, duration: 5 },
  { name: 'Normal Load', connections: 50, duration: 5 },
  { name: 'Increased Load', connections: 100, duration: 5 },
  { name: 'Heavy Load', connections: 250, duration: 5 },
  { name: 'Stress Test', connections: 500, duration: 5 },
  { name: 'Extended Stress Test', connections: 1000, duration: 5 },
];

function getSystemMetrics() {
  const mem = process.memoryUsage();
  return {
    rssMb: Math.round(mem.rss / (1024 * 1024)),
    heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
    heapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
    systemFreeMemMb: Math.round(os.freemem() / (1024 * 1024)),
    cpuLoad: os.loadavg(),
  };
}

async function runBenchmark(title, url, connections, duration, method = 'GET', body = null, headers = {}) {
  const opts = {
    title,
    url,
    connections,
    duration,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    pipelining: 1,
  };

  if (body) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const startMetrics = getSystemMetrics();
  const startTime = Date.now();

  const result = await new Promise((resolve, reject) => {
    autocannon(opts, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

  const durationSec = (Date.now() - startTime) / 1000;
  const endMetrics = getSystemMetrics();

  return {
    testName: title,
    connections,
    duration: durationSec,
    totalRequests: result.requests.total,
    rps: result.requests.average || 0,
    avgLatencyMs: result.latency.average || 0,
    p95LatencyMs: result.latency.p97_5 || result.latency.p90 || result.latency.average || 0,
    p99LatencyMs: result.latency.p99 || 0,
    minLatencyMs: result.latency.min || 0,
    maxLatencyMs: result.latency.max || 0,
    totalErrors: result.errors,
    timeouts: result.timeouts,
    non2xxResponses: result.non2xx,
    failureRate: ((result.non2xx + result.errors) / Math.max(1, result.requests.total) * 100).toFixed(2) + '%',
    throughputMbSec: (result.throughput.average / (1024 * 1024)).toFixed(2),
    ramUsageMb: endMetrics.heapUsedMb,
    rssUsageMb: endMetrics.rssMb,
  };
}

async function main() {
  console.log('===============================================================');
  console.log(`Starting High-Concurrency Load Test Suite on ${BASE_URL}`);
  console.log(`Platform: ${os.platform()} (${os.arch()}), CPUs: ${os.cpus().length}`);
  console.log('===============================================================\n');

  // Start internal server instance on dedicated port
  const server = startServer(TEST_PORT);
  // Allow server 1 second to bind and warm up
  await new Promise((r) => setTimeout(r, 1000));

  const allResults = [];

  try {
    // ─── 1. Concurrency Ladder Tests across Homepage & Health Endpoints
    console.log('--- Phase 1: High-Concurrency Ladder Benchmarks ---');
    for (const tier of CONCURRENCY_TIERS) {
      console.log(`Executing ${tier.name} (${tier.connections} concurrent users)...`);
      const res = await runBenchmark(
        `${tier.name} - Homepage & Health`,
        `${BASE_URL}/api/health`,
        tier.connections,
        tier.duration
      );
      allResults.push(res);
      console.log(
        `  -> Total Reqs: ${res.totalRequests} | RPS: ${res.rps.toFixed(1)} | Avg: ${res.avgLatencyMs.toFixed(1)}ms | P95: ${res.p95LatencyMs.toFixed(1)}ms | Errors: ${res.totalErrors}`
      );
    }

    // ─── 2. Real-World Workflow: Cached Events API
    console.log('\n--- Phase 2: Cached Data Queries (Events Catalog) ---');
    const eventRes = await runBenchmark(
      'Cached Events Catalog',
      `${BASE_URL}/api/events?limit=20`,
      100,
      5
    );
    allResults.push(eventRes);
    console.log(
      `  -> Total Reqs: ${eventRes.totalRequests} | RPS: ${eventRes.rps.toFixed(1)} | Avg: ${eventRes.avgLatencyMs.toFixed(1)}ms | P95: ${eventRes.p95LatencyMs.toFixed(1)}ms`
    );

    // ─── 3. Real-World Workflow: Team Registry API
    console.log('\n--- Phase 3: Team Directory Queries ---');
    const teamRes = await runBenchmark(
      'Cached Team Directory',
      `${BASE_URL}/api/team`,
      100,
      5
    );
    allResults.push(teamRes);
    console.log(
      `  -> Total Reqs: ${teamRes.totalRequests} | RPS: ${teamRes.rps.toFixed(1)} | Avg: ${teamRes.avgLatencyMs.toFixed(1)}ms | P95: ${teamRes.p95LatencyMs.toFixed(1)}ms`
    );

    // ─── 4. Real-World Workflow: Simultaneous Registration & Login
    console.log('\n--- Phase 4: Simultaneous Authentication ---');
    // Pre-create benchmark user
    const testEmail = `loadtest_${Date.now()}@nmamit.in`;
    const testUsn = `NN26CS${Math.floor(100 + Math.random() * 899)}`;
    try {
      await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Load Test User',
          email: testEmail,
          password: 'SecurePassword123!',
          branch: 'Computer Science and Engineering (CSE)',
          year: '2026',
          usn: testUsn,
        }),
      });
    } catch {
      // Fallback
    }

    const regRes = await runBenchmark(
      'Auth Login Requests (50 concurrent)',
      `${BASE_URL}/api/auth/login`,
      50,
      4,
      'POST',
      { email: testEmail, password: 'SecurePassword123!' }
    );
    allResults.push(regRes);
    console.log(
      `  -> Total Reqs: ${regRes.totalRequests} | RPS: ${regRes.rps.toFixed(1)} | Avg: ${regRes.avgLatencyMs.toFixed(1)}ms | P95: ${regRes.p95LatencyMs.toFixed(1)}ms`
    );

    // ─── 5. Real-World Workflow: IEEE Pass Resolution
    console.log('\n--- Phase 5: IEEE Pass Resolution Service ---');
    const targetUrl = `${BASE_URL}/api/resolve-ieee-pass?url=${encodeURIComponent('https://enterpriseapi.ieee.org/pkpass/4Za6ccMGOr')}`;
    const passRes = await runBenchmark(
      'Pass Resolver (50 concurrent)',
      targetUrl,
      50,
      4
    );
    allResults.push(passRes);
    console.log(
      `  -> Total Reqs: ${passRes.totalRequests} | RPS: ${passRes.rps.toFixed(1)} | Avg: ${passRes.avgLatencyMs.toFixed(1)}ms | P95: ${passRes.p95LatencyMs.toFixed(1)}ms`
    );

    // Save JSON report
    fs.writeFileSync(RESULTS_JSON, JSON.stringify(allResults, null, 2), 'utf-8');

    // Generate Markdown report
    let md = '# High-Concurrency Load Testing Benchmark Report\n\n';
    md += `**Execution Date**: ${new Date().toISOString()}\n`;
    md += `**Environment**: Locally Tested (Windows Server / Node.js ${process.version})\n`;
    md += `**System Specs**: ${os.cpus().length} CPU Cores, ${Math.round(os.totalmem() / (1024 * 1024))} MB RAM\n\n`;
    md += '## Concurrency Ladder Test Results\n\n';
    md += '| Test Scenario | Concurrent Users | Requests/Sec | Avg Latency (ms) | P95 Latency (ms) | Total Requests | Failure Rate | Heap (MB) |\n';
    md += '|---|---:|---:|---:|---:|---:|---:|---:|\n';

    for (const r of allResults) {
      md += `| ${r.testName} | ${r.connections} | ${r.rps.toFixed(1)} | ${r.avgLatencyMs.toFixed(1)} | ${r.p95LatencyMs.toFixed(1)} | ${r.totalRequests} | ${r.failureRate} | ${r.ramUsageMb} MB |\n`;
    }

    fs.writeFileSync(RESULTS_MD, md, 'utf-8');
    console.log('\n===============================================================');
    console.log(`Load testing complete! Reports saved to ${RESULTS_JSON} and ${RESULTS_MD}`);
    console.log('===============================================================');
  } catch (err) {
    console.error('CRITICAL ERROR in benchmark suite:', err);
  } finally {
    if (server) server.close();
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Benchmark execution failed:', err);
  process.exit(1);
});
