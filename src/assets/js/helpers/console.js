/**
 * Console is used for outputing console.log messages
 *
 * @module 72lions
 * @class Console
 * @namespace seventytwolions
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Console = function(global){

    /**
     * Set to true and debug will be enabled
     *
     * @type {Boolean}
     * @default true
     */
    this.debug = true;

    /**
     * Logs out a message
     *
     * @param {Object || Array || Number || String || Arguments} arguments The message to pass down to console.log
     * @author Thodoris Tsiridis
     */
    this.log = function() {

        if(this.debug){
            console.log(arguments);
        }

    };

    // Return the api
    return this;

}(window);
