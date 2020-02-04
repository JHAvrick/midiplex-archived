import React, { useRef, useEffect, useState } from 'react';
import './field.scss';
import './number-field.scss';

const NumberField = (props) => {
    const inputEl = useRef(null);
    const [value, setValue] = useState(props.value);

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    const handleOnChange = (e) => {
        props.onChange({
            key: props.name,
            value: parseInt(inputEl.current.value)
        });
    }

    return (
        <div className="field no-drag">
            <label className="field__label"> {props.label} </label>
            <div className="field__input-wrapper no-drag">
                <input ref={inputEl} onChange={handleOnChange} className="field__number-input no-drag" type="number" min={props.min} max={props.max} value={value} />
            </div>
        </div>
    )
}

NumberField.defaultProps = {
    name: "Number",
    min: 0,
    max: Infinity,
    onChange: function(){}
}

export default NumberField;
