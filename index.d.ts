declare function prcTimeout(milliseconds:number, callback: Function) : void;
type IntervalController = {
    end: boolean
}
declare function prcInterval(milliseconds:number, callback:Function) : IntervalController;
export {prcTimeout, prcInterval}