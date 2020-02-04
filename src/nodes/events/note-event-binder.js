import ActionHandlers from './action-handlers';
/**
 * A note event configuration must follow the following schema:
 * {
 *      type: "note" - the event type
 *      deviceId: <String> - the device which will trigger this event
 *      trigger: <String | Number> - the note which will trigger this event
 *      actions: {
 *          ...<Action Types
 *      }
 * }
 */
class NoteEventBinder {
    constructor(Systems, node, config){
        this.sys = Systems;
        this.node = node;
        this.config = config;
    }

    _eventCallback(message){
        let noteName = message.note.name + message.note.octave;
        //Check if the trigger note was pressed for this event to dispatch
        if (noteName === this.config.trigger || message.note.number === this.config.trigger){
            for (let actionType in this.config.actions){
                let actionConfig = this.config.actions[actionType];
                ActionHandlers[actionType](this.node, actionConfig);
            }
        }
    }

    bind(){
        this.sys.devices.addListener(
            this.config.deviceId, 
            ["noteon"], 
            this._eventCallback.bind(this)
        )
    }

    unbind(){
        this.sys.devices.removeListener(
            this.config.deviceId, 
            ["noteon"], 
            this._eventCallback.bind(this)
        )
    }
}

export default NoteEventBinder;