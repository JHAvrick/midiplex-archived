export default {
    name: "NotePassNode",
    description: ` Only allows "noteon" and "noteoff" messages through.`,
    baseNodeClass: "filter",
    receives: ["noteon", "noteoff"],
    sends: ["noteon", "noteoff"],
    tick: function(){},
    receive: function(params){
        params.send(params.message);
    }
}