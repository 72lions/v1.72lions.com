/**
 * Tag Model
 *
 * @module 72lions
 * @class Tag
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Tag = function(){

    /**
     * The api url for the posts
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php'
     */
    var POSTS_URL = '/api/get.php';

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
     * @property req
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The object that holds the data
     *
     * @type String
     */
    var data = {};

    /**
     * Gets an array of posts by doing an Ajax Call
     *
     * @param {Number} categoryId The category of the posts that we want to load
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.getPosts = function(categoryid, start, total, callback, ctx) {
        var dataString, me;

        me = this;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 'tag&s=' + start + '&t=' + total;

        if(categoryid !== null){
            dataString += '&tid=' + categoryid;
        }

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
            url: POSTS_URL,
            dataType: 'json',
            data: dataString,
            success: function(res){
                me.set('Tag', res.Results);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('Tag')]);
                    req = undefined;
                }
            }
        });
    };

};

STL.Model.Tag.prototype = new STL.Model.Base();
