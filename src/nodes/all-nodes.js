import InputDeviceNode from './input-device-node';
import OutputDeviceNode from './output-device-node';
import FilterNode from './filter-node';

export default {
    //Long form for clarity
    InputDeviceNode: InputDeviceNode,
    OutputDeviceNode: OutputDeviceNode,
    FilterNode: FilterNode,

    //Shorthand also available
    input: InputDeviceNode,
    output: OutputDeviceNode,
    filter: FilterNode
}