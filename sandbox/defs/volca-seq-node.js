export default {
    name: "VolcaSeqNode",
    nodeType: "filter",
    receiveClock: true,
    quantize: "1/8",
    props: {
        sequenceLength: 8,
        tracks: {
            "1": [1, 0, 0, 0, 1, 0, 0, 0],
            "2": [0, 0, 1, 0, 0, 0, 1, 0],
            "4": [1, 1, 1, 1, 1, 1, 1, 1],
            "10":[0, 1, 1, 0, 1, 1, 0, 1],
        }
    },
    state: {
        lastMessage: null,
        seqIndex: 0
    },
    tick: function(params){
        let state = params.state;
        let props = params.props;
        let send = params.send;

        if (params.state.lastMessage == null)
            return;

        for (let i = 1; i < 16; i++){
            if (props.tracks[i] && props.tracks[i][state.seqIndex] === 1){
                
                let newMessage = params.utils.cloneDeep(params.state.lastMessage);
                newMessage.channel = i;

                send(newMessage)
            }
        }

        state.seqIndex = state.seqIndex >= props.sequenceLength - 1 ? 0 : state.seqIndex + 1;
    },
    receive: function(params){
        if (params.state.lastMessage == null)
            params.state.lastMessage = params.message;
    }
}