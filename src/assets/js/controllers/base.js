/**
 * Base Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Base = function() {

    EventTarget.call( this );

    var _view, _model, _registeredEvents = {};

    this.data = {};
    this.id = '';
    this.name = '';

    /**
     * Initializes the plugin
     * @param {String} className the name of the class that we initialized
     * @param {String} id The unique id of this class
     * @author Thodoris Tsiridis
     */
    this.initialize = function(className, id) {

        this.name = className;
        this.id = id;
        // get a reference to view
        _view = seventytwolions.Lookup.getView(className, id);

        // get a reference to the model
        _model = seventytwolions.Lookup.getModel(className);

        // ask it to initialize, draw and postDraw
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

    }

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

}