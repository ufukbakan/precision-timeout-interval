<h1 align="center">precision-timeout-interval</h1>
  <p float="left" align="center">
  <img alt="node workflow badge" style="display: inline" src="https://github.com/ufukbakan/precision-timeout-interval/actions/workflows/node.js.yml/badge.svg">
  <img alt="node workflow badge" style="display: inline" src="https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-branches.svg">
  <img alt="node workflow badge" style="display: inline" src="https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-functions.svg">
  <img alt="node workflow badge" style="display: inline" src="https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-jest%20coverage.svg">
  <img alt="node workflow badge" style="display: inline" src="https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-lines.svg">
  <img alt="node workflow badge" style="display: inline" src="https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-statements.svg">
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
npm i precision-timeout-interval
<br />
<br />

## Timeout usage
prcTimeout( delayTimeInMilliseconds , callbackFunction )
```js
const { prcTimeout } = require("precision-timeout-interval");
prcTimeout(delayTime, ()=>console.log("hello world") ) // callback function will be executed only once
```
<br />

## Interval usage
prcInterval( delayTimeInMilliseconds , callbackFunction )
```js
const { prcInterval } = require("precision-timeout-interval");
let intervalController = prcInterval(delayTime, ()=>console.log("hello world") ) // callback function will be executed every delayTime milliseconds
console.log(intervalController) // { end: false }
intervalController.end = true // stops the interval permanently
```
