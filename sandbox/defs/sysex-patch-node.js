export default {
    name: "SysexPatchNode",
    nodeType: "filter",
    receiveClock: true,
    props: {
        patches: {
            type: "SysexStore"
        }
    },
    state: {
        timeDivision: "1/4"
        //Put stuff here that you don't want to be set in the config
    },
    clock: function(beat, timestamp, send){

    },
    receive: function(message, props, send){
        //Do stuff with message
        send(message);
    }
}