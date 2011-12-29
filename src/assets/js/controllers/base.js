/**
 * Base Controller
 *
 * @module 72lions
 * @class Base
 * @namespace seventytwolions.Controller
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Base = function() {

    EventTarget.call( this );

    /**
     * A reference to this controller's view
     *
     * @private
     * @type seventytwolions.View.Base
     * @default undefined
     */
    var _view = undefined;

    /**
     * A reference to this controller's model
     *
     * @private
     * @type seventytwolions.Controller.Base
     * @default undefined
     */
    var _model = undefined;

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
     * @type seventytwolions.Controller.Base
     * @default undefined
     */
    this.model = undefined;

    /**
     * Initializes the plugin
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @param {seventytwolions.Model.Base} attributes.model The model to be used by this controller
     * @param {seventytwolions.View.Base} attributes.view The view to be used by this controller
     * @author Thodoris Tsiridis
     */
    this.initialize = function(attributes) {

        this.id = attributes.id || id;
        this.name = attributes.type || '';

        // Get a reference to the view
        _view = attributes.view || seventytwolions.Lookup.getView({type:this.name, id: this.id});

        // get a reference to the model
        _model = this.model = attributes.model || seventytwolions.Lookup.getModel({type:this.name, id: this.id});

        // ask it to set the model, initialize, draw and postDraw
        _view.setModel(_model);
        _view.initialize();
        _view.draw();
        _view.postDraw();
        this.postInitialize();

    };

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function() {

    };

    /**
     * Returns the view of the specific view
     *
     * @return {seventytwolions.View.Base} The Base view
     * @author Thodoris Tsiridis
     */
    this.getView = function() {
        return _view;
    };

    /**
     * Returns the model of the specific model
     *
     * @return {seventytwolions.Model.Base} The Base model
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
      _model = model;
      _view.setModel(model);
    };

};
