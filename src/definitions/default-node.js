export default {
    name: "DefaultNode",
    baseNodeClass: "FilterNode",
    props: {},
    state: {},
    tick: function(){},
    receive: function(params){
        let send = params.send;
        let message = params.message;
        send(message);
    }
}