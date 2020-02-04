
/**
 * This is an interval timer w/ millisecond precision. It uses setTimeout
 * but accounts for time drift errors. This timer can be used in the browser.
 */
class LowPrecisionTimer {
    constructor(){
        this.callback;
        this.errorCallback;
        this.interval;
        this.expected;
        this.timeout;
    }

    setInterval(callback, args, interval, errorCallback = function(){}){
        this.callback = callback;
        this.errorCallback = errorCallback;
        this.interval = parseInt(interval.substring(0, interval.length - 1));
        this.expected = Date.now() + this.interval;
        this.timeout = setTimeout(this._step.bind(this), this.interval);
    }

    clearInterval(){
        clearTimeout(this.timeout);
    }

    _step(){
        var drift = Date.now() - this.expected;
        if (drift > this.interval) {
            // You could have some default stuff here too...
            this.errorCallback();
        }
        this.callback();
        this.expected += this.interval;
        this.timeout = setTimeout(this._step.bind(this), Math.max(0, this.interval - drift));
    }
}

export default LowPrecisionTimer;