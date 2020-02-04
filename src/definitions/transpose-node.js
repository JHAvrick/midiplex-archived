export default {
    name: "TransposeNode",
    baseNodeClass: "filter",
    props: {
        transpose: {
            type: "number",
            label: "Transpose",
            value: 0,
            min: -48,
            max: 48
        }
    },
    tick: function(){},
    receive: function(params){
        let message = params.message;
        let send = params.send;
        let props = params.props;

        console.log(message.note.number);
        console.log(props.transpose);

        console.log(message.note.number);
        message.note.number = message.note.number + props.transpose;
        console.log(message.note.number);

        send(message);
    }
}