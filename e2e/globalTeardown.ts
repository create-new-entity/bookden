

import { execSync } from 'node:child_process';

export default async () => {
  if (!process.env.CI) {
    return; // do NOT tear down locally by default
  }

  execSync(
    'docker compose -f docker-compose.dev.yml -f docker-compose.e2e.yml down',
    { stdio: 'inherit' }
  );
};
