/**
 * SectionsManager View
 *
 * @module 72lions
 * @class SectionsManager
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.SectionsManager = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.SectionsManager
     */
    var me = this;

    /**
     * The HTML Element
     *
     * @type Object
     */
	this.domElement = $('#sections-wrapper');

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

};

seventytwolions.View.SectionsManager.prototype = new seventytwolions.View.Base();
