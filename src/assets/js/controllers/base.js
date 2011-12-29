/**
 * Base Controller
 *
 * @module 72lions
 * @class Base
 * @namespace STL.Controller
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Base = function() {

    EventTarget.call( this );

    /**
     * A reference to this controller's view
     *
     * @private
     * @type STL.View.Base
     * @property _view
     * @default undefined
     */
    var _view;

    /**
     * A reference to this controller's model
     *
     * @private
     * @type STL.Controller.Base
     * @property _model
     * @default undefined
     */
    var _model;

    /**
     * The controller id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * The controller name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * A reference to this controller's model
     *
     * @type STL.Controller.Base
     * @default undefined
     */
    this.model = undefined;

    /**
     * Initializes the plugin
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @author Thodoris Tsiridis
     */
    this.initialize = function(attributes) {

        this.id = attributes.id || id;
        this.name = attributes.type || '';

    };

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function() {

    };

    /**
     * Sets the view of the controller
     *
     * @param {seventytowlions.View.Base} view The new view
     * @author Thodoris Tsiridis
     */
    this.setView = function(view) {
        _view = view;
        // ask it to set the model, initialize, draw and postDraw
        _view.setModel(_model);
        _view.initialize();
        _view.draw();
        _view.postDraw();
    };

    /**
     * Returns the view of the specific view
     *
     * @return {STL.View.Base} The Base view
     * @author Thodoris Tsiridis
     */
    this.getView = function() {
        return _view;
    };

    /**
     * Returns the model of the specific model
     *
     * @return {STL.Model.Base} The Base model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return _model;
    };

    /**
     * Sets the model of the controller
     *
     * @param {seventytowlions.Model.Base} model The new model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
      this.model = _model = model;
      _view.setModel(model);
    };

};
