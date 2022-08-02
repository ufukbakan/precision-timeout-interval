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
            {point.update.end = true;}
        );
        prcDeltaPoints.forEach(
            point =>
            {point.update.end = true;}
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
const ProcessTimer = require('process-timer');
const requestAnimationFrame = require("raf");

/**
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @param {IntervalConfiguration} config Don't set this parameter manually
 */
function prcTimeout(milliseconds, callback, config=undefined){
    const timer = new ProcessTimer();
    const executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback, false, config));
}

/**
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @param {IntervalConfiguration} config Don't set this parameter manually
 */
 function prcTimeoutWithDelta(milliseconds, callback, config=undefined){
    const timer = new ProcessTimer();
    const executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback, true, config));
}

/**
 * @typedef {Object} IntervalConfiguration
 * @property {boolean} end Tells interval to execute callback at next tick. If once set to false, interval will be permanently deleted.
 * @property {Function} callback Only getter for callback function of interval.
 */

/**
 * 
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @returns {IntervalConfiguration}
 */
function prcInterval(milliseconds, callback){
    let config = {
        end: false,
        interval: milliseconds,
        callback: callback
    };
    const configuredCallback = () => {
        callback();
        if(!config.end){
            prcTimeout(milliseconds, configuredCallback);
        }
    }
    prcTimeout(milliseconds, configuredCallback, config);
    return config;
}

/**
 * 
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @returns {IntervalConfiguration}
 */
 function prcIntervalWithDelta(milliseconds, callback){
    let config = {
        end: false,
        interval: milliseconds,
        callback: callback
    };
    
    const configuredCallback = (deltaT) => {
        callback(deltaT);
        if(!config.end){
            prcTimeoutWithDelta(milliseconds, configuredCallback);
        }
    }
    prcTimeoutWithDelta(milliseconds, configuredCallback, config);
    return config;
}

/**
 * @param {Number} executeAfter Delay Time
 * @param {Function} callback Callback Function
 * @param {Boolean} bindDeltaT Bind delta time to callback function
 */
function tick(executeAfter, callback, bindDeltaT, config=undefined){
    if(this.msec < executeAfter && (!config || !config.end)){
        requestAnimationFrame(tick.bind(this, executeAfter, callback, bindDeltaT, config));
    }else if((!config || !config.end) && bindDeltaT){
        callback(this.msec);
    }else if(!config || !config.end){
        callback();
    }
}

module.exports = { prcTimeout, prcTimeoutWithDelta, prcInterval, prcIntervalWithDelta };
},{"process-timer":4,"raf":6}],3:[function(require,module,exports){
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
},{"_process":5}],4:[function(require,module,exports){
(function (process){(function (){
/**
 * @class ProcessTimer
 * @provides High-resolution timer class for NodeJs & browsers
 *           Implements timestamps processing in a handy simple way
 *
 * @author https://juliyvchirkov.github.io
 * @version 1.0.2 17/08/2018
 * @release https://github.com/juliyvchirkov/process-timer/releases/tag/v1.0.2
 * @bugs https://github.com/juliyvchirkov/process-timer/issues
 * @license MIT
 *
 * @see README.md
 *
 * ProcessTimer {
 *     VERSION : '1.0.2',
 *     nsec : [Getter],
 *     usec : [Getter],
 *     msec : [Getter],
 *     sec : [Getter]
 *     ns : [Getter],
 *     us : [Getter],
 *     ms : [Getter],
 *     s : [Getter]
 * }
 */

'use strict'

/**
 * Universal module definition, turned into one-liner for simplicity & conciseness
 *
 * @see https://github.com/umdjs/umd
 */
;(function (global, factory) {
    typeof define === 'function' && define.amd
        ? define(factory)
        : typeof module === 'object' && module.exports
            ? (module.exports = factory)
            : (global.ProcessTimer = factory)
})(this, function ProcessTimer (suffix) {
    'use strict'

    var CLASSID = 'ProcessTimer'
    var VERSION = '1.0.2'

    /**
     * Defines or modifies a property of an object
     *
     * A TypeError is thrown on failure
     *
     * @param {object} object     The object on which to define the property
     * @param {string} property   The name of the property to be defined or modified
     * @param {object} descriptor The descriptor for the property being defined or
     *                            modified
     *
     * @returns {object} The object that was passed to the function
     */
    function defineProperty (object, property, descriptor) {
        var data = 'value'
        var accessorGet = 'get'
        var accessorSet = 'set'
        var errorPrefix = 'Cannot define or modify property “' + property + '” '
        var errorMessage = null

        /**
         * Defines or modifies an accessor property of an object
         *
         * @param {string} id The name of the accessor property to be defined
         *                    or modified (either “get” or “set”)
         *
         * @returns {void}
         */
        function defineAccessor (id) {
            var __define__ = '__define' + id[0].toUpperCase() + id.slice(1) + 'ter__'
            var __lookup__ = '__lookup' + __define__.slice(8)

            errorMessage = errorPrefix + id + 'ter'

            try {
                object[__define__](property, descriptor[id])

                if (object[__lookup__](property) === descriptor[id]) {
                    errorMessage = null
                }
            } catch (error) {}
        }

        try {
            Object.defineProperty(object, property, descriptor)
        } catch (error) {
            if (data in descriptor) {
                try {
                    object[property] = descriptor[data]
                } catch (error) {
                } finally {
                    if (object[property] !== descriptor[data]) {
                        errorMessage = errorPrefix + data
                    }
                }
            } else {
                accessorGet in descriptor && defineAccessor(accessorGet)
                accessorSet in descriptor && defineAccessor(accessorSet)
            }
        } finally {
            if (errorMessage) {
                throw new TypeError(errorMessage)
            } else {
                return object
            }
        }
    }

    /**
     * Defines or modifies properties of an object
     *
     * A TypeError is thrown on failure
     *
     * @param {object} object     The object on which to define properties
     * @param {object} properties An object whose own enumerable properties
     *                            constitute descriptors for the properties
     *                            to be defined or modified
     *
     * @returns {object} The object that was passed to the function
     */
    function defineProperties (object, properties) {
        var errorMessage = null

        try {
            Object.defineProperties(object, properties)
        } catch (error) {
            try {
                for (var property in properties) {
                    defineProperty(object, property, properties[property])
                }
            } catch (error) {
                errorMessage = error.message
            }
        } finally {
            if (errorMessage) {
                throw new TypeError(errorMessage)
            } else {
                return object
            }
        }
    }

    /**
     * Makes an object immutable if Object.freeze method is available
     *
     * @param {object} object The object to freeze
     *
     * @returns {object} The object that was passed to the function
     */
    function freeze (object) {
        try {
            Object.freeze(object)
        } catch (error) {
        } finally {
            return object
        }
    }

    /**
     * Returns a string indicating the type of an object or a primitive
     *
     * A TypeError is thrown if invoked w/o arguments
     *
     * @param { … } item The object or primitive whose type is to be determined
     *
     * @returns {string} The type of the item that was passed to the function
     */
    function typeOf (item) {
        if (arguments.length === 0) {
            throw new TypeError('Object or primitive has been expected, got nothing')
        }

        var itemTypeof = null

        try {
            itemTypeof = item.constructor.name
        } catch (error) {
        } finally {
            return (
                itemTypeof ||
                Object.prototype.toString.call(item).slice(8, -1) ||
                typeof item
            ).toLowerCase()
        }
    }

    /**
     * Returns a timer startpoint (a [seconds, nanoseconds] array tuple w/
     * unique timestamp) if invoked w/o arguments. Further this array being
     * passed back produces a diff (a [seconds, nanoseconds] array tuple w/
     * time elapsed since a timer has been instantiated) on return
     *
     * A TypeError is thrown on anything but an array tuple
     *
     * @param {array} time The return of this function called w/o arguments
     *
     * @returns {array} A high-resolution timestamp in a [seconds,
     *                  nanoseconds] array tuple, where nanoseconds
     *                  is the remaining part of the timestamp that
     *                  can't be represented in second precision
     */
    function hrtime (time) {
        try {
            return process.hrtime(time)
        } catch (error) {
            time = time || [0, 0]

            var timeTypeof = typeOf(time)
            var timeTypeofArray = timeTypeof === 'array'

            if (timeTypeofArray && time.length === 2) {
                var now =
                    (typeof performance === 'object' &&
                    typeOf(performance) === 'performance' &&
                    typeOf(performance.now) === 'function'
                        ? performance
                        : Date
                    ).now() * 1e-3
                var sec = Math.floor(now) - time[0]
                var nsec = Math.floor((now % 1) * 1e9) - time[1]
                var shift = (nsec < 0) * 1

                return [sec - shift, nsec + shift * 1e9]
            } else {
                throw new TypeError(
                    'Array tuple has been expected, got ' +
                        (timeTypeofArray ? 'incompatible one' : timeTypeof)
                )
            }
        }
    }

    /**
     * The above shims have been designed to sand off some rough edges between
     * NodeJs & various browser engines thru a number of modern & legacy methods
     * sequenced within single functions in order to keep the main routine utterly
     * simple & concise
     */

    var classConstructor = 'Class constructor ' + CLASSID + ' '

    if (!(this instanceof ProcessTimer)) {
        throw new TypeError(classConstructor + 'cannot be invoked w/o “new”')
    }

    if (arguments.length !== 0 && typeof suffix !== 'string') {
        throw new TypeError('String has been expected, got ' + typeOf(suffix))
    }

    /**
     * Converts an integer of a high-resolution timestamp into a double
     * according to the given precision
     *
     * Utilized to process ns, us & ms getters
     *
     * @param {number} stamp An integer of a high-resolution timestamp
     * @param {number} depth The precision (either 9 or 6 or 3)
     *
     * @returns {number} A double of a high-resolution timestamp that
     *                   was passed to the function
     */
    function getHRSec (stamp, depth) {
        var precision = Math.pow(10, -depth)
        var sec = (stamp * precision).toFixed(depth)

        return (sec * 1 - (sec.slice(-1) === '0' ? precision : 0)).toFixed(depth) * 1
    }

    /**
     * The main routine
     */
    try {
        return freeze(
            defineProperties(this, {
                VERSION : {
                    enumerable : true,
                    value : VERSION
                },
                /**
                 * A suffix to append the return of ns, us, ms & s getters
                 * (a string that was passed to the constructor if any, null
                 * otherwise)
                 */
                suffix : {
                    value : typeOf(suffix) === 'string' ? suffix : null
                },
                /**
                 * A timer startpoint (a [seconds, nanoseconds] array tuple
                 * w/ unique timestamp)
                 */
                time : {
                    value : freeze(hrtime())
                },
                /**
                 * @getter nsec
                 *
                 * @returns {number} A number of nanoseconds elapsed since
                 *                   a timer has been instantiated
                 */
                nsec : {
                    enumerable : true,
                    get : function get () {
                        var time = hrtime(this.time)

                        return time[0] * 1e9 + time[1]
                    }
                },
                /**
                 * @getter usec
                 *
                 * @returns {number} A number of microseconds elapsed since
                 *                   a timer has been instantiated
                 */
                usec : {
                    enumerable : true,
                    get : function get () {
                        return Math.round(this.nsec * 1e-3)
                    }
                },
                /**
                 * @getter msec
                 *
                 * @returns {number} A number of milliseconds elapsed since
                 *                   a timer has been instantiated
                 */
                msec : {
                    enumerable : true,
                    get : function get () {
                        return Math.round(this.nsec * 1e-6)
                    }
                },
                /**
                 * @getter sec
                 *
                 * @returns {number} A number of seconds elapsed since a timer
                 *                   has been instantiated
                 */
                sec : {
                    enumerable : true,
                    get : function get () {
                        return Math.round(this.nsec * 1e-9)
                    }
                },
                /**
                 * @getter ns
                 *
                 * @returns {number|string} A number of seconds (accurate to
                 *                          nanoseconds) elapsed since a timer
                 *                          has been instantiated
                 */
                ns : {
                    enumerable : true,
                    get : function get () {
                        return getHRSec(this.nsec, 9) + this.suffix
                    }
                },
                /**
                 * @getter us
                 *
                 * @returns {number|string} A number of seconds (accurate to
                 *                          microseconds) elapsed since a timer
                 *                          has been instantiated
                 */
                us : {
                    enumerable : true,
                    get : function get () {
                        return getHRSec(this.usec, 6) + this.suffix
                    }
                },
                /**
                 * @getter ms
                 *
                 * @returns {number|string} A number of seconds (accurate to
                 *                          milliseconds) elapsed since a timer
                 *                          has been instantiated
                 */
                ms : {
                    enumerable : true,
                    get : function get () {
                        return getHRSec(this.msec, 3) + this.suffix
                    }
                },
                /**
                 * @getter s
                 *
                 * @returns {number|string} A number of seconds elapsed since
                 *                          a timer has been instantiated
                 */
                s : {
                    enumerable : true,
                    get : function get () {
                        return this.sec + this.suffix
                    }
                }
            })
        )
    } catch (error) {
        throw new TypeError(
            classConstructor +
                'is unable to provide an instance (' +
                error.message +
                ')'
        )
    }
})

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
},{"performance-now":3}]},{},[1]);
