export default {
    name: "CausesErrorNode",
    description: `This node intentionally causes an error. (for debugging purposes)`,
    baseNodeClass: "filter",
    tick: function(){},
    receive: function(params){
        //Neither of these are defined
        cause(error);
    }
}