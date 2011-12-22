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

    /**
     * The api url for the posts
     *
     * @private
     * @final
     * @type String
     * @default '/api/getPosts.php'
     */
    var POSTS_URL = '/api/getPosts.php';

    /**
     * The api url for the posts details
     *
     * @private
     * @final
     * @type String
     * @default '/api/getPostDetails.php'
     */
    var POST_DETAILS_URL = '/api/getPostDetails.php';

    /**
     * The start offset for the categories
     *
     * @private
     * @final
     * @type Number
     * @default 0
     */
    var DEFAULT_START = 0;

    /**
     * The total number of items to retrieve from the api
     *
     * @private
     * @final
     * @type Number
     * @default 10
     */
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    /**
     * The ajax request as returned from jQuery.ajax()
     *
     * @private
     * @type jqXHR
     * @default undefined
     */
    var req = undefined;

    /**
     * The ajax request for the details call as returned from jQuery.ajax()
     *
     * @private
     * @type jqXHR
     * @default undefined
     */
    var reqDetails = undefined;

    /**
     * The object that holds the data
     *
     * @type String
     */
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
