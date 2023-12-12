#!/usr/bin/env node

import { runApp } from './app';

runApp().catch((err) => {
  console.error(err);
  process.exit(1);
});
