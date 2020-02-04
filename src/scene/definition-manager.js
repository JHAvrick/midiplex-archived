import cloneDeep from 'lodash.clonedeep';
import EventEmitter from 'util/event-emitter';
import shortid from 'shortid';

class DefinitionManager {
    constructor(defs = []){
        this.defs = new Map();
        this.events = new EventEmitter();
        this.addDefinitions(defs);
    }

    on(event, listener){ this.events.on(event, listener) }

    addDefinitions(defs = []){
        defs.forEach((def) => 
            this.addDefinition(def, true)
        );
    }

    addDefinition(def, suppressEvent){
        this.defs.set(def.name, def);
        if (!suppressEvent) 
            this.events.emit("definitionAdded", def.name);
    }

    removeDefinition(id){
        this.events.emit("definitionRemoved", id);
        this.defs.delete(id);
    }

    getDefinition(id){
        return cloneDeep(this.defs.get(id));
    }
}

export default DefinitionManager;