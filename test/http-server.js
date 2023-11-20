#!/usr/bin/env node
const http = require('http');
const waitFor = require('./wait-for');

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

const server = http.createServer(async function (req, res) {
  console.log('[webserver]', req.method, req.url);
  const method = req.method;
  const url = new URL(`http://${req.headers.host}${req.url}`);

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

(async function() {
  await waitFor(5);
  server.listen(8000, () => {
    console.log(`Server is running on http://localhost:8000`);
  });
})();

// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
// https://nodejs.org/api/http.html#class-httpincomingmessage
// https://nodejs.org/api/stream.html#readablereadsize
// https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener