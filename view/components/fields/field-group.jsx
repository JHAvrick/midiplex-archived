import React from 'react';
import './field.scss';

import FieldComponents from './field-components';
const FieldGroup = (props) => {

    const handleFieldChange = (data) => {
        props.onFieldChange(data);
    }

    return (
        <div className="field-group">
            {
                props.fields.map((config, index) => {
                    if (FieldComponents[config.type])
                        return React.createElement(FieldComponents[config.type], {...config, onChange: handleFieldChange, key: index })
                })
            }
        </div>
    )
}

FieldGroup.defaultProps = {
    fields: [],
    onFieldChange: function(){}
}

export default FieldGroup;
