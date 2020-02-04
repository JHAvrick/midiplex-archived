import BaseNode from "./base-node";

/**
 * The FilterNode class is the base class for most NodeDefintions
 */
class FilterNode extends BaseNode {
    constructor(scene, id, config) {
        super(scene, id, config);
    }

    activate(){
        this.scene.clock.quantize(this.quantize, this.tick.bind(this));
    }


    // /**
    //  * Activates this node, causing any device, clock or other system events to be bound
    //  */
    // activate(){
    //     //this.clock.quantize(this.quantize, this.tick.bind(this));
        
    //     /**
    //      * Bind all of our system-level events
    //      */
    //     //this._eventBridge.bindEvents();
    // }

    // /**
    //  * Deactivates this node, causing it to unsubscribe to any events
    //  */
    // deactivate(){
    //     /**
    //      * Unbind our system-level events
    //      */
    //     //this._eventBridge.unbindEvents();
    // }
}

export default FilterNode;