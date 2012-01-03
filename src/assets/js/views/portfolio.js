/**
 * Portfolio View
 *
 * @module 72lions
 * @class Portfolio
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Portfolio = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
    this.domElement = $('.portfolio');

    /**
     * The section title
     * @type String
     */
    this.title = 'Blog';

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Portfolio
     */
    var me = this;

    /**
     * The items container DOM Element
     *
     * @private
     * @type Object
     */
    var itemsContainer = this.domElement.find('.centered');

    /**
     * The markup that will be rendered on the page
     *
     * @private
     * @type Object
     * @default ''
     */
    var markup = $('<div>');

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
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

        document.title = this.title + ' - ' + STL.Model.Locale.getPageTitle();

    };
    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     *
     * @param {Object} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        markup.append(item);
    };


    /**
     * Renders the html markup on the page
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        itemsContainer.html(markup);
    };

};

STL.View.Portfolio.prototype = new STL.View.Base();
