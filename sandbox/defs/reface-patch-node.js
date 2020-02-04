export default {
    name: "RefacePatchNode",
    nodeType: "filter",
    receiveClock: false,
    //props: {
    //    patchStore: "TestStore"
    //},
    state: {
        storeFetched: false,
        patches: {},
        captureNote: null,
        sysexReceivedIndex: 0,
        sysexAccumulator: []
    },
    clock: function(params){},
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let state = params.state;

        if (message.target.name === "reface CS" && message.type !== "sysex")
            return;

        if (message.target.name === "reface CS" && message.type === "sysex"){
            
            state.sysexAccumulator = state.sysexAccumulator.concat(Array.from(message.data));
            if (state.sysexReceivedIndex === 2){
                console.log("Patch received...");
                //Store the patch
                state.patches[state.captureNote] = params.utils.cloneDeep(state.sysexAccumulator);
                state.sysexAccumulator = [];
                state.sysexReceivedIndex = 0;
            } else {
                state.sysexReceivedIndex = state.sysexReceivedIndex + 1;
            }

        } else if (message.type === "controlchange") {
            if (message.controller.number === 64){
                console.log("Sustaiun!");
                send(message);
                return;
            }

            console.log(message.controller.number);
            if (state.patches[message.controller.number]){
                console.log("Restore Patch at Position: " + message.controller.number);
                send({
                    type: "raw",
                    data: state.patches[message.controller.number]
                });
            } else {
                console.log("Capture Patch at Position: " + message.controller.number);
                state.captureNote = message.controller.number;
                send({
                    type: "raw",
                    data: [0xF0, 0x43, 0x20, 0x7F, 0x1C, 0x03, 0x0E, 0x0F, 0x00, 0xF7]
                })
            }
        } else {

            send(message);

        }

       // send(message);

    }
}
