import { MidiplexNodeInstance } from "@/node-instance";
import { MidiplexMessage } from "@/midiplex-mesasge";
import { WebMidi, MessageEvent } from "webmidi";
import { AllMessageTypes } from "@/util";
 
type InputNodeTypeDef = {
    inputs: {},
    outputs: {
        out: MidiMessageType
    },
    props: {
        inputId: string | null
    },
    state: {}
}

const InputNodeDefinition : MidiplexNodeDefinition<InputNodeTypeDef> = {
    name: 'Input',
    key: 'INPUT_NODE',
    description: 'A node that receives MIDI messages from a MIDI device. Messages are immediately sent to the node\'s output.',
    inputs: {},
    outputs: {
        out: {
            name: 'Out',
            messageTypes: AllMessageTypes
        }
    },
    props: {
        inputId: {
            name: 'Input',
            value: null
        }
    },
    node: ({ prop, send, update, receive }) => {

        let inputId = prop('inputId');

        const handleInputMessage = (event: MessageEvent) => {
            send(new MidiplexMessage(event.message, []), 'out');
        }

        const bind = () => {
            if (inputId){
                const input = WebMidi.getInputById(inputId);
                if (input){
                    input.addListener('midimessage', handleInputMessage);
                    return;
                }
                console.warn(`Input ${inputId} not found`);
            }
        }

        const unbind = () => {
            if (inputId){
                const input = WebMidi.getInputById(inputId);
                if (input){
                    input.removeListener('midimessage', handleInputMessage);
                }
            }
        }

        update(() => {
            unbind();
            inputId = prop('inputId');
            bind();
        })
    }
};

class InputNode extends MidiplexNodeInstance<InputNodeTypeDef> {
    constructor(key: string){
        super(key, InputNodeDefinition);
    }
}

export { InputNodeTypeDef, InputNodeDefinition, InputNode };