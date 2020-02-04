import EventEmitter from 'util/event-emitter';

const FlowchartState = {
    firstRender: true,
    gridRect: {
        x: 0,
        y: 0
    },
    nodeHandles: {},
    connectionStartHandle: {},
    connectionEndHandle: {},
    setGridRect(rect){
        this.gridRect = rect;
        this.events.emit("gridChange", this.gridRect);
    },

    setDummyHandles(nodes){
        if (this.firstRender){
            nodes.forEach((node) => {
                this.nodeHandles[node.id] = {
                    in: {
                        x: 0,
                        y: 0,
                    },
                    out: {
                        x: 0,
                        y: 0
                    }
                }
            })
            this.firstRender = false;
        }
    },

    setConnectionStart(data){
        this.connectionStart = data;
        this.events.emit("connectionStart", data);
    },

    removeHandle: function(id){
        delete this.nodeHandles[id];
        //this.events.emit("handleChange", this.nodeHandles);
        //this.events.emit("gridChange", this.gridRect);
    },

    setHandle: function(id, handle){
        this.nodeHandles[id] = handle;
        this.events.emit("handleChange", this.nodeHandles);
    },

    getHandle: function(id){
        if (this.nodeHandles[id] === undefined)
            return {in: { x: 0, y: 0, }, out: { x: 0, y: 0}}

        return this.nodeHandles[id];
    },
    events: new EventEmitter()
}

export default FlowchartState;