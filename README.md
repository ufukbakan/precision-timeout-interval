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
function prcInterval(milliseconds:number, callback:Function) : IntervalController;
type IntervalController = {
    end: boolean
}
```
<br/>

## ES6 Usage

### Timeout usage

```ts
import { prcTimeout } from 'precision-timeout-interval';
prcTimeout(delayTime, ()=> console.log("hello world") )
```

### Interval usage
```ts
import { prcInterval } from 'precision-timeout-interval';
let intervalController = prcInterval(delayTime, ()=> console.log("hello world") )
console.log(intervalController) // { end: false }
intervalController.end = true // stops the interval permanently
```
<br/>

## CommonJS Usage

### Timeout usage
```js
const { prcTimeout } = require("precision-timeout-interval");
prcTimeout(delayTime, ()=> console.log("hello world") )
```

### Interval usage
```js
const { prcInterval } = require("precision-timeout-interval");
let intervalController = prcInterval(delayTime, ()=> console.log("hello world") )
console.log(intervalController) // { end: false }
intervalController.end = true // stops the interval permanently
```
