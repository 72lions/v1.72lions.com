/**
 * Footer View
 *
 * @module 72lions
 * @class Footer
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Footer = function() {

    /**
     * The total number of flickr photos to show
     *
     * final
     * @type Number
     * @default 4
     */
    var TOTAL_FLICKR_PHOTOS = 14;

    /**
     * The links DOM Elements
     *
     * @type Array
     * @property $links
     * @default undefined
     */
    var $links;

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Footer
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('footer');

    /**
     * The clicked DOM Element
     *
     * @type Object
     * @default undefined
     */
    this.clickedItem = undefined;

    /**
     * The HTML template for the thumbnail item
     *
     * @private
     * @type String
     * @default ''
     */
    var tweetTmpl = '<p>${text}</p>';

    /**
     * The HTML template for the flickr thumbnail
     *
     * @private
     * @type String
     * @default ''
     */
    var flickrTmpl = '<a href="${link}" title="${title}" target="_blank"><img src="${src}" alt="${title}" /></a>';


    /**
     * The Dom Element for the tweets container
     *
     * private
     * @type Object
     * @property $tweetsContainerDomElement
     * @default undefined
     */
    var $tweetsContainerDomElement;

    /**
     * The Dom Element for the flickr photos container
     *
     * private
     * @type Object
     * @property $flickrContainerDomElement
     * @default undefined
     */
    var $flickrContainerDomElement;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
        $links = this.domElement.find('.menu a');
        $tweetsContainerDomElement = this.domElement.find('.latest-tweets article');
        $flickrContainerDomElement = this.domElement.find('.flickr-photos nav');
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
        addEventListeners();
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.domElement.addClass('active');
    };

    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active');
    };

    /**
     * Renders the latest tweets in the footer
     */
    this.showTweets = function() {
        var tweets, body, markup, len, i;

        markup = '';
        tweets = this.getModel().get('tweets');
        len = tweets.length;

        for (i = 0; i < len; i++) {

            body = tweetTmpl;
            body = body.replace(/\${text}/g, twitterify(tweets[i].text));
            markup += body;

        }

        $tweetsContainerDomElement.append(markup);

    };

    /**
     * Renders the Flickr photos
     *
     * @author Thodoris Tsiridis
     */
    this.showFlickrPhotos = function() {
        var photos, i, body, markup;

        // Get the data from the model
        photos = tweets = this.getModel().get('flickr');
        markup = '';

        if(photos.length < TOTAL_FLICKR_PHOTOS){
            TOTAL_FLICKR_PHOTOS = photos.length;
        }

        // Loop through the photos objects
        for (i = 0; i < TOTAL_FLICKR_PHOTOS; i++) {

            body = flickrTmpl;
            body = body.replace(/\${link}/g, photos[i].link);
            body = body.replace(/\${title}/g, photos[i].title);
            body = body.replace(/\${src}/g, photos[i].media.m);
            markup += body;

        }

        $flickrContainerDomElement.append(markup);

    };

    /**
     * Gets a string and convert hashes, links and users into anchors
     *
     * @private
     * @param {String} text The tweet to convert
     * @return {String} The converted HTML
     */
    var twitterify = function (tweet) {

        //Links
        tweet = tweet.replace(/http([s]?):\/\/([^\ \)$]*)/g,"<a rel='nofollow' target='_blank' href='http$1://$2'>http$1://$2</a>");
        //Users
        tweet = tweet.replace(/(^|\s)@(\w+)/g, "$1@<a href='http://www.twitter.com/$2' target='_blank'>$2</a>");
        //Mentions
        tweet = tweet.replace(/(^|\s)#(\w+)/g, "$1#<a href='http://twitter.com/search/%23$2'target='_blank'>$2</a>");

        return tweet;

    };

    /**
     * Registers all the event listeners
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        $links.bind('click', onLinkClick);
    };

    /**
     * Triggered when we click a link
     *
     * @private
     * @param {Object} e The event
     * @author Thodoris Tsiridis
     */
    var onLinkClick = function(e){
        var $item, delay;

        e.preventDefault();

        // Cache the item
        $item = me.clickedItem = $(this);

        delay = 200;

        // Scroll to top
        $('body,html').stop().animate({scrollTop:0}, delay, 'easeOutQuint');

        setTimeout(function(){
            // Dispatch the event
            console.log('dispatch event');
            me.dispatchEvent({type: 'menuClicked', path: me.clickedItem.attr('href'), title: me.clickedItem.attr('title')});
        }, delay + 100);

        // Clear memory
        $item = null;
    };

};

STL.View.Footer.prototype = new STL.View.Base();
