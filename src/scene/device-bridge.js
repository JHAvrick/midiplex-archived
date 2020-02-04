import EventEmitter from '../util/event-emitter';
import isEqual from 'lodash.isequal'
import shortid from 'shortid';

/**
 * TODO:
 *  - Standardize method names so that it is clear which ones modify a specific device and which ones modify the EventBridge itself
 */
class DeviceBridge {
    constructor(WebMidi, deviceConfigs) {
        console.log(deviceConfigs);

        /* USE THIS TO RESET DEVICE CONFIG STORE */
        /* 
        deviceConfigs = [{
            id: "defaultdevice",
            name: "Default Device",
            webmidi: {
                inputId: false,
                outputId: false
            }
        }];
        */
        
        
        /**
         * Reference to WebMidi lib
         */
        this.webMidi = WebMidi;
        setTimeout(() => {
            /**
             * Wait to add this event until after the initial connection so we're not
             * spamming the console w/ connections & re-connections. 
             */
            this.webMidi.addListener("connected", this._handleInputsConnected.bind(this));
            this.webMidi.addListener("disconnected", this._handleOutputsConnected.bind(this));
        }, 3000)
        
        /**
         * Keep a reference to our configs
         */
        this.configs = deviceConfigs;

        /**
         * Where our devices will be stored when resolved from config
         */
        this._devices = {};
        if (deviceConfigs.length === 0){
            this._devices["nulldevice"] = {
                name: "blank",
                id: "nulldevice",
                inputEvents: [],
                outputEvents: [],
                inputId: "nulldevice",
                outputId: "nulldevice",
                input: false,
                output: false
            }
        } else {
            deviceConfigs.forEach((config) => this._devices[config.id] = {
                name: config.name,
                id: config.id,
                inputEvents: [],
                outputEvents: [],
                inputId: config.webmidi.inputId,
                outputId: config.webmidi.outputId,
                input: false,
                output: false
            })
        }

        /**
         * Holds un-registered events
         */
        this._unregisteredEvents = [];

        /**
         * Event manager emits events relating to the state
         * of the DeviceBridge - events relating to inputs and outputs
         * are sent up to by WebMidiJS
         */
        this.events = new EventEmitter();

        /**
         * Attempt to fetch our devices from WebMidi
         */
        this._bindDevices();
    }

    on(event, listener){
        this.events.on(event, listener);
    }

    _handleInputsConnected(){
        this._bindDevices();
        this.events.emit("portsAdded");
    }

    _handleOutputsConnected(){
        this._bindDevices();
        this.events.emit("portsRemoved");
    }

    _consolidateDevices(){
        this._bindDevices();
    }

    _bindDevices() {
        //console.log("Before", this._devices)
        Array.from(Object.values(this._devices)).forEach((device) => {
            this.setDeviceInputPort(device.id, device.inputId);
            this.setDeviceOutputPort(device.id, device.outputId);
            this.events.emit("deviceStatusChange", device);
        });
        //console.log("After", this._devices);
    }

    /**
     * Clears all input port events registered for a given device. Necessary to call
     * when a devices input port changes or before a device is removed. 
     * 
     * @param {String} deviceId 
     */
    _clearInputEvents(deviceId){
        if (!this._devices[deviceId].input) return;
        let input = this._devices[deviceId].input;
        this._devices[deviceId].inputEvents.forEach((eventItem) => {                
            eventItem.events.forEach((event) => {
                input.removeListener(event, "all", eventItem.listener);
            });
        })
    }

    /**
     * Binds any input events registered for a particular device. Necessary to call when
     * a devices port is found/added/replaced. Should only be called AFTER _clearInputEvents
     * 
     * @param {String} deviceId 
     */
    _bindInputEvents(deviceId){
        if (!this._devices[deviceId].input) return;
        let input = this._devices[deviceId].input;
        this._devices[deviceId].inputEvents.forEach((eventItem) => {                
            eventItem.events.forEach((event) => {
                input.addListener(event, "all", eventItem.listener);
            });
        });
    }

    addDevice(name = "Unnamed Device"){
        let id = shortid.generate();
        this._devices[id] = {
            id: id,
            name: name,
            inputEvents: [],
            outputEvents: [],
            inputId: "nulldevice",
            outputId: "nulldevice",
            input: false,
            output: false
        }
        this.events.emit("deviceAdded");
    }

    removeDevice(deviceId){
        this._clearInputEvents(deviceId);
        delete this._devices[deviceId];
        this.events.emit("deviceRemoved", deviceId);
    }

    pollOutput(portId){
        this.webMidi.getOutputById(portId).playNote("C3");
        setTimeout(() => {
            this.webMidi.getOutputById(portId).stopNote("C3");
        }, 200)
    }

    inputPortInUse(portId){
        for (let id in this._devices){
            if (this._devices[id].input.id === portId) return true
        }
        return false;
    }

    outputPortInUse(portId){
        for (let id in this._devices){
            if (this._devices[id].output.id === portId) return true
        }
        return false;
    }

    getInputPorts(availableOnly = false){
        if (!availableOnly) return this.webMidi.inputs;
        return this.webMidi.inputs.filter((input) => {
            for (let id in this._devices){
                if (this._devices[id].input.id == input.id) return false;
            }
            return true;
        })
    }

    getOutputPorts(availableOnly = false){
        if (!availableOnly) return this.webMidi.outputs;
        return this.webMidi.outputs.filter((output) => {
            for (let id in this._devices){
                if (this._devices[id].output.id == output.id) return false;
            }
            return true;
        })
    }

    /**
     * Assigns a new input port for a device
     * 
     * @param {String} deviceId 
     * @param {String} outputId 
     */
    setDeviceInputPort(deviceId, inputId){
        this._clearInputEvents(deviceId); //Clear the previous ports events 
        if (this._devices[deviceId]){
            /**
             * Assign our inputId and get actual webmidi input
             */
            this._devices[deviceId].inputId = inputId;
            this._devices[deviceId].input = this.webMidi.getInputById(inputId);

            /**
             * Bind our events, does nothing if the input is `false` (i.e. WebMidi didn't find it)
             */
            this._bindInputEvents(deviceId); 
            /**
             * Emit our port and device status events
             */
            this.events.emit("devicePortChange", this._devices[deviceId]);
            this.events.emit("deviceStatusChange", this._devices[deviceId]);
        }
    }

    /**
     * Assigns a new output port for a device
     * 
     * @param {String} deviceId 
     * @param {String} outputId 
     */
    setDeviceOutputPort(deviceId, outputId){
        if (this._devices[deviceId]){
            this._devices[deviceId].outputId = outputId;
            this._devices[deviceId].output = this.webMidi.getOutputById(outputId);
            this.events.emit("devicePortChange", this._devices[deviceId]);
            this.events.emit("deviceStatusChange", this._devices[deviceId]);
        } 
    }

    getInputStatus(id){
        if (!this._devices[id]) return false;
        if (this._devices[id].input === false) return false;
        if (this._devices[id].input.state === "disconnected") return false;

        return true;
    }

    getOutputStatus(id){
        if (!this._devices[id]) return false;
        if (this._devices[id].output === false) return false;
        if (this._devices[id].output.state === "disconnected") return false;

        return true;
     }

    getDevice(deviceId){
        return this._devices[deviceId];
    }

    getDevices(){
        if (Array.from(Object.values(this._devices)).length === 0){
            return {

            }
        }

        return this._devices;
    }

    setDeviceProperty(deviceId, propertyName, value){
        if (!this._devices[deviceId]) return false;
        if (propertyName === "input" || propertyName === "output") return;

        this._devices[deviceId][propertyName] = value;
        this.events.emit("devicePropertyChange", deviceId, propertyName, value);
    }

    /**
     * TODO: Prevent events from being registered twice! THIS WILL HAPPEN and testing based on the `inputEvents` array doesn't seem to work :(
     * 
     * @param {} deviceId 
     * @param {*} events 
     * @param {*} listener 
     */
    addDeviceListener(deviceId = false, events = [], listener = function () {}) {
        if (!this._devices[deviceId]) return;

        /**
         * Check whether this event has already been registered, return if so.
         * This object comparison requires lodash isEqual to work.
         */
        for (let i = 0; i < this._devices[deviceId].inputEvents.length; i++){
            let inputEvent = this._devices[deviceId].inputEvents[i];

            // console.log("-----------------------------------")
            // console.log(inputEvent);
            // console.log({events: events, listener: listener})
            // console.log(isEqual(inputEvent.events, events));
            // console.log(isEqual(inputEvent.listener, listener));
            // console.log(inputEvent.listener === listener);
            
            if (isEqual({events: events, listener: listener}, inputEvent)){
                return;
            }
        }

        /**
         * Register our event and add each event to the input port if an input port exists
         */
        this._devices[deviceId].inputEvents.push({events: events, listener: listener});
        if (this._devices[deviceId].input != false){
            let input = this._devices[deviceId].input;
            if (input != null && input != false) {
                events.forEach((event) => {
                    input.addListener(event, "all", listener);
                });
            }
        }

        console.log("addListener", this._devices[deviceId]);
        console.log("-----------------------------------")
    }

    removeDeviceListener(deviceId = false, events = [], listener = function () { }) {
        if (!this._devices[deviceId]) return;

        /**
         * Remove events from ports
         */
        if (this._devices[deviceId].input != false){
            let input = this._devices[deviceId].input;
            if (input != null && input != false) {
                events.forEach((event) => {
                    input.removeListener(event, "all", listener);
                });
            }
        }

        /**
         * Remove these events from the register
         * TODO: Test this
         */
        this._devices[deviceId].inputEvents.splice(
            this._devices[deviceId].inputEvents.indexOf({events: events, listener: listener}), 1
        );
    }

    send(deviceId = false, message, options = {}) {
        if (this._devices[deviceId] && this._devices[deviceId].output != false) {
            let output = this._devices[deviceId].output;
            DeviceBridge.messageBroker[message.type](output, message, options);
        }
    }

    toSerializable(){
        return Array.from(Object.values(this._devices)).map((device) => {
            return {
                id: device.id,
                name: device.name,
                webmidi: {
                    inputId: device.inputId,
                    outputId: device.outputId
                }
            }
        })
    }

}

DeviceBridge.eventTypes = [
    "sysex",
    "noteon",
    "noteoff",
    "controlchange",
    "raw"
]

DeviceBridge.messageBroker = {
    noteon: function(output, message, options){
        output.playNote(message.note.number, message.channel, options);
    },
    noteoff: function(output, message, options){
        output.stopNote(message.note.number, message.channel, options);
    },
    controlchange: function(output, message, options){
        //console.log(message, options);
        output.sendControlChange(message.controller.number, message.value, message.channel, options);
    },
    sysex: function(output, message){
        console.log("TO DO: Handle outgoing messages w/ type=sysex")
    },
    /**
     * This sends a raw message to an output. A raw message should have 
     * type: 'raw' and an array of hex or decimal values, with the first
     * value being the status byte. 
     */
    raw: function(output, message){
        let statusByte = message.data.shift();
        let data = message.data;
        output.send(statusByte, data);
    }
}


export default DeviceBridge;