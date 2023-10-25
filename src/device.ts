import { WebMidi, MessageEvent } from 'webmidi';
import { Midiplex } from './index';
import { MidiplexMessage } from "./midiplex-message";
import { InputNode } from './nodes/input-node';

class MidiplexDevice {
    private readonly mp: Midiplex;
    private readonly key: string;
    private inputId: string;
    private outputId: string;
    private callbacks: Set<Function> = new Set();
    private routeMap: Map<string, InputNode> = new Map();
    constructor(mp: Midiplex, key: string, inputId: string, outputId: string){
        this.mp = mp;
        this.key = key;
        this.inputId = inputId;
        this.outputId = outputId;
        this.handleInputMessage = this.handleInputMessage.bind(this);
    }

    private handleInputMessage(event: MessageEvent){
        let midiplexMessage = new MidiplexMessage(event.message, []);
        this.callbacks.forEach(callback => {
            callback(midiplexMessage);
        });
    }

    private unbind(){
        const input = WebMidi.getInputById(this.inputId);
        if (input){
            input.removeListener('midimessage', this.handleInputMessage);
        }
    }

    private bind(){
        const newInput = WebMidi.getInputById(this.inputId);
        if (newInput){
            newInput.addListener('midimessage', this.handleInputMessage);
        }
    }

    setInputId(id: string){
        this.unbind();
        this.inputId = id;
        this.bind();
    }

    setOutputId(id: string){
        this.outputId = id;
    }

    route(inputNodeKey: string){
        let node = this.mp.getNode(inputNodeKey);
        if (node && node instanceof InputNode){
            this.routeMap.set(inputNodeKey, node);
        }
        throw new Error(`Node "${inputNodeKey}" not found or is not an InputNode`);
    }

    unroute(inputNodeKey: string){
        this.routeMap.delete(inputNodeKey);
    }

    send(message: MidiplexMessage){
        //TODO: send message to webmidi output
    }
}

export { MidiplexDevice };