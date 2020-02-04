export default {
    name: "TransposeNode",
    nodeType: "filter",
    props: {
        transpose: 0
    },
    receive: function(params){
        let message = params.message;
        let send = params.send;

        message.note.number = message.note.number + props.transpose;
        send(message);
    }
}