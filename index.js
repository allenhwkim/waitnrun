#!/usr/bin/env node
const { spawn } = require('node:child_process')
const https = require('https');
const http = require('http');
const path = require('path');
const { clearInterval } = require('node:timers');
const pkg = require(path.join(process.cwd(), './package.json'));

// npx waitnrun http://localhost:3000
const args = process.argv.splice(2);
const promises = args.map( arg => {
  if (pkg.scripts[arg]) {                  // npm script 
    return () => runCommand(`npm run ${arg}`);
  } else if (arg.match(/^http[s]?:\/\//)) { // url
    return () => checkURL(arg);
  } else if (arg.match(/^:?[0-9]+/)) {      // port number
    return () => checkURL(`http://localhost:${arg.replace(/^:/,'')}`)
  } else {                                  // other command
    return () => runCommand(arg);
  }
});

main();

async function main(){
  for (let i=0; i < promises.length; i++) {
    try { 
      console.log('[waitnrun] processing', i+1, 'of', promises.length);
      await promises[i]();
    } catch(e) {
      break;
    }
  }
}

function runCommand(command) {
  console.log('[waitnrun] runCommand ',{command})
  const cmdArgs = command.split(' ').map(el => el.trim());
  const cmd = cmdArgs.shift();
  const childProc = spawn(cmd, cmdArgs);
  childProc.stdout.on('data', (data) => console.log(''+data));
  childProc.stderr.on('data', (data) => console.error(''+data));
  // Assuming the last command exits, others keep running
  childProc.on('close', (code) => { 
    console.log(`[waitnrun] ${command} exited with code ${code}`);
    process.exit(code);
  }); 
}

function checkURL(url, timeout=10000) {
  const httpOrHttps = new URL(url).protocol === 'https' ? https : http;

  return new Promise((resolve, reject) => {
    (function loop(i) {
      if (i>0) {
        setTimeout(() => {
          httpOrHttps.get(url, res => {
            if (res.statusCode === 200) {
              console.log('[waitnrun]', res.statusCode, res.statusMessage, url);
              i = 0;
              resolve(res.statusMessage);
            }
          }).on('error', err => {
            console.log('[waitnrun]', 10 - i+1, url, err.message);
          });
          (i > 0) && loop(i-1);
        }, 1000);
      } else {
        console.error('[waitnrun] ERROR Timeout');
        reject('Timeout');
      }
    }(timeout/1000));
  })
};
