import EventEmitter from "util/event-emitter";
import NodeMessageHistory from './subsystems/node-history';
import cloneDeep from 'lodash.clonedeep';
import PropertyResolver from "./subsystems/property-resolver";
import NodeUtils from "./utils/node-utils";
import InputEventTypes from "config/input-event-types";
import NodeStates from "config/node-states";


class BaseNode {
    constructor(scene, id, config){
        let options = Object.assign({}, BaseNode.defaults, config);

        //Internal state
        this.scene = scene;
        this.id = id;
        this.baseNodeClass = options.baseNodeClass;
        this.definitionName = options.definitionName;
        //this.inputIDs = options.inputIDs;
        //this.outputIDs = options.outputIDs;
        this.receiveTypes = options.receiveTypes || InputEventTypes;
        this.sendTypes = options.sendTypes || InputEventTypes;
        this.meta = new Map(Object.entries(options.meta)); //Editor properties like xy position
        this.inputs = new Map(); //Populated via to() or from() methods
        this.outputs = new Map();
        
        //Systems
        this.events = new EventEmitter(); //Node events
        this.history = new NodeMessageHistory(); //For debugging 
        this.resolver = new PropertyResolver(scene);

        //Definition Binding
        this.def = {
            utils: NodeUtils,
            tick: options.tick,
            receive: options.receive,
            state: options.state,
            schema: options.schema, //provides validation for def props, comes from definition
            props: this.resolver.resolveAll(options.schema, options.props), //options.props come from serialized config
        }

        //Node State (included from top level def object)
        this.muted = options.muted || false;
        this.bypassed = options.bypassed || false;
        this.quantize = options.quantize || "1/4";

        /**
         * Set our NodeState - in the future this may not be set to ready if there are async
         * tasks to complete (like loading files?)
         */
        this.state = NodeStates.READY;
        this.events.emit("stateChange", this.state);
    }
    
    on(event, listener){
        this.events.on(event, listener);
    }

    activate(){
        console.log("Quantatize Me Captain!");
        this.scene.clock.quantize(this.quantize, this.tick.bind(this));
    }

    deactivate(){
        //TODO: Remove clock listener????
    }

    /**
     * Set a simple meta value for this node
     * 
     * @param {String} name - The meta property name
     * @param {Any} value - A serializable value
     */
    setMeta(name, value){
        this.meta[name] = value;
    }

    /**
     * Modify one of the properties exposed to this node's definition functions
     * 
     * @param {String} name - The name of a property that has been defined 
     * in the definition's props schema
     * @param {Any} value - The new value for the property
     */
    setProperty(name, value){
        console.log(name);

        if (this.def.schema[name] !== undefined){
            this.def.props[name] = this.resolver.resolve(this.def.schema[name], value);
            this.events.emit("propertyModified", this.getProperties());
        }

        /* 
        console.log(value);
        console.log(this.resolver.resolve(this.def.schema[name], value));
        console.log(this.def.props);
        */
    }

    /**
     * Returns an array of property objects which contain the full schema as 
     * well as current actual value of the property
     */
    getProperties(){
        let propList = [];
        for (let prop in this.def.schema){
            propList.push(
                Object.assign({}, this.def.schema[prop], { name: prop, value: this.def.props[prop] })
            )
        }
        return propList;
    }

    getInputs(){return Array.from(this.inputs.values())}
    getOutputs(){return Array.from(this.outputs.values())}

    toggleBypassed(){
        this.bypassed = !this.bypassed;
        this.events.emit("bypassToggled");
    }

    toggleMuted(){
        this.muted = !this.muted;
        this.events.emit("muteToggled");
    }

    /**
     * Add a node to this node's output list
     * @param {Node} node - A downstream node
     */
    to(node){
        if (this.outputs.has(node.id) || this.inputs.has(node.id)) return;
        this.outputs.set(node.id, node);
        node.from(this);
    }

    /**
     * Add a node to this node's input list
     * @param {Node} node - An upstream node
     */
    from(node){
        if (this.outputs.has(node.id) || this.inputs.has(node.id)) return;
        this.inputs.set(node.id, node);
        node.to(this);
    }

    getMeta(name){
        return this.meta.get(name);
    }

    setMeta(name, value){
        this.meta.set(name, value);
        this.events.emit("metaChanged", name, value);
    }

    activate(){}
    deactivate(){}

    /**
     * Disconnects a node from this one, regardless of whether it 
     * is an input or output
     * @param {BaseNode} node 
     */
    disconnect(node){
        this.inputs.delete(node.id);
        this.outputs.delete(node.id);
        node.inputs.delete(this.id);
        node.outputs.delete(this.id);
    }

    /**
     * Determines if another node is in this node's dowstream (i.e. is after this node).
     * When the recursive flag is set to true (default), it will check all descendants 
     * recursively - when set to false it will only check this node's immediate outputs.
     * 
     * @param {*} nodeId 
     * @param {Boolean} recursive - Set to false when you only care about immediate connections
     */
    hasDownstream(nodeId, recursive = true){ 
        if (this.outputs.has(nodeId)) return true;
        if (!recursive) return false;

        let downstream = false;
        let outputs = Array.from(this.outputs.values());
        for (let i = 0; i < outputs.length; i++){
            downstream = outputs[i].hasDownstream(nodeId);
        }

        return downstream;
    }

    /**
     * Determines if another node is in this node's upstream (i.e. is before this node).
     * When the recursive flag is set to true (default), it will check all ancestors
     * recursively - when set to false it will only check this node's immediate inputs.
     * 
     * @param {*} nodeId 
     * @param {Boolean} recursive - Set to false when you only care about immediate connections
     */
    hasUpstream(nodeId, recursive = true){ 
        if (this.inputs.has(nodeId)) return true;
        if (!recursive) return false;

        let upstream = false;
        let inputs = Array.from(this.inputs.values());
        for (let i = 0; i < inputs.length; i++){
            upstream = inputs[i].hasUpstream(nodeId);
        }

        return upstream;
     }

    /**
     * Wrapper for the definition binding of tick()
     * @param {Object} timeData - A time data object
     */
    tick(timeData){
        if (this.state = NodeStates.ERROR) return; 
        if (this.muted) return;

        try {
            /**
             * Call the definition's message and pass in data object
             */
            this.def.tick({
                time: timeData,
                utils: this.def.utils,
                props: this.def.props,
                state: this.def.state,
                sendGroup: () => {
                    //Break the group down into individual messages and send each
                },
                send: (filteredMessage) => {
                    this.outputs.forEach((output) => {
                        let clonedMessage = cloneDeep(filteredMessage);
                        output.receive(clonedMessage);
                    })
                }
            });

        } catch (err){
            this.state = NodeStates.ERROR;
            this.events.emit("tickError", err);
            this.events.emit("stateChange", this.state);
        }

    }

    /**
     * Wrapper for the definition binding of recieve(0)
     * @param {Object} message - A WebMidiJS Message
     */
    receive(message){
        if (this.state = NodeStates.ERROR) return; //Stop receiving if this node is in an error state
        if (!this.receiveTypes.includes(message.type)) return;
        if (this.muted) return;
        if (this.bypassed){
            this.outputs.forEach((output) => {
                output.receive(cloneDeep(message));
            })
            return;
        }

        try {
            this.def.receive({
                message: message,
                utils: this.def.utils,
                props: this.def.props,
                state: this.def.state,
                sendGroup: () => {
                    //Break the group down into individual messages and send each
                },
                send: (filteredMessage) => {
                    this.outputs.forEach((output) => {
                        let clonedMessage = cloneDeep(filteredMessage);
                        output.receive(clonedMessage);
                    })
                }
            })
        } catch (err){
            this.state = NodeStates.ERROR;
            this.events.emit("receiveError", err);
            this.events.emit("stateChange", this.state);
        }

    }

    toSerializable(){
        return {
            id: this.id,
            deviceId: this.deviceId,
            definitionName: this.definitionName,
            quantize: this.quantize,
            muted: this.muted,
            bypassed: this.bypassed,
            baseNodeClass: this.baseNodeClass, //NOT used in the config
            from: Array.from(this.inputs.values()).map((node) => node.id),
            to: Array.from(this.outputs.values()).map((node) => node.id),
            meta: Object.fromEntries(this.meta),
            props: this.resolver.toSerializableAll(this.def.schema, this.def.props),
            state: this.def.state
        }
    }

}

BaseNode.defaults = {
    quantize: "1/4",
    muted: false,
    bypassed: false,
    baseNodeClass: "FilterNode",
    definitionName: "DefaultNode",
    inputIDs: [],
    outputIDs: [],
    meta: {},
    schema: {},
    props: {},
    state: {},
    send: function(){},
    tick: function(){},
    receive: function(){},
}

export default BaseNode;