/**
 * Controller Manager
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.controllerManager = function() {

    var newController;
    this.data = null;

    /**
     * Initializes a controller with a specific name
     * @param {String} className The name of the controllers
     * @param {String} id The unique id for this controller
     * @param {String} viewClassName The name of a different view
     * @param {Object} model The model that we want to use
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(className, id, viewClassName, model) {
        return seventytwolions.Lookup.getController(className, id, viewClassName, model);
    };

};

// Instantiate the controller manager so that we can use it as a singleton
seventytwolions.ControllerManager = new seventytwolions.controllerManager();
