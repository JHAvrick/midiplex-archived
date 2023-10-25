import { AllMessageTypes } from "@/util";
import { MidiplexNodeInstance } from "@/node-instance";

type TogglePathTypeDef = {
    inputs: {
        in: MidiMessageType
    },
    outputs: {
        out: MidiMessageType,
    },
    props: {
        cc: IntRange<0, 128>,
        openValue: IntRange<0, 128>,
        closedValue: IntRange<0, 128>,
        toggleOnAnyValue: boolean,
        allowNoteOff: boolean,
        open: boolean
    },
    state: {}
}

const TogglePathDef :  MidiplexNodeDefinition<TogglePathTypeDef> = {
    name: 'CC Toggle Path',
    key: 'TOGGLE_PATH_NODE',
    description: 'Toggles the output path open or closed via the given CC channel and value. The given CC value is always filtered out.',
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
        cc: {
            name: 'CC Trigger',
            value: 0
        },
        /**
         * The CC value which will cause the path to open. If this value is the same as the
         * `closedValue`, the path will toggle open and closed on the same value.
         */
        openValue: {
            name: 'Open Value',
            value: 127
        },
        /**
         * The CC value which will cause the path to close.
         */
        closedValue: {
            name: 'Closed Value',
            value: 0
        },
        /**
         * This property can be used to manually open or close the path.
         */
        open: {
            name: 'Open',
            value: true
        },
        /**
         * When `true` the openValue and closedValue will be ignored and the path will toggle open/closed
         * on ANY value received on the given CC channel.
         */
        toggleOnAnyValue: {
            name: 'Toggle On Any Value',
            value: false
        },
        /**
         * When `true`, allows `noteoff` commands to pass through regardless of whether the
         * path is open or not. This prevents stuck notes when the path is closed.
         */
        allowNoteOff: {
            name: 'Allow Note Off',
            value: true
        }
    },
    node({ send, receive, update, prop }){
 
        let isOpen = prop('open');
        update(() => {
            isOpen = prop('open');
        });

        receive((message) => {
            let data = message.data;
            if (message.type === 'controlchange' && data[1] === prop('cc')) {
                if (prop('toggleOnAnyValue')){
                    isOpen = !isOpen;
                } else if (prop('closedValue') === prop('openValue') && data[2] === prop('openValue')){
                    isOpen = !isOpen;
                    return;
                } else if (data[2] === prop('closedValue')){
                    isOpen = false;
                    return;
                } else if (data[2] === prop('openValue')){
                    isOpen = true;
                    return;
                }
            }

            if (isOpen || (prop('allowNoteOff') && message.type === 'noteoff')){
                send(message, 'out');
            }
        });
    }
};


class TogglePathNode extends MidiplexNodeInstance<TogglePathTypeDef> {
    constructor(key: string, config: NodeConfig<TogglePathTypeDef> = {}){
        super(key, TogglePathDef, config);
    }
}

export { TogglePathTypeDef, TogglePathDef, TogglePathNode };