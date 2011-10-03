seventytwolions.componentloader = function(){

	// Declaring the API
	var api = {};

	// Private variables
	var registeredComponents				= {};

	/**
	 * Initializes the component loader
	 * @private
	 * @author Thodoris Tsiridis
	 */
	var init = function(){

	};

	/**
	 * Registers a component with the component loader
	 * @private
	 * @param {String} name The name of the component
	 * @param {Funcion} component The component itself
	 * @author Thodoris Tsiridis
	 */
	var registerComponent = function(name, component){

		// If the specific component is not registered then
		if( typeof(registeredComponents[name]) === 'undefined' || typeof(registeredComponents[name]) === 'null' ){

			// Instantiate the component and cache it
			registeredComponents[name] = new component();

		}

	};

	// Exposing functions
	api.registerComponent = registerComponent;
	api.init = init;

	// Return the api
	return api;

};

// Instantiate the component loader so that we can use it as a singleton
seventytwolions.ComponentLoader = new seventytwolions.componentloader();