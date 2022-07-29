const ProcessTimer = require('process-timer');
const requestAnimationFrame = require("raf");

/**
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 */
function prcTimeout(milliseconds, callback){
    const timer = new ProcessTimer();
    const executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback, false));
}

/**
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 */
 function prcTimeoutWithDelta(milliseconds, callback){
    const timer = new ProcessTimer();
    const executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback, true));
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
    const configuredCallback = (cfg) => {
        callback();
        if(!cfg.end){
            prcTimeout(milliseconds, configuredCallback.bind(null, cfg));
        }
    }
    prcTimeout(milliseconds, configuredCallback.bind(null, config));
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
    
    const configuredCallback = (cfg, deltaT) => {
        callback(deltaT);
        if(!cfg.end){
            prcTimeoutWithDelta(milliseconds, configuredCallback.bind(null, cfg));
        }
    }
    prcTimeoutWithDelta(milliseconds, configuredCallback.bind(null, config));
    return config;
}

/**
 * @param {Number} executeAfter Delay Time
 * @param {Function} callback Callback Function
 * @param {Boolean} bindDeltaT Bind delta time to callback function
 */
function tick(executeAfter, callback, bindDeltaT){
    if(this.msec < executeAfter){
        requestAnimationFrame(tick.bind(this, executeAfter, callback, bindDeltaT));
    }else if(bindDeltaT){
        callback(this.msec);
    }else{
        callback();
    }
}

module.exports = { prcTimeout, prcTimeoutWithDelta, prcInterval, prcIntervalWithDelta };