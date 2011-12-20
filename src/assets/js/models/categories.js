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

    var CATEGORIES_URL = '/api/getCategories.php';
    var DEFAULT_START = 0;
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    // Declaring the API
    var api = {};
    var req;
    var data = {};

    /**
     * Returns an array of categories
     * @private
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @returns An array with objects
     * @type Array
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
