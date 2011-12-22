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

    /**
     * Initializes a controller with a specific name
     *
     * @param {Object} object The parameters
     * @return {seventytwolions.Controller.Base}
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(object) {
        return seventytwolions.Lookup.getController(object);
    };

    return this;

})(window);
