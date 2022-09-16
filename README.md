<h1 align="center">precision-timeout-interval</h1>
  <p align="center">Hardware accelerated javascript timing interface.</p>
  <p float="left" align="center">
  <img alt="node workflow badge" style="display: inline" src="https://github.com/ufukbakan/precision-timeout-interval/actions/workflows/node.js.yml/badge.svg">
  <img alt="node workflow badge" style="display: inline" src="https://raw.githubusercontent.com/ufukbakan/precision-timeout-interval/main/badges/coverage-branches.svg">
  <img alt="node workflow badge" style="display: inline" src="https://raw.githubusercontent.com/ufukbakan/precision-timeout-interval/main/badges/coverage-functions.svg">
  <img alt="node workflow badge" style="display: inline" src="https://raw.githubusercontent.com/ufukbakan/precision-timeout-interval/main/badges/coverage-jest%20coverage.svg">
  <img alt="node workflow badge" style="display: inline" src="https://raw.githubusercontent.com/ufukbakan/precision-timeout-interval/main/badges/coverage-lines.svg">
  <img alt="node workflow badge" style="display: inline" src="https://raw.githubusercontent.com/ufukbakan/precision-timeout-interval/main/badges/coverage-statements.svg">
  <br />
  </p>

  <p float="left" align="center">
    <img alt="demo preview" src="https://raw.githubusercontent.com/ufukbakan/precision-timeout-interval/main/demo/demo_preview.gif">
  </p>
  <h2 align="center"><a href="https://ufukbakan.github.io/precision-timeout-interval/demo/">Click here for live demo</a></h2>
  <h2 align="center">V4 Brings the most developer friendly timing methods </h2>
<br />

## Installation
```bash
npm i precision-timeout-interval@latest
```

## Importing
```js
  // ES6:
  import { prcTimeout, prcInterval } from 'precision-timeout-interval';
  // CommonJS: 
  const { prcTimeout, prcInterval } = require('precision-timeout-interval');
```

## Easy Interface
```js
  let timeoutController = prcTimeout(delayInMilliseconds, callbackFunction);
  let interval = prcInterval(delayInMilliseconds, callbackFunction);
```
<br>
<h1 align="center">Introducing Awesome V4 Features</h1>

- ## Timeouts are now cancellable:
```ts
let myTimeout = prcTimeout(500, () => console.log("I'm gona be cancelled") );
myTimeout.cancel()
```
- ### And of course intervals are too
- # Interval controller is completely changed
  ## Meet with new interval controller methods: cancel, restart, pauseResume and setPeriod
```ts
let myInterval = prcInterval(100, () => console.log("Hello V4") ); // start
myInterval.pauseResume(); // pause
myInterval.pauseResume(); // resume
myInterval.restart(); // restart counter
myInterval.setPeriod(1000); // set a new period and restart
myInterval.cancel() // stop
```

  ## WithDelta Support Since V3.0.0
  Timers and Intervals can autobind delta time if you wish as callback parameter.
  Usefull especially for game developers.
  ```ts
  prcTimeoutWithDelta(50, (deltaT) =>{
    console.log("Hello, after "+ deltaT +" msecs");
  });
  ```