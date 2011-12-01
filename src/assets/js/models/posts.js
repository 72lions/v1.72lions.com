seventytwolions.Model.Posts = function(){

    // Constants
    var POSTS_URL = '/api/getPosts.php';
    var DEFAULT_START = 0;
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    var req;
    var data = {};

    /**
     * Returns an array of posts
     * @private
     * @param {Number} categoryId The category of the posts that we want to load
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @returns An array with objects
     * @type Array
     * @author Thodoris Tsiridis
     */
    this.get = function(categoryid, start, total, callback, ctx) {

        var dataString;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 's=' + start + '&t=' + total;

        if(categoryid !== null){
            dataString += '&cid=' + categoryid;
        }

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
                url: POSTS_URL,
                dataType: 'json',
                data: dataString,
                success: function(res){
                    data.posts = res.Results;
                    if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                        callback.apply(ctx, [data.posts]);
                        req = undefined;
                    }
                }
            });
    };

};

seventytwolions.Model.Posts.prototype = new seventytwolions.Model.Base();
