seventytwolions.console = function(){

	// Declaring the API
	var api = {};

	api.debug = true;

	/**
	 * Logs out a message
	 * @private
	 * @param Multiple arguments
	 * @returns Nothing
	 * @type null
	 * @author Thodoris Tsiridis
	 */
	var log = function() {

		if(api.debug){
			console.log(arguments);
		}

	};

	// Exposing functions
	api.log = log;

	// Return the api
	return api;

};

// Instantiate the model so that we can use it as a singleton
seventytwolions.Console = new seventytwolions.console();