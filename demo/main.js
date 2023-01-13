(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { prcInterval, prcIntervalWithDelta } = require("./index");
let canvasWidth, canvasHeight;
const hexadecimalChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
let running = true;
const FPS = 144;
let legacyContext, precisionContext, prcDeltaContext, colors;
let legacyPoints, precisionPoints, prcDeltaPoints;
let dummyPingCounter = 0, dummyPingCounter2 = 2, dummyPingCounter3 = 7;
let dummyPingCounter4 = 1000, dummyPingCounter5 = 10002, dummyPingCounter6 = 99;

window.addEventListener("load", ()=>{
    canvasWidth = +document.querySelector("canvas").width;
    canvasHeight = +document.querySelector("canvas").height;
    const canvasL = document.getElementById("legacy-canvas");
    const canvasPrc = document.getElementById("precision-canvas");
    const canvasPrcDelta = document.getElementById("prc-delta-canvas");
    const button = document.getElementById("dummy-button");
    legacyContext = canvasL.getContext("2d");
    precisionContext = canvasPrc.getContext("2d");
    prcDeltaContext = canvasPrcDelta.getContext("2d");
    legacyPoints = [], precisionPoints = [], prcDeltaPoints = [];
    colors = [];
    for(let i = 0; i < canvasHeight; i+=10){
        legacyPoints.push( {x: 0, y: i} );
        precisionPoints.push( {x: 0, y: i} );
        prcDeltaPoints.push( {x: 0, y: i} );
        colors.push(randomColor());
    }
    
    legacyPoints.forEach(point => {
        point.update = window.setInterval( ()=> movePoint(point), 1000 / FPS);
    });

    precisionPoints.forEach(point => {
        point.update = prcInterval( 1000/FPS, (deltaT)=> { movePoint(point, deltaT); } );
    });

    prcDeltaPoints.forEach(point => {
        point.update = prcIntervalWithDelta( 1000/FPS, (deltaT)=> { movePoint(point, deltaT); } );
    });
    
    window.setInterval( ()=> render(legacyContext, legacyPoints, colors), 1000/FPS );
    prcInterval(1000/FPS, ()=>render(precisionContext, precisionPoints, colors) );
    prcInterval(1000/FPS, ()=>render(prcDeltaContext, prcDeltaPoints, colors) );

    initDummyCounters();
    button.addEventListener("click", toggleInterval);
});

function initDummyCounters(){
    window.setInterval( ()=> { dummyPingCounter = (dummyPingCounter+1) % 9999 }, 250 );
    window.setInterval( ()=> { dummyPingCounter2 = (dummyPingCounter2+1) % 9999 }, 250 );
    window.setInterval( ()=> { dummyPingCounter3 = (dummyPingCounter3+1) % 9999 }, 250 );
    prcInterval( 250, ()=> { dummyPingCounter4 = (dummyPingCounter4+1) % 9999 } );
    prcInterval( 250, ()=> { dummyPingCounter5 = (dummyPingCounter5+1) % 9999 } );
    prcInterval( 250, ()=> { dummyPingCounter6 = (dummyPingCounter6+1) % 9999 } );
}

/**
 * @param {CanvasRenderingContext2D} context
 * @param {Array} points
 * @param {Array} colors
 */
function render(context, points, colors=undefined, clear=true){
    if(clear){
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    for(let i = 0; i < points.length; i++){
        if(colors && colors[i]){
            context.fillStyle = colors[i];
        }
        context.fillRect(points[i].x, points[i].y, 10, 10);
    }
}

function movePoint(point, deltaT=10){
    point.x = (point.x + 1*deltaT) % canvasWidth;
    if(point.x == 0){
        point.y = (point.y + 1*deltaT) % canvasHeight;
    }
}

function toggleInterval(){
    if(running){
        legacyPoints.forEach(
            point=>
            window.clearInterval(point.update)
        );
        precisionPoints.forEach(
            point=>
            {point.update.cancel()}
        );
        prcDeltaPoints.forEach(
            point =>
            {point.update.cancel()}
        );
        running = false;
    }else{
        legacyPoints.forEach(point => {
            point.update = window.setInterval( ()=> movePoint(point), 1000 / FPS);
        });

        precisionPoints.forEach(point => {
            point.update = prcInterval( 1000/FPS, ()=> { movePoint(point); } );
        });
    
        prcDeltaPoints.forEach(point => {
            point.update = prcIntervalWithDelta( 1000/FPS, (deltaT)=> { movePoint(point, deltaT); } );
        });
        running = true;
    }
}

function randomColor(){
    let result = "#";
    for(let i = 0; i < 6; i++){
        result += hexadecimalChars[ Math.round( Math.random()*hexadecimalChars.length ) ];
    }
    return result;
}
},{"./index":2}],2:[function(require,module,exports){
(function (global){(function (){
const requestAnimationFrame = require("raf");
const perfhooks = require("perf_hooks");
if (perfhooks && perfhooks.performance) {
    global.performance = perfhooks.performance;
}
if (!global.performance.now) {
    global.performance.now = Date.now || function () { return new Date().getTime() };
}

/**
 * @typedef {Object} TimeoutConfiguration
 * @property {boolean} cancelled
 * @property 
 */

class TimeoutController {
    /**
     * @param {TimeoutConfiguration} config 
     */
    constructor(config) {
        this.config = config;
    }
    cancel() {
        this.config.cancelled = true;
    }
}

/**
 * Executes callback for only once after specified delay in milliseconds
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @param {IntervalConfiguration | TimeoutConfiguration} config Don't set this parameter manually
 * @return {TimeoutController}
 */
function prcTimeout(milliseconds, callback, config = { cancelled: false }) {
    const startTime = performance.now();
    const executeAfter = startTime + milliseconds;
    requestAnimationFrame((ts) => tick(ts, executeAfter, callback, false, config));
    return new TimeoutController(config);
}

/**
 * Executes callback for only once after specified delay in milliseconds
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @param {IntervalConfiguration} config Don't set this parameter manually
 * @return {TimeoutController}
 */
function prcTimeoutWithDelta(milliseconds, callback, config = { cancelled: false, lastCallTimestamp: 0 }) {
    const startTime = performance.now();
    const executeAfter = startTime + milliseconds;
    requestAnimationFrame(ts => tick(ts, executeAfter, callback, true, config));
    return new TimeoutController(config);
}

/**
 * @typedef {Object} IntervalConfiguration
 * @property {boolean} cancelled Tells interval to execute callback at next tick. If once set to false, interval will be permanently deleted.
 * @property {boolean} interval Defines period in milliseconds.
 * @property {number} lastCallTimestamp Timestamp of last tick
 * @property {Function} callback Only getter for callback function of interval.
 */

class IntervalController {
    /**
     * @param {IntervalConfiguration} config 
     * @param {boolean} hasDelta
     */
    constructor(config, hasDelta) {
        this.config = config;
        this.callback = config.callback;
        this.hasDelta = hasDelta;
    }

    restart() {
        this.config.cancelled = true;
        if (this.hasDelta) {
            const newInterval = prcIntervalWithDelta(this.config.interval, this.config.callback);
            this.config = newInterval.config;
        } else {
            const newInterval = prcInterval(this.config.interval, this.config.callback);
            this.config = newInterval.config;
        }
    }

    cancel() {
        this.config.cancelled = true;
    }

    pauseResume() {
        if (this.config.cancelled) {
            this.restart();
        } else {
            this.config.cancelled = true;
        }
    }

    setPeriod(milliseconds) {
        this.config.interval = milliseconds;
        this.restart();
    }

    getPeriod() {
        return this.config.interval;
    }

}

/**
 * 
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @returns {IntervalController}
 */
function prcInterval(milliseconds, callback) {
    /** @type {IntervalConfiguration} */ let config = {
        cancelled: false,
        interval: milliseconds,
        callback: callback,
    };
    const configuredCallback = () => {
        callback();
        if (!config.cancelled) {
            prcTimeout(milliseconds, configuredCallback, config);
        }
    }
    prcTimeout(milliseconds, configuredCallback, config);
    return new IntervalController(config, false);
}

/**
 * 
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @returns {IntervalConfiguration}
 */
function prcIntervalWithDelta(milliseconds, callback) {
    /** @type {IntervalConfiguration} */ let config = {
        cancelled: false,
        interval: milliseconds,
        callback: callback,
        lastCallTimestamp: 0
    };

    const configuredCallback = (deltaT) => {
        callback(deltaT);
        if (!config.cancelled) {
            prcTimeoutWithDelta(milliseconds, configuredCallback, config);
        }
    }
    prcTimeoutWithDelta(milliseconds, configuredCallback, config);
    return new IntervalController(config, true);
}

/**
 * @param {Number} timestamp Now
 * @param {Number} executeAfter Delay Time
 * @param {Function} callback Callback Function
 * @param {Boolean} bindDeltaT Bind delta time to callback function
 * @param {TimeoutConfiguration | IntervalConfiguration | undefined} config Interval or Timeout config
 */
function tick(timestamp, executeAfter, callback, bindDeltaT, config = undefined) {
    if (timestamp < executeAfter && (!config || !config.cancelled)) {
        requestAnimationFrame((ts) => tick(ts, executeAfter, callback, bindDeltaT, config));
    } else if ((!config || !config.cancelled) && bindDeltaT) {
        callback(timestamp - config.lastCallTimestamp);
        config.lastCallTimestamp = timestamp;
    } else if (!config || !config.cancelled) {
        callback();
    }
}

module.exports = { prcTimeout, prcTimeoutWithDelta, prcInterval, prcIntervalWithDelta, IntervalController, TimeoutController };
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"perf_hooks":3,"raf":6}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (process){(function (){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this)}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
(function (global){(function (){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":4}]},{},[1]);
