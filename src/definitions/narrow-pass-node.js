export default {
    name: "NarrowPassNode",
    baseNodeClass: "filter",
    props: {
        type: {
            type: "select",
            label: "Type",
            value: "none",
            options: [
                { name: "none", value: "none" },
                { name: "noteon", value: "noteon" },
                { name: "noteoff", value: "noteoff" },
                { name: "controlchange", value: "controlchange" }
            ]
        },
        value: {
            type: "number", 
            label: "Value",
            value: 0,
            min: 0,
            max: 127
        }
    },
    tick: function(){},
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let props = params.props;
        let state = params.state;

        if (message.type === props.type){

            if (message.type === "controlchange" && message.controller.number === props.value){
                send(message);
                return;
            }
            
            if (message.type === "noteon" || message.type === "noteoff" && message.note.number === props.value){
                send(message);
                return;
            }

            //TODO: Add other stuff

        }
    }
}