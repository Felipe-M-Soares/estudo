import { spawn } from 'node:child_process';

const env = {
  ...process.env,
  HOST: '127.0.0.1',
  PORT: process.env.PORT ?? '8787',
  REQUIRE_LICENSE: process.env.REQUIRE_LICENSE ?? 'true',
  SEED_DEMO_LICENSE: process.env.SEED_DEMO_LICENSE ?? 'false',
};

const children = [
  spawn(process.execPath, ['server/server.mjs'], { env, stdio: 'inherit' }),
  spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev:vite', '--', '--host', '127.0.0.1'], {
    env,
    stdio: 'inherit',
  }),
];

function stopAll(signal = 'SIGTERM') {
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopAll(signal);
    process.exit(signal === 'SIGINT' ? 130 : 143);
  });
}

for (const child of children) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stopAll();
      process.exit(code);
    }
  });
}
