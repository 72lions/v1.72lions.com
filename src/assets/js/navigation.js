seventytwolions.Navigation = function($context){

	// Declaring the API
	var api = {};

	// jQuery elements
	var $links					= $context.find('ul li a');
	/**
	 * Initializes the navigation
	 * @private
	 * @author Thodoris Tsiridis
	 */
	var initialize = function() {
		seventytwolions.Console.log('Initializing the navigation plugin...');

		addEventListeners();

	};

	/**
	 * Registers all the event listeners
	 * @private
	 * @author Thodoris Tsiridis
	 */
	var addEventListeners = function(){
		Router.registerForEvent('push', onPushState);
		$links.bind('click', onLinkClick);
	};

	var onPushState = function(state){
		seventytwolions.Console.log(state);
	};

	var onLinkClick = function(e){
		e.preventDefault();

		$item = $(this);
		Router.push(null, $item.attr('title'), $item.attr('href'));

	};

	// Exposing functions
	api.initialize = initialize;
	api.id = '';

	// Return the api
	return api;

};

// Register the component with the component loader
seventytwolions.ComponentLoader.registerComponent('navigation', seventytwolions.Navigation);