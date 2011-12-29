/**
 * Sections Manager View
 *
 * @module 72lions
 * @class SectionsManager
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.SectionsManager = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.SectionsManager
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

};

STL.View.SectionsManager.prototype = new STL.View.Base();
