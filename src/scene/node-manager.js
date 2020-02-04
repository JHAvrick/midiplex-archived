import Nodes from 'nodes/all-nodes';
import shortid from 'shortid';
import EventEmitter from 'util/event-emitter';

class NodeManager {
    constructor(scene, nodeConfigs = []){
        this.scene = scene;
        this.events = new EventEmitter();
        this.nodes = new Map();
        this._populate(nodeConfigs);
    }

    on(event, listener){
        this.events.on(event, listener);
    }

    _buildNode(nodeConfig){
        let id = nodeConfig.id || shortid.generate();
        let Definition = this.scene.definitions.getDefinition(nodeConfig.definitionName);
        let BaseNodeClass = Nodes[Definition.baseNodeClass];
        let node = new BaseNodeClass(this.scene, id, {
            baseNodeClass: Definition.baseNodeClass,
            definitionName: nodeConfig.definitionName,
            deviceId: nodeConfig.deviceId,
            inputIDs: nodeConfig.from || [],
            outputIDs: nodeConfig.to || [],
            quantize: Definition.quantize || "1/4",
            muted: nodeConfig.muted || false,
            bypassed: nodeConfig.bypassed || false,
            meta: nodeConfig.meta || {},
            schema: Definition.props || {},
            props: nodeConfig.props || {},
            state: Object.assign({}, Definition.state, (nodeConfig.state || {})),
            tick: Definition.tick || function(){},
            receive: Definition.receive || function(){},
            receiveTypes: Definition.receives,
            sendTypes: Definition.sends
        });

        this.nodes.set(id, node);
        node.activate();
    }

    /**
     * Should only be called internally on instantiation. Creates and
     * connects a set of serialized nodes.
     */
    _populate(nodeConfigs){
        //Build nodes
        nodeConfigs.forEach((nodeConfig) => {
            this._buildNode(nodeConfig);
        });

        //Connect nodes
        nodeConfigs.forEach((config) => {
            if (config.to){
                config.to.forEach((id) => this.nodes.get(config.id).to(this.nodes.get(id)));
            }
        });
    }

    /**
     * Add a new node to the node manager
     * 
     * @param {Object} nodeConfig
     * @param {Boolean} suppressEvent
     */
    addNode(definitionName, x ,y){
        this._buildNode({ 
            definitionName: definitionName,
            meta: {
                name: definitionName,
                x: (x - this.scene.getMeta("viewportX")) || getRandom(500, 1000),
                y: (y - this.scene.getMeta("viewportY")) || getRandom(500, 1000)
            }
        });
        this.events.emit("nodeAdded");
    }

    /**
     * Remove the node with the given id
     * @param {String} id 
     */
    removeNode(id){
        let removedNode = this.nodes.get(id);
            removedNode.deactivate();
        this.nodes.forEach((node) => node.disconnect(removedNode));
        this.nodes.delete(id);
        this.events.emit("nodeRemoved", id);
        this.events.emit("connectionRemoved");
    }

    /**
     * Removes several nodes at once. Should be used when removing more than two
     * or three nodes at a time as the events are batched into a single one.
     * 
     * @param {Array<String>} ids
     */
    removeAll(ids){
        ids.forEach((id) => this.removeNode(id));

        /* 
        console.log(ids);
        ids.forEach((id) => {
            let removedNode = this.nodes.get(id);
                removedNode.deactivate();
            this.nodes.forEach((node) => node.disconnect(removedNode));
            this.nodes.delete(id);
            this.events.emit("nodeRemoved", id ); 
            this.events.emit("connectionRemoved");
        });
        */
    }

    connectNodes(fromNodeId, toNodeId){
        let fromNode = this.nodes.get(fromNodeId);
        let toNode = this.nodes.get(toNodeId);
        //TODO: Prevent illegal node connections
        fromNode.to(toNode);
        this.events.emit("connectionAdded");
    }

    /**
     * Disconnects any connection between two nodes. Since nodes can only 
     * share a single connection (i.e. input or output), the order of the
     * parameters does not matter.
     * 
     * @param {String} firstNodeId 
     * @param {String} secondNodeId 
     */
    disconnectNodes(firstNodeId, secondNodeId){
        this.nodes.get(firstNodeId).disconnect(this.nodes.get(secondNodeId));
        this.events.emit("connectionRemoved");
    }

    getLinkableToNodes(id){
        /**
         * Check our node-in-question. Nodes w/ only a single edge have simple rules
         */
        let linkableNode = this.nodes.get(id);
        if (linkableNode instanceof Nodes.OutputDeviceNode) return [];
        if (linkableNode instanceof Nodes.InputDeviceNode) 
            return Array.from(this.nodes.values()).filter(
                (node) => node.id !== id 
                        && !(node instanceof Nodes.InputDeviceNode)
                        && !linkableNode.hasDownstream(node.id, false)
            );

        /**
         * Check the other nodes. All other types of nodes have both input and 
         * output edges and are susceptible to illegal connections such as closed loops
         */
        let linkable = [];
        this.nodes.forEach((node) => {
            /**
             * InputDeviceNode: cannot be linked FROM any node
             * OuptutDeviceNode: can be linked to by every node
             * FilterNode etc: can be linked to ONLY if it does not create a closed loop
             */
            if (node === linkableNode) return;
            if (node instanceof Nodes.InputDeviceNode) return;
            if (node.hasDownstream(id) || node.hasUpstream(id, false)) return;
            
            /**
             * If none of those rules applied, then the TO connection is legal
             */
            linkable.push(node);
        })

        return linkable;
    }

    getLinkableFromNodes(id){
        /**
         * Check our node-in-question. Nodes w/ only a single edge have simple rules
         */
        let linkableNode = this.nodes.get(id); 
        if (linkableNode instanceof Nodes.InputDeviceNode) return [];
        if (linkableNode instanceof Nodes.OutputDeviceNode)
            return Array.from(this.nodes.values()).filter(
                (node) => node.id !== id
                          && !(node instanceof Nodes.OutputDeviceNode)
                          && !linkableNode.hasUpstream(node.id, false)
            );

        /**
         * Check the other nodes. All other types of nodes have both input and 
         * output edges and are susceptible to illegal connections such as closed loops
         */
        let linkable = [];
        this.nodes.forEach((node) => {
            /**
             * InputDeviceNode: can link TO any node
             * OuptutDeviceNode: can be linked to by every node
             * FilterNode etc: can be linked to ONLY if it does not create a closed loop
             */
            if (node === linkableNode) return;
            if (node instanceof Nodes.OutputDeviceNode) return;
            if (node.hasDownstream(id, false) || node.hasUpstream(id)) return;

            /**
             * If none of those rules applied, then the TO connection is legal
             */
            linkable.push(node);
        })

        return linkable;
    }

    getNode(id){
        return this.nodes.get(id);
    }

    getNodes(){ 
        return Array.from(this.nodes.values());
    }

    /**
     * Returns a list of all node IDs
     */
    getNodeIDs(){
        return Array.from(this.nodes.keys());
    }

    /**
     * Returns an array of arrays representing connections
     * between nodes
     */
    getConnections(){
        let connections = [];
        this.nodes.forEach((fromNode) => {
            fromNode.outputs.forEach((toNode) => connections.push([fromNode.id, toNode.id]))
        })
        return connections;
    }

    toSerializable(){
        return Array.from(this.nodes.values()).map((node) => node.toSerializable());
    }

}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

export default NodeManager;