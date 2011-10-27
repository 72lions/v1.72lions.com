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
    this.getController = function(className, id) {

        var exists = -1;

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
            }
        }

        if(exists === -1){

            exists = null;
            // If it doesn't already exist then push it on the array
            _controllers[className].push({id: id, classType: new seventytwolions.Controller[className]()});
            return _controllers[className][_controllers[className].length-1].classType;
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

        var exists = -1;

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
            // If it doesn't already exist then push it on the array
            _views[className].push({id: id, classType: new seventytwolions.View[className](className)});
            return _views[className][_views[className].length-1].classType;
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

        try {
            if(!_models[name] && $.isFunction(seventytwolions.Model[name])) {
                _models[name] = new seventytwolions.Model[name]();
            }
        } catch(e) {
            seventytwolions.console(name, e);
        }

        return _models[name];
    };

};

// Instantiate the lookup so that we can use it as a singleton
seventytwolions.Lookup = new seventytwolions.lookup();