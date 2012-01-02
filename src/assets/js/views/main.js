/**
 * Main View
 *
 * @module 72lions
 * @class Main
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Main = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('#wrapper');

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

STL.View.Main.prototype = new STL.View.Base();
