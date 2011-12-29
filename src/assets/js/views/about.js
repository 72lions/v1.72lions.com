/**
 * About View
 *
 * @module 72lions
 * @class About
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.About = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.About
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('.about');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.domElement.slideDown();
    };

    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.slideUp();
    };

};

STL.View.About.prototype = new STL.View.Base();
