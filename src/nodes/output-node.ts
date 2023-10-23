import { MidiplexNodeInstance } from "@/node-instance";
import { AllMessageTypes } from "@/util";
import { WebMidi, Output } from "webmidi";

type OutputNodeTypeDef = {
    inputs: {
        in: MidiMessageType
    },
    outputs: {},
    props: {
        outputId: string | null
    },
    state: {}
}

const OutputNodeDefinition : MidiplexNodeDefinition<OutputNodeTypeDef> = {
    name: 'Input',
    key: 'INPUT_NODE',
    description: 'A node that receives MIDI messages from a MIDI device. Messages are immediately sent to the node\'s output.',
    inputs: {
        in: {
            name: 'Out',
            messageTypes: AllMessageTypes
        }
    },
    outputs: {},
    props: {
        outputId: {
            name: 'Output',
            value: null
        }
    },
    node: ({ prop, send, update, receive }) => {
        let outputId = prop('outputId');
        let output : Output | undefined;
        if (outputId){
            output = WebMidi.getOutputById(outputId);
            if (!output){
                console.warn(`Output ${outputId} not found`);
            }
        }

        receive((message, edge) => {
            //TODO: Check implementation
            if (output){
                console.log(message.message.data);
                output.send(message.message.data);
            }
        });
        
        update(() => {
            outputId = prop('outputId');
            if (outputId){
                output = WebMidi.getOutputById(outputId);
                if (!output){
                    console.warn(`Output ${outputId} not found`);
                }
            }
        })
    }
};

class OutputNode extends MidiplexNodeInstance<OutputNodeTypeDef> {
    constructor(key: string){
        super(key, OutputNodeDefinition);
    }
}

export { OutputNodeTypeDef, OutputNodeDefinition, OutputNode };