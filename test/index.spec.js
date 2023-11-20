const assert  = require('assert');
const { describe, it } = require('node:test');
const waitnrun = require('../index.js');
const path = require('path');

describe('waitnrun', function () {
  it('should wait and run', async () => {
    const cmd1 = path.join(__dirname, 'http-server.js'); // port 8000 5 seconds to start
    const cmd2 = path.join(__dirname, 'https-server.js'); // port 8001 5 seconds to start
    const cmd3 = path.join(__dirname, 'long-working.js'); // 10 seconds to finish
    const procs = await waitnrun([cmd1, cmd2, ':8000', 'https://localhost:8001/', cmd3]);
    procs.forEach(proc => proc?.kill?.());
    // assert.equal(result.statusCode, 302);
    // assert(result.headers.location.endsWith('&uao=123456&_profile=unknown&aud=https://provider.ehealthontario.ca'));
    // assert(result.multiValueHeaders['Set-Cookie'][0].startsWith('auth='));
    // assert.equal(result.body, '');
  });
});