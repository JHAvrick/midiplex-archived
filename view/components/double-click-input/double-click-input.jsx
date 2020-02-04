import React, {useState, useEffect, useRef} from 'react';
import './double-click-input.scss';

const DoubleClickInput = (props) => {
    const [readonly, setReadonly] = useState(true);
    const inputEl = useRef(null);

    //--------------------------------- Name Input --------------------------------- 
    const handleInputChange = () => props.onChange(inputEl.current.value);
    const handleInputBlur = () => setReadonly(true);
    const handleInputKeyDown = (e) => {
        if ([13, 27, 9].includes(e.keyCode)){
            setReadonly(true);
        }
    }

    const handleDoubleClicked = () => { 
        setReadonly(false); 
        inputEl.current.setSelectionRange(0, inputEl.current.value.length)
    }
    //------------------------------------------------------------------------------- 

    return (
        <input  ref={inputEl} 
                className="double-click-input"
                readOnly={readonly}
                value={props.value}
                onChange={handleInputChange}
                onDoubleClick={handleDoubleClicked}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                style={{
                    color: readonly ? "#D6D6D6" : "lime",
                    userSelect: readonly ? "none" : "initial",
                }}/>
    )
}

export default DoubleClickInput;
