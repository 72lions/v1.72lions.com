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
     * @param {Object} object The parameters
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(object) {
        var className, id, viewClassName, model;

        className = object.type;
        id = object.id;
        viewClassName = object.viewClassType;
        model = object.model;

        return seventytwolions.Lookup.getController(className, id, viewClassName, model);
    };

};

// Instantiate the controller manager so that we can use it as a singleton
seventytwolions.ControllerManager = new seventytwolions.controllerManager();
