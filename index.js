#!/usr/bin/env node
const { spawn } = require('node:child_process')
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const pkg = require(path.join(process.cwd(), './package.json'));

module.exports = async function(commands) { // ['start-server', 'start-app', 'cypress run']
  const promises = commands.map( (arg, index) => {
    const toWait = arg === commands[commands.length-1]; // if last, wait until done, then exit
    if (pkg.scripts?.[arg]) {                   // npm script 
      return async () => await runCommand(`npm run ${arg}`, toWait);
    } else if (arg.match(/^http[s]?:\/\//)) {   // url
      return async () => await waitForURL(arg);
    } else if (arg.match(/^:?[0-9]+/)) {        // port number
      return async () => await waitForURL(`http://localhost:${arg.replace(/^:/,'')}`)
    } else {                                    // other command
      return async () => await runCommand(arg, toWait);
    }
  });

  return new Promise( async function(resolve, reject) {
    const procs = [];
    for (let i=0; i < promises.length; i++) {
      try { 
        console.log('[waitnrun] processing', i+1, 'of', promises.length, commands[i]);
        const proc = await promises[i]();
        procs.push(proc);
      } catch(e) {
        reject(e);
        break;
      }
    }
    resolve(procs);
  });
}

function isNpmCommand(command) {
  const cmdArgs = command.split(' ').map(el => el.trim());
  const cmd = cmdArgs.shift();
  const nodeBinPath = path.join(process.cwd(), 'node_modules', '.bin', cmd);
  try {
    fs.accessSync(nodeBinPath, fs.constants.X_OK);
  } catch (err) {
    return false;
  } 
  return true;
}

function runCommand(command, waitToEnd=false) {
  // console.log('[waitnrun] runCommand ',{command})
  const cmdArgs = command.split(' ').map(el => el.trim());
  const cmd = isNpmCommand(command) ? 'npx' : cmdArgs.shift();
  // console.log('[waitnrun] runCommand ',{command, cmd, cmdArgs})

  const childProc = spawn(cmd, cmdArgs);
  childProc.stdout.on('data', (data) => console.log((''+data).replace(/\n$/, '')));
  childProc.stderr.on('data', (data) => console.error((''+data).replace(/\n$/, '')));

  // console.log({waitToEnd})
  if (waitToEnd) {
    return new Promise(resolve => {
      childProc.on('close', (code) => { 
        console.log(`[waitnrun] ${command} exited with code ${code}`);
        resolve(childProc);
      }); 
    });
  } else {
    return Promise.resolve(childProc);
  }
}

function waitForURL(url, maxTry=10) {

  return new Promise((resolve, reject) => {
    (function loop(i=0) {
      if (i<maxTry) {
        setTimeout(() => {
          const httpOrHttps = new URL(url).protocol.match(/^https/) ? https : http;
          httpOrHttps.get(url, { rejectUnauthorized: false }, res => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
              console.log(`[waitnrun] ${res.statusCode} ${res.statusMessage} ${url}`);
              resolve(res.statusMessage);
            } else {
              console.log(`[waitnrun] ${i+1}/${maxTry} ${url} ${res.statusCode}`);
              loop(i+1)
            }
          }).on('error', err => {
            console.log(`[waitnrun] ${i+1}/${maxTry} ${url} ${err.message}`);
            loop(i+1)
          });
        }, 1000);
      } else {
        console.error(`[waitnrun] ERROR Reached max try ${maxTry} ${url}`);
        reject('Timeout');
      }
    }());
  })
};
