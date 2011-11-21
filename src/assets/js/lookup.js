/**
 * Lookup for models views and controllers
 * Initializes or returns new controllers, views or models
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.lookup = function() {

    var _models         = {},
        _views          = {},
        _controllers    = {};

    /**
     * Returns a controller with a specific name
     * @param {String} className The name of the controllers
     * @param {String} id The unique id for this controller
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.getController = function(className, id, viewClassName) {

        var exists = -1, controllerObj;

        // Check if there is an array with objects of className type
        // If not then create a new array
        if(!_controllers[className] || !$.isArray(_controllers[className])) {
            _controllers[className] = [];
        }

        // Loop through al the items in the array
        // to check if an item with this id already exists
        for (var i = _controllers[className].length - 1; i >= 0; i--) {
            if(_controllers[className][i].id == id){
                exists = i;
                break;
            }
        }

        if(exists === -1){

            exists = null;
            // Check if the class that we want to load exists
            if(seventytwolions.Controller[className] !== undefined){
                controllerObj = {id: id, classType: new seventytwolions.Controller[className]()};
            } else {
                // Create a generic controller
                controllerObj = {id: id, classType: new seventytwolions.Controller.Base()};
            }

            _controllers[className].push(controllerObj);
            controllerObj.classType.initialize(className, id, viewClassName);
            return controllerObj.classType;

        } else {

            return _controllers[className][exists].classType;
        }

    };

    /**
     * Returns a view with a specific name
     * @param {String} name The name of the controllers
     * @param {String} id The unique id for this controller
     * @returns A view
     * @type seventytwolions.View.Base
     * @author Thodoris Tsiridis
     */
    this.getView = function(className, id) {

        var exists = -1, viewObj;

        // Check if there is an array with objects of className type
        // If not then create a new array
        if(!_views[className] || !$.isArray(_views[className])) {
            _views[className] = [];
        }

        // Loop through al the items in the array
        // to check if an item with this id already exists
        for (var i = _views[className].length - 1; i >= 0; i--) {
            if(_views[className][i].id == id){
                exists = i;
            }
        }

        if(exists === -1){

            exists = null;

            // Check if the class that we want to load exists
            if(seventytwolions.View[className] !== undefined){
                viewObj = {id: id, classType: new seventytwolions.View[className](className)};
            } else {
                viewObj = {id: id, classType: new seventytwolions.View.Base(className)};
            }

            _views[className].push(viewObj);

            return viewObj.classType;

        } else {
            return _views[className][exists].classType;
        }
    };

    /**
     * Returns a model with a specific name
     * @param {String} name The name of the controllers
     * @returns A model
     * @type seventytwolions.Model.Base
     * @author Thodoris Tsiridis
     */
    this.getModel = function(name) {
        var model;

        if(!_models[name] && $.isFunction(seventytwolions.Model[name])) {
            model = new seventytwolions.Model[name]();
        } else {
            model = new seventytwolions.Model.Base();
        }

        _models[name] = model;
        return _models[name];
    };

};

// Instantiate the lookup so that we can use it as a singleton
seventytwolions.Lookup = new seventytwolions.lookup();
