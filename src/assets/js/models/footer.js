/**
 * Footer Model
 *
 * @module 72lions
 * @class Footer
 * @namespace seventytwolions.Model
 * @extends seventytwolions.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Footer = function(){

    /**
     * The api url for the categories
     *
     * @private
     * @final
     * @type String
     * @default '/api/getTweets.php'
     */
    var TWITTER_URL = '/api/getTweets.php';

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
     * The ajax request as returned from jQuery.ajax()
     *
     * @private
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The object that holds the data
     *
     * @private
     * @type String
     */
    var data = {};

    /**
     * Returns an array of tweets
     *
     * @private
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.getTweets = function(callback, ctx) {
        var dataString, tme;
        me = this;

        dataString = 't=' + TOTAL_TWEETS;

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

};

seventytwolions.Model.Footer.prototype = new seventytwolions.Model.Base();
