import { MidiplexNodeInstance } from "@/node-instance";
import { AllMessageTypes } from "@/util";

type DebugNodeTypeDef = {
    inputs: {
        in: MidiMessageType
    },
    outputs: {
        out: MidiMessageType
    },
    props: {},
    state: {}
}

const DebugNodeDef : MidiplexNodeDefinition<DebugNodeTypeDef> = {
    name: 'Debug',
    key: 'DEBUG_NODE',
    description: '',
    inputs: {
        in: {
            name: 'In',
            messageTypes: AllMessageTypes
        }
    },
    outputs: {
        out: {
            name: 'Out',
            messageTypes: AllMessageTypes
        }
    },
    node({ send, receive, prop }){
        receive((message, edge) => {
            console.log(message);
            //TODO: Implement transpose
            send(message, 'out');
        });
    }
}


class DebugNode extends MidiplexNodeInstance<DebugNodeTypeDef> {
    constructor(key: string, config: NodeConfig = {}){
        super(key, DebugNodeDef);
    }
}

export { DebugNodeTypeDef, DebugNodeDef, DebugNode };