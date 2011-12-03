/**
 * Base View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Base = function() {

    EventTarget.call( this );

    this.name = null;
    this.id = null;
    this.model = null;
    this.domElement = null;

    /**
     * Function for when showing the view
     * @author Thodoris Tsiridis
     */
    this.show = function() {
    };

    /**
     * Function for when hiding the view
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
    };

    /**
     * Sets the name of the view
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the name of the view
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setId = function(id) {
        this.id = id;
    };

    /**
     * Sets the model for the view
     * @param {seventytwolions.models.Base} model The model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
        this.model = model;
    };

    /**
     * Gets the model for the view
     * @return The model
     * @type {seventytwolions.Model.Base}
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return this.model;
    };

    /**
     * Returns the main dom element of the view
     * @returns A DOM element
     * @type jQuery DOM element
     * @author Thodoris Tsiridis
     */
    this.getDOMElement = function() {
        return this.domElement;
    };

    /**
     * Is triggered before initialization of the view
     * @author Thodoris Tsiridis
     */
    this.preInitialize = function(name, id) {
        this.setName(name);
        this.setId(id);
    };

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize = function(){

    };

    /**
     * Draws the view
     * @author Thodoris Tsiridis
     */
    this.draw = function(){

    };

    /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw = function(){

    };

};
