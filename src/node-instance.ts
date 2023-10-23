import { MidiplexMessage } from "./midiplex-mesasge";

class MidiplexNodeInstance <D extends MidiplexNodeTypeDescription> {
    
    public readonly key: string;
    public readonly definition: MidiplexNodeDefinition<D>;
    private thruMode: 'filter' | 'thru' = 'filter';
    protected props: Map<keyof D['props'], any> = new Map<keyof D['props'], any>();
    protected state: Map<keyof D['state'], any> = new Map<keyof D['state'], any>();
    protected inputs: Map<keyof D['inputs'], MidiplexEdgeInstance<D>> = new Map<keyof D['inputs'], MidiplexEdgeInstance<D>>();
    private outputs: Map<keyof D['outputs'], MidiplexEdgeInstance<D>> = new Map<keyof D['outputs'], MidiplexEdgeInstance<D>>();
    private receiveHandler: null | ((message: MidiplexMessage, edgeKey: keyof D['inputs']) => void) = null;
    private updateHandler: null | (() => void) = null;

    constructor(key: string, node: MidiplexNodeDefinition<D>, config: NodeConfig = {}){
        this.key = key;
        this.definition = node;

        for (let key in node.props) {
            let k = key as keyof D['props'];
            this.props.set(k, config.props?.[key] ?? node.props[k].value);
        }

        for (let key in node.state){
            let k = key as keyof D['state'];
            this.state.set(k, node.state[k].value);
        }

        for (let key in node.inputs) {
            this.inputs.set(key as keyof D['inputs'], {
                key: key,
                messageTypes: node.inputs[key].messageTypes,
                node: this,
                to: []
            });
        }

        for (let key in node.outputs) {
            this.outputs.set(key as keyof D['outputs'], {
                key: key,
                messageTypes: node.outputs[key].messageTypes,
                node: this,
                to: []
            });
        }

        this.getProp = this.getProp.bind(this);
        this.setProp = this.setProp.bind(this);
        this.getState = this.getState.bind(this);
        this.getOrSetStateInternal = this.getOrSetStateInternal.bind(this);
        this.definition.node?.({
            key: this.key,
            prop: this.getProp.bind(this),
            state: this.getOrSetStateInternal.bind(this),
            send: this.send.bind(this),
            receive: this.bindReceive.bind(this),
            update: this.bindUpdate.bind(this),
        })
    }

    setThruMode(mode: 'filter' | 'thru'){
        this.thruMode = mode;
    }

    protected bindReceive(handler: (message: MidiplexMessage, edgeKey: keyof D['inputs']) => void){
        if (!this.receiveHandler){
            this.receiveHandler = handler;
            return;
        }
        throw new Error(`Receive handler already bound to node ${this.key}.`);
    }

    protected bindUpdate(handler: () => void){
        if (!this.updateHandler){
            this.updateHandler = handler;
            return;
        }
        throw new Error(`Update handler already bound to node ${this.key}.`);
    }

    getState<T extends keyof D['state']>(stateKey: T) : D['state'][T]{
        return this.state.get(stateKey);
    }

    protected getOrSetStateInternal<T extends keyof D['state']>(stateKey: T, value?: D['state'][T]) : D['state'][T]{
        if(value !== undefined){
            this.state.set(stateKey, value);
        }
        return this.state.get(stateKey);
    }

    getProp<T extends keyof D['props']>(propKey: T) : D['props'][T] {
        return this.props.get(propKey);
    }

    setProp<T extends keyof D['props']>(propKey: T, value: D['props'][T]) : D['props'][T] {
        this.props.set(propKey, value);
        this.updateHandler?.();
        return value;
    }

    // getState(key: keyof D['state']) : D['state'][keyof D['state']] {
    //     return this.state.get(key);
    // }

    /**
     * Returns the first edge instance. This is used when no edge is specified.
     * 
     * @returns The first defined edge instance
     */
    protected getDefaultEdge() : MidiplexEdgeInstance<D> | undefined {
        return this.inputs.values().next().value;
    }

    getInputEdge(edgeKey: keyof D['inputs']) : MidiplexEdgeInstance<D> {
        let edge = this.inputs.get(<keyof D['inputs']> edgeKey);
        if (edge){
            return edge;
        }
        throw new Error(`Input edge ${<string> edgeKey} does not exist.`);
    }

    connect<T extends keyof D['outputs']>(edgeKey: T, to: MidiplexEdgeInstance<any>){
        let edge = this.outputs.get(edgeKey);
        if (edge){
            if (edge.to.includes(to)){
                throw Error(`Output edge ${edge} is already connected to ${to}.`);
            }
            edge.to.push(to);
            return;
        }
        throw Error(`Output edge ${edge} does not exist.`);
    }

    /**
     * Disconnects an edge from this node. If the connection does not exist, returns false, 
     * otherwise returns true.
     */
    disconnect<T extends keyof D['inputs']>(edgeKey: T, to: MidiplexEdgeInstance<D>){
        let edge = this.outputs.get(edgeKey);
        if (edge){
            edge.to = edge.to.filter((edge) => edge !== to);
            return true;
        }
        return false;
    }

    private send<K extends keyof D['outputs']>(message: MidiplexMessage, edgeKey: K){
        let edge = edgeKey ? this.outputs.get(edgeKey) : this.getDefaultEdge();
        if (edge){
            if (edge.messageTypes.includes(message.type)){
                edge.to.forEach((receivingEdge) => {
                    receivingEdge.node.receive(message, receivingEdge.key);
                });
                return;
            }
            throw Error(`Message type "${message.type}" is not supported by edge ${<string> edgeKey} for node type ${this.definition.key}.`);
        }
        throw Error(`Output edge "${edge}" does not exist.`);
    }

    receive(message: MidiplexMessage, edge: string){
        let edgeInstance = this.inputs.get(edge);
        if (edgeInstance){
            if (!edgeInstance.messageTypes.includes(message.type)){
                if (this.thruMode === 'thru'){
                    this.outputs.forEach((edge) => {
                        edge.to.forEach((receivingEdge) => {
                            receivingEdge.node.receive(message, receivingEdge.key);
                        });
                    });
                }
                return;
            }
            this.receiveHandler?.(message, edge);
        }
    }
}

export { MidiplexNodeInstance };