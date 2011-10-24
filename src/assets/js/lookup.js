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
     * @param {String} name The name of the controllers
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.getController = function(name) {

        try {
            if(!_controllers[name] && $.isFunction(seventytwolions.Controller[name])) {
                _controllers[name] = new seventytwolions.Controller[name](name);
            }
        } catch(e) {
            seventytwolions.console(name, e);
        }

        return _controllers[name];
    };

    /**
     * Returns a view with a specific name
     * @param {String} name The name of the controllers
     * @returns A view
     * @type seventytwolions.View.Base
     * @author Thodoris Tsiridis
     */
    this.getView = function(name) {

        try {
            if(!_views[name] && $.isFunction(seventytwolions.View[name])) {
                _views[name] = new seventytwolions.View[name](name);
            }
        } catch(e) {
            seventytwolions.console(name, e);
        }

        return _views[name];
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
                _models[name] = new seventytwolions.Model[name](name);
            }
        } catch(e) {
            seventytwolions.console(name, e);
        }

        return _models[name];
    };

};

// Instantiate the lookup so that we can use it as a singleton
seventytwolions.Lookup = new seventytwolions.lookup();