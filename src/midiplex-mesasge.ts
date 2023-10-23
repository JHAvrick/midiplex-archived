import { Message } from 'webmidi';

class MidiplexMessage {
    /**
     * Trace is used to track the path of a message through the network and 
     * prevent infinite loops.
     */
    private trace: string[];

    /**
     * The original WebMidi message.
     */
    public readonly message: Message;
    
    constructor(message: Message | Uint8Array, trace: string[] = []){
        this.message = message instanceof Message ? message : new Message(message);
        this.trace = trace;
    }

    addTrace(nodeKey: string){
        this.trace.push(nodeKey);
    }

    hasTrace(nodeKey: string){
        return this.trace.includes(nodeKey);
    }

    get type(){
        return <MidiMessageType> this.message.type;
    }
}

export { MidiplexMessage };