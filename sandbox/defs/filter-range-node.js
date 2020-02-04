/**
 * This node filters `noteon` and `noteoff` messages, only allowing 
 */
export default {
    name: "RangePassNode",
    nodeType: "filter",
    props: {
        rangeLow: {
            type: "string",
            value: "C0"
        },
        rangeHigh: {
            type: "string",
            value: "G9"
        }
    },
    receive: function(params){
        let send = params.send;
        let message = params.message;

        /**
         * The message is not a note event, so pass it through
         */
        if (message.type !== "noteon" && message.type !== "noteoff"){
            send(message);
            return;
        } 

        //TO DO: 
            


    }
}