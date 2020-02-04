class NodeMessageHistory {
    constructor(depth = 75){
        this.depth = depth;
        this.received = [];
        this.sent = [];
    }

    pushReceived(message){
        if (this.received.length === this.depth)
            this.history.pop();

        this.received.push(cloneDeep(message));
    }

    pushSent(){
        if (this.sent.length === this.depth)
            this.sent.pop();

        this.sent.push(cloneDeep(message));
    }

}

export default NodeMessageHistory;