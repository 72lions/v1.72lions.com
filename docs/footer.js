/**
 * Footer Model
 *
 * @module 72lions
 * @class Footer
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Footer = function(){

    /**
     * The api url for the tweets
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php'
     */
    var TWITTER_URL = '/api/get.php';

    /**
     * The total number of tweets to get
     *
     * @private
     * @final
     * @type Number
     * @default 2
     */
    var TOTAL_TWEETS = 2;

    /**
     * The api url for the flickr photos
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php?flickr'
     */
    var FLICKR_URL = '/api/get.php?flickr';

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
     * The ajax request as returned from jQuery.ajax() for the Flickr call
     *
     * @private
     * @property reqFlickr
     * @type jqXHR
     * @default undefined
     */
    var reqFlickr;

    /**
     * The object that holds the data
     *
     * @private
     * @type String
     */
    var data = {};

    /**
     *  Gets an array of tweets by doing an Ajax Call
     *
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.getTweets = function(callback, ctx) {
        var dataString, me;
        me = this;

        dataString = 'tweets&t=' + TOTAL_TWEETS;

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
            url: TWITTER_URL,
            dataType: 'json',
            data: dataString,
            success: function(res){
                me.set('tweets', res.results);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('tweets')]);
                    req = undefined;
                }
            }
        });

    };

    /**
     *  Gets an array of Flickr images by doing an Ajax Call
     *
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.getFlickr = function(callback, ctx) {
        var dataString, me;
        me = this;

        if(reqFlickr !== undefined){
            reqFlickr.abort();
        }

        reqFlickr = $.ajax({
            url: FLICKR_URL,
            dataType: 'json',
            success: function(res){
                me.set('flickr', res.items);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('flickr')]);
                    reqFlickr = undefined;
                }
            },

            error: function() {

            }
        });

    };

};

STL.Model.Footer.prototype = new STL.Model.Base();
