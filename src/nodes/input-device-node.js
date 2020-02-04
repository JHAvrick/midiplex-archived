import cloneDeep from 'lodash.clonedeep';
import InputEventTypes from 'config/input-event-types';
import BaseNode from './base-node';

/**
 * The InputDeviceNode is the start point of a midi message 
 */
class InputDeviceNode extends BaseNode {
    constructor(scene, id, config) {
        super(scene, id, config);
        this.deviceId = config.deviceId || 'nulldevice';
    }

    _handleDeviceRemoved(removedId){
        if (removedId === this.deviceId){
            this.deviceId = 'nulldevice';
            this.events.emit("deviceChanged", this.deviceId);
        }
    }

    setDevice(id){
        if (id === this.deviceId) return;

        /**
         * Remove existing listener
         */
        this.scene.devices.removeDeviceListener(this.deviceId, InputEventTypes, this.receive.bind(this));

        /**
         * Add new device listener, and assign new reference ID
         */
        this.deviceId = id;
        this.scene.devices.addDeviceListener(id, InputEventTypes, this.receive.bind(this));
        this.events.emit("deviceChanged", this.deviceId);
    }

    activate(){
        this.scene.devices.on("deviceRemoved", this._handleDeviceRemoved.bind(this));
        this.scene.devices.addDeviceListener(this.deviceId, InputEventTypes, this.receive.bind(this));
    }

    deactivate(){
        this.scene.devices.events.removeListener("deviceRemoved", this._handleDeviceRemoved.bind(this));
        this.scene.devices.removeDeviceListener(this.deviceId, InputEventTypes, this.receive.bind(this));
    }

    /**
     * Override parent receive message
     * @param {Object} message - A WebMidiJS message object
     */
    receive(message){
        this.outputs.forEach((output) => {
            let clonedMessage = cloneDeep(message);
            output.receive(clonedMessage);
        });
    }
}

InputDeviceNode.inputEvents = [
    "sysex",
    "noteon",
    "noteoff",
    "controlchange"
]

export default InputDeviceNode;