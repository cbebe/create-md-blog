#!/usr/bin/env node
import { main } from './main';

(async () => {
  try {
    process.stdout.write(await main());
  } catch (err) {
    process.stderr.write(`${(err as Error).stack as string}\n`);
  }
})();
