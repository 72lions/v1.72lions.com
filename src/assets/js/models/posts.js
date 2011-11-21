seventytwolions.Model.Posts = function(){

	// Constants
	var POSTS_URL = '/api/getPosts.php';
	var req;
	var data = {};

	/**
	 * Returns an array of posts
	 * @private
	 * @param {Number} categoryId The category of the posts that we want to load
	 * @param {Function} callback The callback function that will be executed
	 * @returns An array with objects
	 * @type Array
	 * @author Thodoris Tsiridis
	 */
	this.get = function(categoryid, callback) {

		if(req !== undefined){
			req.abort();
		}

		req = $.ajax({
					url: POSTS_URL,
					dataType: 'json',
					data: 'cid=' + categoryid,
					success: function(res){
							data.posts = res.Results;
						if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
							callback(data.posts);
							req = undefined;
						}
					}
				});
	};

};

seventytwolions.Model.Posts.prototype = new seventytwolions.Model.Base();
