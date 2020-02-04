export default {
    name: "DynamicMapNode",
    description: `
        Dynamically map two Control Change values to each other.
        Send the "record" trigger message to begin mapping. The first
        CC message received after the "record" trigger will be mapped
        to all following CC messages until the "record" trigger is
        received again.

        Ignores all messages that are not Control Change.
    `,
    baseNodeClass: "filter",
    receives: ["controlchange"],
    sends: ["controlchange"],
    props: {
        trigger: {
            label: "Record Trigger",
            type: "number",
            value: 0,
            min: 0,
            max: 127
        },
        invert: {
            label: "Invert CC Values",
            type: "boolean",
            value: false
        }
    },
    state: { 
        recording: false,
        mapOne: null,
        mapTwo: []
    },
    tick: function(){},
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let props = params.props;
        let state = params.state;

        /**
         * Catch our recording state trigger
         */
        if (message.controller.number === props.trigger) {
            //End Recording
            if (state.recording){
                console.log("End Recording");
                state.recording = false;
                return;
            }

            //Start Recording
            console.log("Start Recording");
            state.recording = true;
            state.mapOne = null;
            state.mapTwo = [];
            return;
        }

        /**
         * Catch our from/to map values
         */
        if (state.recording){
            //Initial controller may be sent several times, ingore any repeats
            if (state.mapOne === message.controller.number) return;
            if (state.mapOne === null){
                state.mapOne = message.controller.number;
                console.log("First Map: ", state.mapOne);
                return;
            }

            //We only get here if we are recording AND mapOne has already been set
            //Ignore repeats of already recorded destination mappings
            if (state.mapTwo.includes(message.controller.number)) return;

            //If we are here, then a unique destination mapping has been received
            console.log("Adding Map Destination: ", message.controller.number);
            state.mapTwo.push(message.controller.number);
            return;
        }

        /**
         * We can only get here when state.recording is FALSE
         * Send to all destinations ONLY if the received controller was our mapOne controller
         */
        if (message.controller.number === state.mapOne){
            for (let i = 0; i < state.mapTwo.length; i++){
                send({
                    type: "controlchange",
                    channel: message.channel,
                    value: props.invert ? (127 - message.value) : message.value, //Grab mapOne's message value
                    controller: {
                        number: state.mapTwo[i], //Grab mapTwo's controller number
                    }
                })
            }
        }

    }
}