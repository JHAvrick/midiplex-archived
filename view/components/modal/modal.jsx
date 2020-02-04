import React, {useState} from 'react';
import Draggable from 'react-draggable';
import './modal.scss';

const Modal = (props) => {
    return (
        <div style={{display: "flex", position: "absolute", width: "100%", height: "100%"}}>
            <Draggable positionOffset={{ x: "50%", y: "50%" }} handle=".modal__header" bound="parent" cancel=".no-drag">
                
                    <div className="modal" style={{ display: closed ? "none" : "initial", width: props.width, height: props.height }}>
                        <div className="modal__header"> 
                            {props.name} 
                            <div className="modal__close" onClick={props.onClose}>X</div>
                        </div>
                        {props.children}
                    </div>
            </Draggable>
        </div>
    )
}

const ModalManager = (props) => {
    
}

Modal.defaultProps = {
    width: 300,
    height: 300,
    onClose: function(){}
}

export default Modal;
