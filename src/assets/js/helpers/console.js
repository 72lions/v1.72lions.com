/**
 * Console is used for outputing console.log messages
 *
 * @module 72lions
 * @class Console
 * @namespace STL
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Console = ( function(){

    return {

        /**
         * Set to true and debug will be enabled
         *
         * @type {Boolean}
         * @default true
         */
        debug: true,

        /**
         * Logs out a message
         *
         * @param {Object || Array || Number || String || Arguments} arguments The message to pass down to console.log
         * @author Thodoris Tsiridis
         */
        log: function() {

            if(STL.Console.debug){
                console.log(arguments);
            }

        }
    }

})();
