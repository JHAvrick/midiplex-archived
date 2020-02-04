import React, { useRef, useEffect, useState } from 'react';
import './select-field.scss';

const SelectField = (props) => {
    const inputEl = useRef(null);
    const [value, setValue] = useState(props.value);

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    const handleOnChange = (e) => {
        props.onChange({
            key: props.name,
            value: inputEl.current.value
        });
    }

    return (
        <div className="field no-drag">
            <label className="field__label"> {props.label} </label>
            <div className="field__input-wrapper" style={{ paddingLeft: 10 }}>
                <select ref={inputEl} onChange={handleOnChange} value={value} className="field__select no-drag">
                    {props.options.map((option) => <option key={option.name + option.value} value={option.value}> {option.name} </option>)}
                </select>
            </div>
        </div>
    )
}

SelectField.defaultProps = {
    options: [{ name: "None", value: null }]
}

export default SelectField;
