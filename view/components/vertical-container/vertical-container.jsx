import React, { useState, useRef } from 'react';
import './vertical-container.scss';

const VerticalContainer = (props) => {

    const [isOpen, setIsOpen] = useState(true);

    const handleHeaderClicked = (e) => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="vertical-container">
            <div onClick={handleHeaderClicked} className={"vertical-container__header " + props.className}> 
                {isOpen ? "v  " : ">  "}
                <span style={{width: 15}}></span>
                {props.title} 
            </div>
            <div style={{height: isOpen ? props.height : 0}} className="vertical-container__content">
                {props.children}
            </div>
        </div>
    )
}


export default VerticalContainer;



