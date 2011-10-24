/**
 * Home View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Navigation = function(name) {

	this.setName(name);
	this.domElement = $('.navigation');

    var $links;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        seventytwolions.Console.log('Initializing view with name ' + this.name);

        $links = this.domElement.find('a');
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
        addEventListeners();
    };

    /**
     * Registers all the event listeners
     * @private
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        //Router.registerForEvent('push', onPushState);
        $links.bind('click', onLinkClick);
        Router.registerForPathChange('portfolio', onPortfolio, 0);
    };

    var onLinkClick = function(e){
        e.preventDefault();

        var $item = $(this);
        Router.push(null, $item.attr('title'), $item.attr('href'));
        $item = null;
    };

    var onPortfolio = function(state){
        seventytwolions.Console.log(state);
    };

}

seventytwolions.View.Navigation.prototype = new seventytwolions.View.Base();