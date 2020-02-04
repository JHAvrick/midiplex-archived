export default {
    name: "MutePathNode",
    baseNodeClass: "filter",
    receives: ["noteon", "noteoff", "controlchange"],
    sends: ["noteon", "noteoff", "controlchange"],
    props: {
        triggerType: {
            type: "select",
            label: "Trigger Type",
            value: "note",
            options: [
                { name: "Note", value: "note" },
                { name: "Control Change", value: "cc" }
            ]
        },
        trigger: {
            type: "number",
            label: "Trigger",
            min: 0,
            max: 127
        },
        muteStateOnTrigger: {
            type: "select",
            label: "When Recieved",
            value: "muted",
            options: [
                { name: "Mute", value: "muted" },
                { name: "Unmute", value: "unmuted" }
            ]
        },
    },
    state: { triggered: false },
    tick: function(){},
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let props = params.props;
        let state = params.state;

        //Ignore the noteon event for the trigger
        if (props.triggerType === "note" && message.type === "noteon" && props.trigger === message.note.number) return;
        if (props.triggerType === "note" && message.type === "noteoff" && props.trigger === message.note.number){
            state.triggered = !state.triggered;
            return;
        } else if (props.triggerType === "cc" && message.type === "controlchange" && props.trigger === message.controller.number){
            state.triggered = !state.triggered;
            return;
        }


        if (props.muteStateOnTrigger === "muted" && state.triggered) return;
        if (props.muteStateOnTrigger === "muted" && !state.triggered) {
            send(message);
            return;
        }

        if (props.muteStateOnTrigger === "unmuted" && !state.triggered) return;
        if (props.muteStateOnTrigger === "unmuted" && state.triggered){
            send(message);
            return;
        }
    }
}