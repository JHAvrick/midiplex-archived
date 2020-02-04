export default {
    name: "PointlessNode",
    nodeType: "filter",
    receiveClock: true,
    props: {
        test: "I'm just a test prop!"
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