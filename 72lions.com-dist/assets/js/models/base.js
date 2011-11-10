seventytwolions.Model.Base = function(){

	// Declaring the API
	var api = {};

	/**
	 * Returns an array of categories
	 * @private
	 * @param {Function} callback The callback function that will be executed
	 * @returns An array with objects
	 * @type Array
	 * @author Thodoris Tsiridis
	 */
	var getCategories = function(callback) {

		if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
			callback();
		}

	};

	/**
	 * Returns an array with the posts and all of its details
	 * @private
	 * @param {Array} categories An array of the categories from which we want to load the posts
	 * @param {Function} callback The callback function that will be executed
	 * @returns It returns an array of posts
	 * @type Array
	 * @author Thodoris Tsiridis
	 */
	var getPosts = function(categories, callback) {

		if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
			callback();
		}

	};

	// Exposing functions
	api.getCategories = getCategories;
	api.getPosts = getPosts;

	// Return the api
	return api;

};

