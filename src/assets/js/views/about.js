/**
 * About View
 *
 * @module 72lions
 * @class About
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.About = function() {

    var me = this;

	this.domElement = $('.about');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.domElement.slideDown();
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.slideUp();
    };

};

seventytwolions.View.About.prototype = new seventytwolions.View.Base();
