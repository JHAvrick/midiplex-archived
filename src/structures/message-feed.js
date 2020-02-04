import EventEmitter from 'util/event-emitter';

class MessageFeed {
    constructor(){
        this.events = new EventEmitter();
        this.length = 50;
        this._messages = [];
    }

    addMessage(message){
        setTimeout(() => {
            if (this._messages.length > this.length) this._messages.pop();
            this._messages.push(message);
            this.events.emit("messageAdded", message);
        }, 5);
    }

    clearMessages(){
        setTimeout(() => {
            this._messages = [];
            this.events.emit("messagesCleared", message);
        }, 5)
    }

    getMessages(){
        return this._messages.reverse();
    }

}

export default MessageFeed;