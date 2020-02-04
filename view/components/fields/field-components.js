import NumberField from './number-field.jsx';
import BooleanField from './boolean-field.jsx';
import SelectField from './select-field.jsx';
import MessageFeedField from './message-feed-field.jsx';

const FieldComponents = {
    number: NumberField,
    boolean: BooleanField,
    select: SelectField,
    MessageFeed: MessageFeedField 
    //string:
    //info:  
}

export default FieldComponents;