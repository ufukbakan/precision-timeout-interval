declare function prcTimeout(milliseconds:number, callback: Function) : void;
declare function prcTimeoutWithDelta(milliseconds:number, callback: Function) : void;
type IntervalController = {
    end: boolean,
    interval: number,
    callback: Function
}
declare function prcInterval(milliseconds:number, callback:Function) : IntervalController;
declare function prcIntervalWithDelta(milliseconds:number, callback:Function) : IntervalController;
export {prcTimeout, prcTimeoutWithDelta, prcInterval, prcIntervalWithDelta}