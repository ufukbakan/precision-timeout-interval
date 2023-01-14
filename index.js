const requestAnimationFrame = require("raf");
const now = require("performance-now");

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
    const executeAfter = now() + milliseconds;
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
    const executeAfter = now() + milliseconds;
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
        prcTimeout(milliseconds, configuredCallback, config);
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
        prcTimeoutWithDelta(milliseconds, configuredCallback, config);
    }
    prcTimeoutWithDelta(milliseconds, configuredCallback, config);
    return new IntervalController(config, true);
}

/**
 * @param {Number} timestamp Now
 * @param {Number} executeAfter Should call callback after this
 * @param {Function} callback Callback Function
 * @param {Boolean} bindDeltaT Bind delta time to callback function
 * @param {TimeoutConfiguration | IntervalConfiguration} config Interval or Timeout config
 */
function tick(timestamp, executeAfter, callback, bindDeltaT, config) {
    if (timestamp < executeAfter && !config.cancelled) {
        requestAnimationFrame((ts) => tick(ts, executeAfter, callback, bindDeltaT, config));
    } else if (!config.cancelled && bindDeltaT) {
        callback(timestamp - config.lastCallTimestamp);
        config.lastCallTimestamp = timestamp;
    } else if (!config.cancelled) {
        callback();
    }
}

module.exports = { prcTimeout, prcTimeoutWithDelta, prcInterval, prcIntervalWithDelta, IntervalController, TimeoutController };