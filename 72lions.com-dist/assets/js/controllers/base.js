/**
 * Base Controller
 * @param {String} className the name of the class that we initialized
 * @param {String} id The unique id of this class
 * @param {String} viewClassName The class of the view (in case we want a different view)
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Base = function() {

    EventTarget.call( this );
    var _view, _model, _registeredEvents = {};

    this.id = '';
    this.name = '';
    this.model = undefined;

    /**
     * Initializes the plugin
     * @author Thodoris Tsiridis
     */
    this.initialize = function(attributes) {

        this.id = attributes.id || id;
        this.name = attributes.type || '';

        // Get a reference to the view
        _view = attributes.view || seventytwolions.Lookup.getView(this.name, this.id);
        // get a reference to the model
        _model = this.model = attributes.model;

        // ask it to set the model, initialize, draw and postDraw
        _view.setModel(_model);
        _view.initialize();
        _view.draw();
        _view.postDraw();
        this.postInitialize();

    };

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function() {

    };

    /**
     * Returns the view of the specific controller
     * @returns A view
     * @type seventytwolions.View.Base
     * @author Thodoris Tsiridis
     */
    this.getView = function() {
        return _view;
    };

    /**
     * Returns the model of the specific controller
     * @returns A view
     * @type seventytwolions.Model.Base
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return _model;
    };

    /**
     * Sets the model of the controller
     * @param {seventytowlions.Model.Base} model The new model
     */
    this.setModel = function(model) {
      _model = model;
      _view.setModel(model);
    };

};
