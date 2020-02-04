export default {
    name: "HoldNode",
    nodeType: "filter",
    receiveClock: false,
    receives: ["noteon", "noteoff"],
    sends: ["noteon", "noteoff"],
    state: {
        lastOn: null,
        lastOff: null
    },
    receive: function(params){
        let message = params.message;
        let state = params.state;
        let send = params.send;

        if (message.type === "noteoff")
            return;

        //If the message isn't a note being played or stopped, send it through
        if (message.type != "noteon"){
            send(message);
            return;
        }
        
        //Note pressed w/ none already running
        if (message.type === "noteon" && state.lastOn === null){
            console.log("Note pressed w/ none already running")
            send(message);
            state.lastOn = params.utils.cloneDeep(message);

        //Same note pressed, signaling a mute
        } else if (message.type === "noteon" && state.lastOn.note.number === message.note.number){
            console.log("Same note pressed, signaling a mute")

            let offmessage = params.utils.cloneDeep(state.lastOn);
            offmessage.type = "noteoff";
            send(offmessage);
            state.lastOn = null;

        //Another note pressed, send both a new note and a mute
        } else {
            console.log("Another note pressed, send both a new note and a mute") 

            let offmessage = params.utils.cloneDeep(state.lastOn);
            offmessage.type = "noteoff";

            params.utils.forceOrderSend(send, [offmessage, message]);

            /* 
            send(offmessage);

            setTimeout(function(){
                send(message);
            }, 1);
            */

            state.lastOn = message;
        }
            
        
    }
}