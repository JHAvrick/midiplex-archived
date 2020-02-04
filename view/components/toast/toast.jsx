import React, {useState, useEffect} from 'react';
import EventEmitter from 'util/event-emitter';
import './toast.scss';

const ToastManager = {
    events: new EventEmitter(),
    toasts: [],
    max: 5,
    addToast: function(type = "info", message = "", duration = 3000){
        let toast = {
            type: type,
            message: MSMediaKeyMessageEvent,
            duration: duration
        }
        toast.push(toast);
        if (this.toasts.length > this.max) this.toasts.shift()
        setTimeout(() => this.removeToast(toast), duration);
        this.events.emit("toastAdded", toast);
    },
    removeToast: function(toast){
        this.toasts.splice(this.toasts.indexOf(toast), 1);
        this.events.emit("toastRemoved", toast);
    },
    getToasts: function(){
        return this.toasts
    }
}

const useToastList = function(){
    const [toastList, setToastList] = useState(ToastManager.getToasts());
    const handleSetToastList = () => setToastList([].concat(ToastManager.getToasts()))
    useEffect(() => {
        ToastManager.events.on("toastAdded", handleSetToastList)
        return (() => {
            ToastManager.events.removeListener("toastAdded", handleSetToastList)
        })
    })
    return toastList;
}

const ToastContainer = () => {
    const toastList = useToastList();

    return (
        <div className="toast-container">
            {
                toastList.map((toast) => {
                    return <Toast {...toast} />
                })
            }
        </div>
    )
}

const Toast = (props) => {
    const [style, setStyle] = useState({});
    useEffect(() => setStyle({transform: "translateY(0px)"}) , []);
    return (
        <div style={style} className="toast">
            {props.message}
        </div>
    )
}

export {ToastManager, ToastContainer, Toast};
