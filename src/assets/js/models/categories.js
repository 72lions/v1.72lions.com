/**
 * Categories Model
 *
 * @module 72lions
 * @class Categories
 * @namespace seventytwolions.Model
 * @extends seventytwolions.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Categories = function(){

    /**
     * The api url for the categories
     *
     * @private
     * @final
     * @type String
     * @default '/api/getCategories.php'
     */
    var CATEGORIES_URL = '/api/getCategories.php';

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
     * The object that holds the data
     *
     * @type String
     */
    var data = {};

    /**
     * Returns an array of categories
     *
     * @private
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.get = function(start, total, callback, ctx) {
        var dataString;

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
                        data.posts = res.Results;
                        if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                            callback.apply(ctx, [data.posts]);
                            req = undefined;
                        }
                    }
                });

    };

};

seventytwolions.Model.Categories.prototype = new seventytwolions.Model.Base();
