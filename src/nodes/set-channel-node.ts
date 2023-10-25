import { MidiplexNodeInstance } from "@/node-instance";
import { AllMessageTypes } from "@/util";

type SetChannelNodeTypeDef = {
    inputs: {
        in: MidiMessageType
    },
    outputs: {
        out: MidiMessageType,
        //thru: 'polykeypressure' | 'controlchange' | 'programchange' | 'monokeypressure' | 'pitchbend' | 'channelaftertouch' | 'system'
    },
    props: {
        channel: number
    },
    state: {}
}

const SetChannelNodeDef :  MidiplexNodeDefinition<SetChannelNodeTypeDef> = {
    name: 'Set Channel',
    key: 'SET_CHANNEL_NODE',
    description: 'Set a specific channel for all messages passing through this node. Non-channel messages are passed through unmodified.',
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
        channel: {
            name: 'Channel',
            value: AllMessageTypes
        }
    },
    node({ send, receive, prop }){
        receive((message) => {
            message.setChannel(prop('channel'));
            send(message, 'out');
        });
    }
};


class SetChannelNode extends MidiplexNodeInstance<SetChannelNodeTypeDef> {
    constructor(key: string, config: NodeConfig<SetChannelNodeTypeDef> = {}){
        super(key, SetChannelNodeDef, config);
    }
}

export { SetChannelNodeTypeDef, SetChannelNodeDef, SetChannelNode };