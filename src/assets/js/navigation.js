seventytwolions.Navigation = function(){

	// Declaring the API
	var api = {};

	/**
	 * Initializes the navigation
	 * @private
	 * @author Thodoris Tsiridis
	 */
	var init = function() {

	};

	// Exposing functions
	api.init = init;

	// Return the api
	return api;

};

// Register the component with the component loader
seventytwolions.ComponentLoader.registerComponent('navigation', seventytwolions.Navigation);