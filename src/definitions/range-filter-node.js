export default {
    name: "RangePassNode",
    baseNodeClass: "filter",
    receives: ["noteon", "noteoff"],
    sends: ["noteon", "noteoff"],
    props: {
        rangeStart: {
            label: "Range Start",
            type: "number",
            value: 0,
            min: 0,
            max: 127
        },
        rangeEnd: {
            label: "Range End",
            type: "number",
            value: 127,
            min: 0,
            max: 127
        }
    },
    receive: function(params){
        let send = params.send;
        let message = params.message;
        let props = params.props;

        if (message.note.number >= props.rangeStart && message.note.number <= props.rangeEnd){
            send(message);
        }
    }
}