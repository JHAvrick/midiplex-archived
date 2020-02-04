import React, { useRef, useEffect, useState } from 'react';
import './field.scss';

const BooleanField = (props) => {
    const inputEl = useRef(null);
    const [value, setValue] = useState(props.value);

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    const handleOnChange = (e) => {
        props.onChange({
            key: props.name,
            value: inputEl.current.checked
        });
    }

    return (
        <div className="field no-drag">
            <label className="field__label"> {props.label} </label>
            <div className="field__input-wrapper no-drag">
                <input ref={inputEl} onChange={handleOnChange} className="field__checkbox no-drag" type="checkbox" checked={value} />
            </div>
        </div>
    )
}

BooleanField.defaultProps = {
    value: false
}

export default BooleanField;
