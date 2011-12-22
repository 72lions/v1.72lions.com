/**
 * Base View
 *
 * @module 72lions
 * @class Base
 * @namespace seventytwolions.View
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Base = function() {

    EventTarget.call( this );

    /**
     * The view name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * The view id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * A reference to this view's model
     *
     * @type seventytwolions.View.Base
     * @default undefined
     */
    this.model = undefined;

    /**
     * The DOM Element
     *
     * @type Object
     * @default null
     */
    this.domElement = null;

    /**
     * Function for when showing the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function() {
    };

    /**
     * Function for when hiding the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
    };

    /**
     * Sets the name of the view
     *
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the name of the view
     *
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setId = function(id) {
        this.id = id;
    };

    /**
     * Sets the model for the view
     *
     * @param {seventytwolions.Model.Base} model The model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
        this.model = model;
    };

    /**
     * Gets the model for the view
     *
     * @return {seventytwolions.Model.Base} The model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return this.model;
    };

    /**
     * Returns the main dom element of the view
     *
     * @return {Object} A DOM element
     * @author Thodoris Tsiridis
     */
    this.getDOMElement = function() {
        return this.domElement;
    };

    /**
     * Is triggered before initialization of the view
     *
     * @author Thodoris Tsiridis
     */
    this.preInitialize = function(name, id) {
        this.setName(name);
        this.setId(id);
    };

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize = function(){

    };

    /**
     * Draws the view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function(){

    };

    /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw = function(){

    };

};
