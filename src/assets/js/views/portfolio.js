/**
 * Portfolio View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Portfolio = function() {

    this.domElement = $('.portfolio');

    var me = this;
    var itemsContainer = this.domElement.find('.centered ul');

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
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     * @param {DOMElement} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        itemsContainer.append(item);
    };

};

seventytwolions.View.Portfolio.prototype = new seventytwolions.View.Base();
