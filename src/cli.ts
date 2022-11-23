#!/usr/bin/env node

import { runApp } from './app';

// Standard async IIFE for top-level-await.
(async () => {
  await runApp();
})();
