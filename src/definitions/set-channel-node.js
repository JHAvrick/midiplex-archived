export default {
    name: "SetChannelNode",
    baseNodeClass: "filter",
    props: {
        channel: {
            label: "Set Channel",
            type: "number",
            value: 1,
            min: 1,
            max: 16
        }
    },
    receive: function(params){
        let send = params.send;
        let message = params.message;
        let props = params.props;

        send(Object.assign({}, message, { channel: props.channel }));
    }
}