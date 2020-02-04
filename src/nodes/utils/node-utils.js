import clone from 'lodash.clone';
import cloneDeep from 'lodash.clonedeep';
import forceOrderSend from './force-order-send';

/**
 * This object is a collection of utils which are exposed to
 * each Node's definition binding.
 */
export default {
    clone: clone,
    cloneDeep: cloneDeep,
    forceOrderSend: forceOrderSend
}
