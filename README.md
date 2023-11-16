# waitnrun

Starts server, waits for ports, then run your tests

## Install

Requires [Node](https://nodejs.org/en/) version 16 or above.

```sh
npm install waitnrun -D
```

## Usage

```shell
# run http-server, then when port 8000 responds run Cypress tests
waitnrun 'npx http-server' 8080 'npx cypress run'
waitnrun 'npx http-server' :8080/index.html 'npx cypress run'
waitnrun 'npx http-server' http://localhost:8080/index.html 'npx cypress run'
```
