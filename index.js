const ProcessTimer = require('process-timer');
const requestAnimationFrame = require("raf");

/**
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 */
function prcTimeout(milliseconds, callback){
    const timer = new ProcessTimer();
    const executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback));
}


/**
 * @typedef {Object} IntervalConfiguration
 * @property {boolean} end Tells interval to execute callback at next tick. If once set to false, interval will be permanently deleted.
 */

/**
 * 
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @returns {IntervalConfiguration}
 */
function prcInterval(milliseconds, callback){
    let config = {
        end: false
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
 * @param {*} executeAfter Delay Time
 * @param {*} callback Callback Function
 */
function tick(executeAfter, callback){
    if(this.msec < executeAfter){
        requestAnimationFrame(tick.bind(this, executeAfter, callback));
    }else{
        callback();
    }
}

module.exports = { prcTimeout, prcInterval };