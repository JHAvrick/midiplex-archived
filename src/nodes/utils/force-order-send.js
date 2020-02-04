/**
 * This function forces messages to arrive in order, but
 * potentially at the cost of added latency. Race condition
 * bugs in Chromium on MacOS and Linux may require this.
 * 
 * Note that each added message will add more latency, so
 * its recommended to limit the messages to two or three.
 * 
  * @param {Function} sendFc - The original send() function 
  * @param {Array} messages - An array of messages to be sent in order
  */
function forceOrderSend(sendFc, messages, callback = function(){}){
    for (let i = 0; i < messages.length; i++){
        setTimeout(function(){
            sendFc(messages[i]);

            if (i = messages.length)
                callback();

        }, i + 1)
    }
}   

export default forceOrderSend;