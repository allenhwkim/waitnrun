#!/usr/bin/env node
const waitFor = require('./wait-for');

(async function() {
  await waitFor(10);
  console.log('DONE');
})();