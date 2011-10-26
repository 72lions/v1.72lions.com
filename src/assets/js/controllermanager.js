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
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(className, id) {

        newController = seventytwolions.Lookup.getController(className, id);

        // Base initialization
        newController.initialize(className, id);

        return newController;
    };

};

// Instantiate the controller manager so that we can use it as a singleton
seventytwolions.ControllerManager = new seventytwolions.controllerManager();