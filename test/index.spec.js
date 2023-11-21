const assert  = require('assert');
const util = require('util');
const { describe, it } = require('node:test');
const path = require('path');

const exec = util.promisify(require('node:child_process').exec);

describe('waitnrun', function () {
  it('should wait and run', async () => {
    const cmd1 = path.join(__dirname, 'http-server.js'); // port 8000 5 seconds to start
    const cmd2 = path.join(__dirname, 'https-server.js'); // port 8001 5 seconds to start
    const cmd3 = path.join(__dirname, 'long-working.js'); // 10 seconds to finish
    const cli = path.join(__dirname, '..', 'cli.js');
    // const procs = await waitnrun([cmd1, cmd2, ':8000', 'https://localhost:8001/', cmd3]);

    const cmd = `${cli} ${cmd1} ${cmd2} :8000 https://localhost:8001/ ${cmd3}`;
    const { stdout } = await exec(cmd);

    const expected = `[waitnrun] processing 1 of 5 /Users/allenkim/projects/waitnrun/test/http-server.js
[waitnrun] processing 2 of 5 /Users/allenkim/projects/waitnrun/test/https-server.js
[waitnrun] processing 3 of 5 :8000
[webserver] Server is running on https://localhost:8001
[waitnrun] 1/10 http://localhost:8000 
[waitnrun] 2/10 http://localhost:8000 
[waitnrun] 3/10 http://localhost:8000 
[waitnrun] 4/10 http://localhost:8000 
[waitnrun] 5/10 http://localhost:8000 
Server is running on http://localhost:8000
[webserver] GET /
[waitnrun] 200 OK http://localhost:8000
[waitnrun] processing 4 of 5 https://localhost:8001/
[webserver] GET /
[waitnrun] 200 OK https://localhost:8001/
[waitnrun] processing 5 of 5 /Users/allenkim/projects/waitnrun/test/long-working.js
DONE
[waitnrun] /Users/allenkim/projects/waitnrun/test/long-working.js exited with code 0
`;
    assert.equal(stdout, expected);
  });
});