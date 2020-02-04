import NanoTimer from 'nanotimer';
import LowPrecisionTimer from './low-precision-timer';
import EventEmitter from 'util/event-emitter';
import clone from 'lodash.clone';

const Precisions = {
    millisecond: {
        minute: 60000,
        unit: 'm'
    },
    microsecond: {
        minute: 60000000,
        unit: 'u'
    },
    nanosecond: {
        minute: 60000000000,
        unit: 'n'
    }
}

class Clock {
    constructor(config){
        let params = Object.assign({}, Clock.defaults, config);

        console.log(params);

        /**
         * Timer precision. We NEED to have a valid value for precision or very strange and
         * unfortunate things may happen.
         */
        this.precision = Precisions[params.precision] != null ? params.precision : "millisecond";

        /**
         * The beats-per-minute of this clock
         */
        this.bpm = params.bpm;

        /**
         * How deeply to subdivide each measure (or divide this value by beats-per-measure) to
         * determine how each individual beat is subdivided 
         */
        this.resolution = params.resolution;

        /**
         * The clock's time signature - should be an array with two values
         */
        this.timeSignature = params.timeSignature;

        /**
         * The function called on each clock tick
         */
        this.callback = params.callback;

        /**
         * Object which stores the clock's state when active or paused
         */
        this.timeData = {
            ticks: 0,
            lastBeat: 0,
            beat: 0,
            subbeat: [],
            measure: 0
        }

        /**
         * Events to be triggered 
         */
        this.subdivisions = [];

        /**
         * Event dispatch
         */
        this._events = new EventEmitter();

        /**
         * Our interval timer. For millisecond precision, the much less cpu-intensive LowPrecisionTimer
         * is used. Unless absolutely necessary, this is the recommended precision.
         */
        this._timer = this.precision === "millisecond" ? new LowPrecisionTimer() : new NanoTimer();


        /**
         * Event emitter
         */
        this._events = new EventEmitter();
    }

    /**
     * Function called on every interval tick
     */
    _workFunction(){
        //Increment time data
        this.timeData.ticks = this.timeData.ticks + 1;
        this.timeData.lastBeat = this.timeData.beat;
        this.timeData.beat = this.timeData.ticks % (this.resolution / this.timeSignature[1]) === 0 ? this.timeData.beat + 1 : this.timeData.beat;
        this.timeData.measure = ( (this.timeData.beat - 1) % this.timeSignature[0]) === 0 && this.timeData.beat !== this.timeData.lastBeat ? this.timeData.measure + 1 : this.timeData.measure;

        //Calculate the subbeat 
        let lastBeat = clone(this.timeData.subbeat);
        for (let i = 2; i < (Math.log(this.resolution) / Math.log(2)) + 1; i++){
            let index = i - 2;
            let beatDivisor = Math.pow(2, i);

            //Set the initial beat - only relevant the first time around
            //in the first interval
            if (this.timeData.subbeat[index] === undefined){
                this.timeData.subbeat[index] = 1;
            }

            //Check if there is a beat for each respective divisor on this tick
            //If so, increment the beat counter or wrap its value
            if (this.timeData.ticks % (this.resolution / beatDivisor) === 0)
                this.timeData.subbeat[index] = this.timeData.subbeat[index] < beatDivisor 
                                             ? this.timeData.subbeat[index] + 1 : 1;
        }

        this.callback({
            bpm: this.bpm,
            resolution: this.resolution,
            ticks: this.timeData.ticks,
            lastBeat: lastBeat,
            beat: clone(this.timeData.subbeat),
            measure: this.timeData.measure
        }) 
    }

    start(){
        //Calculate the smallest timing interval we need to support the given BPM at resolution
        let interval = ((Precisions[this.precision].minute / this.bpm) * this.timeSignature[1]) / this.resolution;

        this._timer.setInterval(
            this._workFunction.bind(this), 
            [''], 
            interval + Precisions[this.precision].unit
        );    
    }

    /**
     * Clears the interval timer and resets all time data
     */
    stop(){
        this._timer.clearInterval();
        this.timeData = {
            ticks: 0,
            lastBeat: 0,
            beat: 0,
            subbeat: [],
            measure: 0
        }
    }

    /**
     * Clears the interval timer, but does not clear time data
     */
    pause(){
        this._timer.clearInterval();
    }

}

Clock.defaults = { 
    precision: "nanoseconds", 
    bpm: 120, 
    resolution: 32, 
    timeSignature: [4,4], 
    callback: function(){}
}

/**
 * Valid quantize factors - used to trigger events on particular beats.
 * TO DO: Add dotted notes, swing?
 */
Clock.quantizeFactors = ["1/4", "1/8", "1/16", "1/32", "1/64", "1/128"];

export default Clock;

