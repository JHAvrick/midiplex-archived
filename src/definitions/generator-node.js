export default {
    name: "GeneratorNode",
    baseNodeClass: "FilterNode",
    props: {},
    state: {},
    tick: function(params){
        params.send({
            type: "noteon",
            note: {
                name: "C",
                octave: "3",
                number: 48
            }
        })
    },
    receive: function(params){}
}