# precision-timeout-interval
![node workflow](https://github.com/ufukbakan/precision-timeout-interval/actions/workflows/node.js.yml/badge.svg)
![node workflow](https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-branches.svg)
![node workflow](https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-functions.svg)
![node workflow](https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-jest%20coverage.svg)
![node workflow](https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-lines.svg)
![node workflow](https://github.com/ufukbakan/precision-timeout-interval/blob/main/badges/coverage-statements.svg)
<br />

High precision timeout and interval methods for javascript
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
