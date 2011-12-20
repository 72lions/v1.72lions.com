/**
 * Console is used for outputing console.log messages
 *
 * @module 72lions
 * @class Console
 * @namespace seventytwolions
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Console = (function(global){

    // Declaring the API
    var api = {};

    api.debug = true;

    /**
     * Logs out a message
     * @private
     * @param Multiple arguments
     * @returns Nothing
     * @type null
     * @author Thodoris Tsiridis
     */
    var log = function() {

        if(api.debug){
            console.log(arguments);
        }

    };

    // Exposing functions
    api.log = log;

    // Return the api
    return api;

})(window);
