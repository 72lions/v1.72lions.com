/**
 * Posts Model
 *
 * @module 72lions
 * @class Posts
 * @namespace seventytwolions.Model
 * @extends seventytwolions.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Posts = function(){

    // Constants
    var POSTS_URL = '/api/getPosts.php';
    var POST_DETAILS_URL = '/api/getPostDetails.php';
    var DEFAULT_START = 0;
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    var req, reqDetails;
    var data = {};

    /**
     * Returns an array of posts
     *
     * @param {Number} categoryId The category of the posts that we want to load
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.getPosts = function(categoryid, start, total, callback, ctx) {

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

    /**
     * Returns an array of posts
     *
     * @param {String} slug The slug of the page
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.getDetails = function(slug, callback, ctx) {

        if(reqDetails !== undefined){
            reqDetails.abort();
        }

        reqDetails = $.ajax({
                url: POST_DETAILS_URL,
                dataType: 'json',
                data: 'id=' + slug,
                success: function(res){
                    data.post = res.Results;
                    if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                        callback.apply(ctx, [data.post]);
                        req = undefined;
                    }
                }
            });
    };

};

seventytwolions.Model.Posts.prototype = new seventytwolions.Model.Base();
