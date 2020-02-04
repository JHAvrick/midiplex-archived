import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import './message-feed-field.scss';


const MessageFeedField = (props) => {
    const messages = useMessages(props.value);
    return (
        <div className="message-feed">
            <div className="message-feed__header">
                <div className="message-feed__col1"> Type </div>
                <div className="message-feed__col2"> Midi </div>
                <div className="message-feed__col2"> Content </div>
            </div>
            <ul className="message-feed__list">
                    {
                        messages.map((message, index) => 
                            {   
                                let content = getContent(message);
                                return (
                                    <li key={index} className="message-feed__item">
                                        <div className="message-feed__col1">
                                            {message.type}
                                        </div>
                                        <div className="message-feed__col2">
                                            { content.midi }
                                        </div>
                                        <div className="message-feed__col3">
                                            { content.value }
                                        </div>
                                    </li>
                                )
                            }
                        )
                    }
            </ul>
        </div>
    )
}

function getContent(message){
    switch (message.type){
        case "noteon":
        case "noteoff":
            return { midi: message.note.number, value: message.note.name.concat(message.note.octave) }
        case "controlchange":
            return { midi: message.controller.number, value: message.value }
        case "sysex":
            return { midi: "---", value: "---" }
    }

    console.log("Unprocesseced Debug Message: ", message);
    return { midi: "???", value: "???" }
}

function useMessages(MessageFeed){
    const [messages, setMessages] = useState(MessageFeed.getMessages());

    const handleMessageAdded = () => setMessages([].concat(MessageFeed.getMessages()));
    useEffect(() => {
        MessageFeed.events.on("messageAdded", handleMessageAdded);
        return (() => MessageFeed.events.removeListener("messageAdded", handleMessageAdded))
    })

    return messages;
}

export default MessageFeedField;
