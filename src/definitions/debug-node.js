export default {
    name: "DebugNode",
    baseNodeClass: "FilterNode",
    props: {
        feed: {
            type: "MessageFeed"
        }
    },
    state: {},
    tick: function(){},
    receive: function(params){
        params.send(params.message);
        params.props.feed.addMessage(params.utils.cloneDeep(params.message));
    }
}