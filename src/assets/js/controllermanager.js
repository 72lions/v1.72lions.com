/**
 * Controller Manager
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.controllerManager = function() {

    var newController;
    this.data = null

    /**
     * Initializes a controller with a specific name
     * @param {String} name The name of the controllers
     * @param {Object} data The data that the controller should be initialized with
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(name, data) {

        this.data = data;

        newController = seventytwolions.Lookup.getController(name);

        // Base initialization
        newController.initialize(name, data);

        if($.isFunction(newController.postInitialize)) {
            newController.postInitialize();
        }

        return newController;
    };

};

// Instantiate the controller manager so that we can use it as a singleton
seventytwolions.ControllerManager = new seventytwolions.controllerManager();