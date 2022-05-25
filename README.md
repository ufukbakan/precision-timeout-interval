# precision-timeout-interval
High precision timeout and interval methods for javascript
<br />

## Installation
npm i precision-timeout-interval
<br />
<br />

## Timeout usage
prcTimeout( delayTimeInMilliseconds , callbackFunction )
```
const { prcTimeout } = require("precision-timeout-interval");
prcTimeout(delayTime, ()=>console.log("hello world") ) // callback function will be executed only once
```
<br />

## Interval usage
prcInterval( delayTimeInMilliseconds , callbackFunction )
```
const { prcInterval } = require("precision-timeout-interval");
let intervalController = prcInterval(delayTime, ()=>console.log("hello world") ) // callback function will be executed every delayTime milliseconds
console.log(intervalController) // { end: false }
intervalController.end = true // stops the interval permanently
```
