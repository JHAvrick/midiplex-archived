import { MidiplexNodeInstance } from "@/node-instance";
import { AllMessageTypes } from "@/util";

type MessageTypeFilterNodeTypeDef = {
    inputs: {
        in: MidiMessageType
    },
    outputs: {
        out: MidiMessageType,
    },
    props: {
        messageTypes: MidiMessageType[]
    },
    state: {}
}

const MessageTypeFilterNodeDef :  MidiplexNodeDefinition<MessageTypeFilterNodeTypeDef> = {
    name: 'Message Type Filter',
    key: 'MESSAGE_TYPE_FILTER_NODE',
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
        messageTypes: {
            name: 'Message Types',
            value: AllMessageTypes
        }
    },
    node({ send, receive, prop }){
        receive((message) => {
            if (prop('messageTypes').includes(message.type)) {
                send(message, 'out');
            }
        });
    }
};


class MessageTypeFilterNode extends MidiplexNodeInstance<MessageTypeFilterNodeTypeDef> {
    constructor(key: string, config: NodeConfig<MessageTypeFilterNodeTypeDef> = {}){
        super(key, MessageTypeFilterNodeDef, config);
    }
}

export { MessageTypeFilterNodeTypeDef, MessageTypeFilterNodeDef, MessageTypeFilterNode };