/**
 * Categories Model
 *
 * @module 72lions
 * @class Categories
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Categories = function(){

    /**
     * The response object that came from the ajax call
     *
     * @private
     * @property response
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The object that holds the data
     *
     * @private
     * @type Object
     */
    var data = {};

    /**
     * The api url for the categories
     *
     * @private
     * @type String
     * @default '/api/getCategories.php'
     */
    var CATEGORIES_URL = '/api/getCategories.php';

    /**
     * The start offset for the categories
     *
     * @private
     * @type Number
     * @default 0
     */
    var DEFAULT_START = 0;

    /**
     * The total number of items to retrieve from the api
     *
     * @private
     * @type Number
     * @default 10
     */
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    /**
     * Gets an array of categories by doing an Ajax call
     *
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.get = function(start, total, callback, ctx) {
        var dataString, me;

        me = this;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 's=' + start + '&t=' + total;

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
            url: CATEGORIES_URL,
            dataType: 'json',
            data: dataString,
            success: function(res){
                me.set('posts', res.Results);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('posts')]);
                    req = undefined;
                }
            }
        });

    };

};

STL.Model.Categories.prototype = new STL.Model.Base();
