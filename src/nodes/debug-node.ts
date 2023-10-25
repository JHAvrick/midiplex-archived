import { MidiplexMessage } from "@/midiplex-message";
import { MidiplexNodeInstance } from "@/node-instance";
import { AllMessageTypes } from "@/util";

type DebugNodeTypeDef = {
    inputs: {
        in: MidiMessageType
    },
    outputs: {
        out: MidiMessageType
    },
    props: {
        logToConsole: boolean,
        callback: (message: MidiplexMessage) => void
    },
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
    props: {
        logToConsole: {
            name: 'Log to console',
            value: false
        },
        callback: {
            name: 'Callback',
            value: () => {}
        }
    },
    node({ send, receive, prop }){
        receive((message, edge) => {
            if (prop('logToConsole')) {
                console.log(message);
            }
            prop('callback')(message);
            send(message, 'out');
        });
    }
}


class DebugNode extends MidiplexNodeInstance<DebugNodeTypeDef> {
    constructor(key: string, config: NodeConfig<DebugNodeTypeDef> = {}){
        super(key, DebugNodeDef, config);
    }
}

export { DebugNodeTypeDef, DebugNodeDef, DebugNode };