#!/usr/bin/env node
const { spawn } = require('node:child_process')
const waitnrun = require('./index');

const commands = process.argv.splice(2); // ['npx', 'waitnrun', ':3000'] -> [':3000']
waitnrun(commands).then(procs => {
  procs.forEach(proc => proc?.kill?.());
  process.exit();
});