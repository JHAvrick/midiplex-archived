import EventBinders from './event-binders';

class EventBridge {
    constructor(Systems, node, eventConfigs = []){
        this._binders = eventConfigs.map((config) => {
            return new EventBinders[config.type](Systems, node, config);
        })
    }

    bindEvents(){
        this._binders.forEach((binder) => binder.bind());
    }

    unbindEvents(){
        this._binders.forEach((binder) => binder.unbind());
    }
}

export default EventBridge;