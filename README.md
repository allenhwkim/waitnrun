# waitnrun
> wait-and-run

Starts server, waits for URL, then run your tests.

This package is developed because I could not resolve `npm audit` issues of "start-and-server" package, especially `wait-on` and `axios` package.

It's a simplified version of [start-server-and-test](https://www.npmjs.com/package/start-server-and-test).
It has zero dependency. Therefore, you will see 0(zero) security vulnerability.

The package size is 2.3KB(0 npm module dependency), compared to start-server-and-test's 11KB(plus 107 npm module dependencies).

## Install

Requires [Node](https://nodejs.org/en/) version 16 or above.

```sh
npm install waitnrun -D
```

## Usage

```shell
# run http-server, then when port 8000 responds run Cypress tests
waitnrun 'npx http-server' 8080 'cypress run'
waitnrun 'npx http-server' :8080/index.html 'cypress run'
waitnrun 'npx http-server' http://localhost:8080/index.html 'cypress run'
waitnrun start-server :4300/api/health 'ng serve' 'cypress run'
```
