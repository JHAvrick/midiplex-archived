export default {
    name: "TestNode",
    baseNodeClass: "filter",
    props: {
        number: {
            type: "number",
            value: 34
        },
        string: {
            type: "string",
            value: "G9"
        },
        boolean: {
            type: "boolean",
            value: true
        }
    },
    receive: function(params){
        let send = params.send;
        let message = params.message;
        send(message);
    }
}