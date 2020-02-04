import BaseNode from './base-node';

/**
 * The OutputDeviceNode is the end-point of a midi message 
 */
class OutputDeviceNode extends BaseNode {
    constructor(scene, id, config) {
        super(scene, id, config);
        this.deviceId = config.deviceId || 'nulldevice';
        this.scene.devices.on("deviceRemoved", this._handleDeviceRemoved.bind(this));
    }

    _handleDeviceRemoved(removedId){
        if (removedId === this.deviceId){
            this.deviceId = 'nulldevice';
            this.events.emit("deviceChanged", this.deviceId);
        }
    }

    setDevice(id){
        if (id === this.deviceId) return;

        this.deviceId = id;
        this.events.emit("deviceChanged");
    }

    /**
     * In this OutputDeviceNode, messages are sent to the target device
     * 
     * @param {Object} message - A WebMidiJS message object
     */
    receive(message){
        this.scene.devices.send(this.deviceId, message, message.channel);
    }

}

export default OutputDeviceNode;