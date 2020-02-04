import ActionHandlers from './action-handlers';
/**
 * A note event configuration must follow the following schema:
 * {
 *      type: "beat" - the event type
 *      trigger: <String> - a string denoting the measure and beat where this event should take place
 *      actions: {
 *          ...<Action Types
 *      }
 * }
 */
class BeatEventBinder {
    constructor(Systems, node, config){
        this.sys = Systems;
        this.node = node;
        this.config = config;
    }

    _eventCallback(message){
        for (let actionType in this.config.actions){
            let actionConfig = this.config.actions[actionType];
            ActionHandlers[actionType](this.node, actionConfig);
        }
    }

    bind(){
        this.sys.clock.onBeat(
            this.config.trigger,
            this._eventCallback.bind(this)
        )
    }

    unbind(){
        /**
         * Do something???
         */
    }
}

export default BeatEventBinder;