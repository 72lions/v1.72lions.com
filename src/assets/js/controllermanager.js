/**
 * The controller manager is responsible for instantiating controllers
 *
 * @module 72lions
 * @class ControllerManager
 * @namespace seventytwolions
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.ControllerManager = (function(global) {

    var newController;
    /**
     * Will be used to expose private functions
     *
     * @private
     * @type Object
     */
    var api = {};

    api.data = null;


    /**
     * Initializes a controller with a specific name
     * @param {Object} object The parameters
     * @return {seventytwolions.Controller.Base}
     * @author Thodoris Tsiridis
     */
    var initializeController = function(object) {
        return seventytwolions.Lookup.getController(object);
    };

    api.initializeController = initializeController;

    return api;

})(window);
