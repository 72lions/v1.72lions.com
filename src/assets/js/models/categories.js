seventytwolions.Model.Categories = function(){

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
	this.getCategories = function(callback) {

		if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
			callback();
		}

	};

};

seventytwolions.Model.Categories.prototype = new seventytwolions.Model.Base();
