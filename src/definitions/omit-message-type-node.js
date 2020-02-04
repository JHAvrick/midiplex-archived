export default {
    name: "OmitMessageTypeNode",
    baseNodeClass: "filter",
    props: {
        filter: {
            type: "select",
            label: "Filter Out",
            value: "none",
            options: [
                { name: "none", value: "none" },
                { name: "noteon", value: "noteon" },
                { name: "noteoff", value: "noteoff" },
                { name: "controlchange", value: "controlchange" }
            ]
        }
    },
    tick: function(){},
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let props = params.props;
        let state = params.state;

        if (params.message.type === props.filter) return;

        send(message);
    }
}