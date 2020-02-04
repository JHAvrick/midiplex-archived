import React, { useEffect, useState, useRef } from 'react';
import './selector.scss';


/**
 * NOTE: This component is not controlled at the moment so when items are deleted it
 * is expected to be handled appropriately in the parent component 
 */
const Selector = (props) => {

    const [selections, setSelections] = useState([]);
    const [multiselect, setMultiselect] = useState(false);

    //Shift key activates multiselect
    const handleDocumentKeyDown = (e) => { 
        if (e.keyCode === 16) {
            setMultiselect(true);
        } else if (e.keyCode === 46 && selections.length > 0) {
            props.onSelectionDeleted(selections);
            setSelections([]);
        }   
    }

    const handleDocumentKeyUp = (e) => { 
        if (e.keyCode === 16) setMultiselect(false) 
    }

    const handleDocumentMouseDown = (e) => {
        if (e.button !== 0) return; //Only accept left clicks

        /**
         * If the mouse down event targeted a DOM element w/ the data 
         * attribute specified by props.deselectDataTarget, deselect
         * everything.
         */
        if (e.target.getAttribute(props.deselectDataTarget)){
            setSelections([]);
            props.onSelectionChange([]);
            return;
        }
        /**
         * Check if the mouse down target has our data attribute and
         * then select or multiselect
         */
        let targetId = e.target.getAttribute(props.dataTarget);
        if (targetId && !selections.includes(targetId)){
            if (multiselect) {
                let newSelections = [targetId].concat(selections);
                setSelections(newSelections);
                props.onSelectionChange(newSelections);
            } else {
                setSelections([targetId]);
                props.onSelectionChange([targetId]);
            }
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleDocumentKeyDown);
        document.addEventListener("keyup", handleDocumentKeyUp);
        document.addEventListener("mousedown", handleDocumentMouseDown);
        return (() => {
            document.removeEventListener("keydown", handleDocumentKeyDown);
            document.removeEventListener("keyup", handleDocumentKeyUp);
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        })
    })

    return (
        <div className="selector"></div>
    )
}

Selector.defaultProps = {
    onSelectionChange: function(){},
    onSelectionDeleted: function(){}
}

export default Selector;
