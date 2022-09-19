const ProcessTimer = require('process-timer');
const requestAnimationFrame = require("raf");

/**
 * @typedef {Object} TimeoutConfiguration
 * @property {boolean} cancelled
 */

class TimeoutController{
    /**
     * @param {TimeoutConfiguration} config 
     */
    constructor(config){
        this.config = config;
    }
    cancel(){
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
function prcTimeout(milliseconds, callback, config={cancelled: false}){
    const timer = new ProcessTimer();
    const executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback, false, config));
    return new TimeoutController(config);
}

/**
 * Executes callback for only once after specified delay in milliseconds
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @param {IntervalConfiguration} config Don't set this parameter manually
 * @return {TimeoutController}
 */
 function prcTimeoutWithDelta(milliseconds, callback, config={cancelled: false}){
    const timer = new ProcessTimer();
    const executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback, true, config));
    return new TimeoutController(config);
}

/**
 * @typedef {Object} IntervalConfiguration
 * @property {boolean} cancelled Tells interval to execute callback at next tick. If once set to false, interval will be permanently deleted.
 * @property {boolean} interval Defines period in milliseconds.
 * @property {Function} callback Only getter for callback function of interval.
 */

class IntervalController{
    /**
     * @param {IntervalConfiguration} config 
     * @param {boolean} hasDelta
     */
    constructor(config, hasDelta){
        this.config = config;
        this.callback = config.callback;
        this.hasDelta = hasDelta;
    }

    restart(){
        this.config.cancelled = true;
        if(this.hasDelta){
            const newInterval = prcIntervalWithDelta(this.config.interval, this.config.callback);
            this.config = newInterval.config;
        }else{
            const newInterval = prcInterval(this.config.interval, this.config.callback);
            this.config = newInterval.config;
        }
    }

    cancel(){
        this.config.cancelled = true;
    }

    pauseResume(){
        if(this.config.cancelled){
            this.restart();
        }else{
            this.config.cancelled = true;
        }
    }

    setPeriod(milliseconds){
        this.config.interval = milliseconds;
        this.restart();
    }

    getPeriod(){
        return this.config.interval;
    }

}

/**
 * 
 * @param {Number} milliseconds Delay time in milliseconds
 * @param {Function} callback Function which will be executed after delay time
 * @returns {IntervalController}
 */
function prcInterval(milliseconds, callback){
    /** @type {IntervalConfiguration} */ let config = {
        cancelled: false,
        interval: milliseconds,
        callback: callback,
    };
    const configuredCallback = () => {
        callback();
        if(!config.cancelled){
            prcTimeout(milliseconds, configuredCallback);
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
 function prcIntervalWithDelta(milliseconds, callback){
    /** @type {IntervalConfiguration} */ let config = {
        cancelled: false,
        interval: milliseconds,
        callback: callback,
    };
    
    const configuredCallback = (deltaT) => {
        callback(deltaT);
        if(!config.cancelled){
            prcTimeoutWithDelta(milliseconds, configuredCallback);
        }
    }
    prcTimeoutWithDelta(milliseconds, configuredCallback, config);
    return new IntervalController(config, true);
}

/**
 * @param {Number} executeAfter Delay Time
 * @param {Function} callback Callback Function
 * @param {Boolean} bindDeltaT Bind delta time to callback function
 */
function tick(executeAfter, callback, bindDeltaT, config){
    if(this.msec < executeAfter && (!config || !config.cancelled)){
        requestAnimationFrame(tick.bind(this, executeAfter, callback, bindDeltaT, config));
    }else if((!config || !config.cancelled) && bindDeltaT){
        callback(this.msec);
    }else if(!config || !config.cancelled){
        callback();
    }
}

module.exports = { prcTimeout, prcTimeoutWithDelta, prcInterval, prcIntervalWithDelta, IntervalController, TimeoutController };