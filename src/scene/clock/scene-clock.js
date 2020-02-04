import EventEmitter from 'util/event-emitter';
import Clock from './clock';

class SceneClock {
    constructor(config = {}){
        this.config = Object.assign({}, SceneClock.defaults, config);

        /**
         * Our system timer
         */
        this._clock = new Clock({
            precision: this.config.precision,
            bpm: this.config.bpm,
            resolution: this.config.resolution,
            timeSignature: this.config.timeSignature,
            callback: this._onTick.bind(this)
        });

        /**
         * Flag indicating whether the clock is currently ticking
         */
        this.active = false;

        /**
         * Event emitter
         */
        this._events = new EventEmitter();
    }

    _onTick(data){
        for (let i = 0; i < data.beat.length; i++){
            /**
             * Trigger beat quantize events
             */
            if (data.lastBeat[i] != data.beat[i]){
                this._events.emit(SceneClock.quantizeFactors[i], data);
            }
            
            /**
             * Trigger specific beat events
             */
            let beatEventStr = data.measure.toString() + "." + data.beat.slice(0, i).join(".");
            this._events.emit(beatEventStr);
        }
    }

    get bpm(){ return this._clock.bpm; }
    get timeSignature(){ return this._clock.timeSignature; }

    /**
     * 
     * @param {Node} node - A node with a tick() function 
     * @param {*} quantizeFactor - What clock tick to quantize to
     */
    quantize(quantizeFactor = "1/4", listener = function(){}){
        if (SceneClock.quantizeFactors.includes(quantizeFactor)){
            this._events.on(quantizeFactor, listener);
            return;
        }
        console.warn("Invalid Quantize Factor: " + quantizeFactor);
    }

    /**
     * Add an event to be triggered on a particular beat.
     * NOTE: The measure & beat strings are concatenated to create the event string,
     * (see the _onTick() loop implementation)
     * 
     * @param {String} beat - A string representing a particular beat, where the first
     * number denotes the measure, and the following numbers denote the beat. The string
     * should not denote beat specificity beyong what is necessary (i.e. no trailing 1s)
     * 
     * Example: 1.1.4.8 - First measure, first quarter note, fourth 8th note, 8th sixteenth note
     */
    onBeat(beatString, listener){
        this._events.on(beatString, listener);
    }

    /**
     * Add an event to be triggered at a particular time once the clock has 
     * been started
     */
    atTime(){

    }

    /**
     * Wrapper functions for the Clock 
     */
    start(){ 
        this._clock.start() 
        this.active = true;
    }

    stop(){ 
        this._clock.stop() 
        this.active = false;
    }

    pause(){ 
        this._clock.pause() 
        this.active = false;
    }

}

SceneClock.defaults = {
    precision: "millisecond",
    bpm: 120,
    resolution: 64,
    timeSignature: [4,4]
}

/**
 * Valid quantize factors - used to trigger events on particular beats.
 * TO DO: Add dotted notes, swing?
 */
SceneClock.quantizeFactors = ["1/4", "1/8", "1/16", "1/32", "1/64", "1/128"];

export default SceneClock;