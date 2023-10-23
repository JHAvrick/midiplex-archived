import { MidiplexNodeInstance } from "@/node-instance";
import { AllMessageTypes } from "@/util";

type MessageTypeSplitTypeDef = {
    inputs: {
        in: MidiMessageType
    },
    outputs: {
        'noteoff': 'noteoff',
        'noteon': 'noteon',
        'polykeypressure': 'polykeypressure',
        'controlchange': 'controlchange',
        'programchange': 'programchange',
        'monokeypressure': 'monokeypressure',
        'pitchbend': 'pitchbend',
        'channelaftertouch': 'channelaftertouch',
        'system': 'system'
    },
    props: {},
    state: {}
}

const MessageTypeSplitDef :  MidiplexNodeDefinition<MessageTypeSplitTypeDef> = {
    name: 'Message Type Splitter',
    key: 'MESSAGE_TYPE_SPLIT_NODE',
    description: '',
    inputs: {
        in: {
            name: 'In',
            messageTypes: AllMessageTypes
        }
    },
    outputs: {
        'noteoff': {
            name: 'Note Off',
            messageTypes: ['noteoff']
        },
        'noteon': {
            name: 'Note On',
            messageTypes: ['noteon']
        },
        'polykeypressure': {
            name: 'Poly Key Pressure',
            messageTypes: ['polykeypressure']
        },
        'controlchange': {
            name: 'Control Change',
            messageTypes: ['controlchange']
        },
        'programchange': {
            name: 'Program Change',
            messageTypes: ['programchange']
        },
        'monokeypressure': {
            name: 'Mono Key Pressure',
            messageTypes: ['monokeypressure']
        },
        'pitchbend': {
            name: 'Pitch Bend',
            messageTypes: ['pitchbend']
        },
        'channelaftertouch': {
            name: 'Channel Aftertouch',
            messageTypes: ['channelaftertouch']
        },
        'system': {
            name: 'System',
            messageTypes: ['system']
        }
    },
    node({ send, receive, prop }){
        receive((message) => {
            send(message, message.type);
        });
    }
};


class MessageTypeSplitNode extends MidiplexNodeInstance<MessageTypeSplitTypeDef> {
    constructor(key: string, config: NodeConfig = {}){
        super(key, MessageTypeSplitDef);
    }
}

export { MessageTypeSplitTypeDef, MessageTypeSplitDef, MessageTypeSplitNode };