/**
 * Base View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Base = function() {

    EventTarget.call( this );

    this.name = "Base";
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
     * Returns the main dom element of the view
     * @returns A DOM element
     * @type jQuery DOM element
     * @author Thodoris Tsiridis
     */
    this.getDOMElement = function() {
        return this.domElement;
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

}