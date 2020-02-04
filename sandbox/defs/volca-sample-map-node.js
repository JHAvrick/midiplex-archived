export default {
    name: "VolcaSampleMapNode",
    nodeType: "filter",
    receiveClock: false,
    state: {
        channels: {
            "48": 1,
            "49": 2,
            "50": 3,
            "44": 4,
            "45": 5,
            "47": 6
        }
    },
    receive: function(params){
        let message = params.message;
        let state = params.state;
        let send = params.send;

        if (message.type !== "noteon")
            return;

        let ccNumber = message.note.number;
        if (state.channels[ccNumber] != undefined)
            send({
                type: "noteon",
                channel: state.channels[ccNumber],
                note: {
                    name: "G",
                    number: 67,
                    octave: 4
                }
            })

        //console.log("")
        console.log(state.channels[ccNumber]);

    }
}