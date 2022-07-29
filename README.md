<h1 align="center">precision-timeout-interval</h1>
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
High precision timeout and interval methods for javascript
<br/>

[Click here for live demo](https://ufukbakan.github.io/precision-timeout-interval/demo/)
<br />

## Installation
```bash
npm i precision-timeout-interval
```
<br />

## Interface

```ts
// milliseconds = delay time in milliseconds
function prcTimeout(milliseconds:number, callback:Function) : void;

function prcTimeoutWithDelta(milliseconds:number, callback:Function) : void;

function prcInterval(milliseconds:number, callback:Function) : IntervalController;

function prcIntervalWithDelta(milliseconds:number, callback:Function) : IntervalController;

type IntervalController = {
    end: boolean,
    interval: number, // Getter only
    callback: Function // Getter only
}
```
<br/>

## ES6 Usage Examples

### Timeout usage

```ts
import { prcTimeout } from 'precision-timeout-interval';

prcTimeout(50, ()=> console.log("hello world") );
// logs hello world after 50 milliseconds
```

```ts
import { prcTimeoutWithDelta } from 'precision-timeout-interval';

prcTimeoutWithDelta(50, (deltaT) =>{
  console.log("Hello, after "+ deltaT +" msecs");
});
```

### Interval usage
```ts
import { prcInterval } from 'precision-timeout-interval';

let intervalController = prcInterval(50, ()=> console.log("hello world") );

intervalController.end = true // stops the interval permanently

// Shorthand to restart an interval:
intervalController = prcInterval(intervalController.interval,intervalController.callback);
```
```ts
import { prcIntervalWithDelta } from 'precision-timeout-interval';

const FPS = 60;
let intervalController = prcIntervalWithDelta(1000/FPS, (deltaT)=>{
  fallMeters(2 * deltaT/100); // FPS independent physics
});
```
<br/>

## CommonJS Usage

### Timeout usage
```js
const { prcTimeout } = require("precision-timeout-interval");

prcTimeout(50, ()=> console.log("hello world") );
// logs hello world after 50 milliseconds
```

```js
const { prcTimeoutWithDelta } = require("precision-timeout-interval");

prcTimeoutWithDelta(50, (deltaT) =>{
  console.log("Hello, after "+ deltaT +" msecs");
});
```

### Interval usage
```js
const { prcInterval } = require("precision-timeout-interval");

let intervalController = prcInterval(50, ()=> console.log("hello world") );

intervalController.end = true // stops the interval permanently

// Shorthand to restart an interval:
intervalController = prcInterval(intervalController.interval,intervalController.callback);
```

```js
const { prcIntervalWithDelta } = require("precision-timeout-interval");

const FPS = 60;
let intervalController = prcIntervalWithDelta(1000/FPS, (deltaT)=>{
  fallMeters(2 * deltaT/100); // FPS independent physics
});
```