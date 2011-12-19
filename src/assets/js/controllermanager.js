/**
 * Controller Manager
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.ControllerManager = (function(global) {

    var newController;
    var api = {};

    api.data = null;


    /**
     * Initializes a controller with a specific name
     * @param {Object} object The parameters
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    api.initializeController = function(object) {
        return seventytwolions.Lookup.getController(object);
    };

    return api;

})(window);
