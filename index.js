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