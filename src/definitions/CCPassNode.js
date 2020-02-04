export default {
    name: "CCPassNode",
    description: ` Only allows Control Change messages through.`,
    baseNodeClass: "filter",
    recieves: ["controlchange"],
    sends: ["controlchange"],
    tick: function(){},
    receive: function(params){
        params.send(params.message);
    }
}