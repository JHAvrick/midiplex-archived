export default {
    name: "MapCCNode",
    baseNodeClass: "filter",
    props: {
        from: {
            label: "From",
            type: "number",
            value: 0,
            min: 0,
            max: 127
        },
        to: {
            label: "To",
            type: "number",
            value: 0,
            min: 0,
            max: 127
        }
    },
    state: { triggered: false },
    tick: function(){},
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let props = params.props;
        let state = params.state;

        if (message.type !== "controlchange"){
            send(message);
            return;
        }

        if (message.controller.number !== props.from){
            send(message);
            return;
        }

        message.controller.number = props.to;
        send(message);
    }
}