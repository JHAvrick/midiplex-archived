export default {
    name: "PointlessNode",
    nodeType: "filter",
    props: {
        test: "I'm just a test prop!"
    },
    state: {
        //Put stuff here that you don't want to be set in the config
    },
    tick: function(params){

    },
    receive: function(params){
        //Do stuff with message
        params.send(params.message);
    }
}