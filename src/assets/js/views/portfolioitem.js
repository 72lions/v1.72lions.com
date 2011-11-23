/**
 * Portfolio Item View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PortfolioItem = function() {

    var me = this;

	this.domElement = $('.portfolio');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        seventytwolions.Console.log('Initializing view with name ' + this.name + ', ' + this.id);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

};

seventytwolions.View.PortfolioItem.prototype = new seventytwolions.View.Base();