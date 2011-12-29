/**
 * The controller manager is responsible for instantiating controllers
 *
 * @module 72lions
 * @class ControllerManager
 * @namespace seventytwolions
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.ControllerManager = function(global) {

    /**
     * Initializes a controller with a specific type, id, view and model
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @param {seventytwolions.Model.Base} attributes.model The model to be used by this controller
     * @param {seventytwolions.View.Base} attributes.view The view to be used by this controller
     * @return {seventytwolions.Controller.Base}
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(object) {
        return seventytwolions.Lookup.getController(object);
    };

    return this;

}(window);
