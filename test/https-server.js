#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

// generate from command, `openssl req -nodes -new -x509 -keyout server.key -out server.cert`
const options = { 
  key: fs.readFileSync(path.join(__dirname, 'server.key')), 
  cert: fs.readFileSync(path.join(__dirname, 'server.cert')), 
}; 

function getBody(req) {
  return new Promise(resolve => {
    let chunks = [];
    req.on('readable', () => {
      while (null !== (chunk = req.read())) 
        chunks.push(chunk)
    });
    req.on('end', () => resolve(chunks.join('')))
  })
}

const server = https.createServer(options, async function (req, res) {
  console.log('[webserver]', req.method, req.url);
  const method = req.method;
  const url = new URL(`https://${req.headers.host}${req.url}`);

  if (method === 'GET' && url.pathname === '/') {
    const query = url.searchParams;
    res.end(`Hello ${query.get('name')||''}`);
  } else if (method === 'GET' && url.pathname === '/json') {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(`{"message": "This is a JSON response"}`);
  } else if (method === 'POST' && url.pathname === '/json') {
    console.log('[webserver]', await getBody(req));
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200); 
    res.end(`{"message": "This is a JSON response"}`);
  }
});

server.listen(8001, () => {
  console.log(`[webserver] Server is running on https://localhost:8001`);
});

// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
// https://nodejs.org/api/http.html#class-httpincomingmessage
// https://nodejs.org/api/stream.html#readablereadsize
// https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener