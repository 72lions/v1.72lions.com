/**
 * Footer View
 *
 * @module 72lions
 * @class Footer
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Footer = function() {

    /**
     * The links DOM Elements
     *
     * @type Array
     * @default undefined
     */
    var $links;

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.Navigation
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
     * @default '<div class="photo"><a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a><a href="${link}" title="${title}"><img class="thumbnail-image" src="${image}" alt="${title}" width="${imagewidth}" height="${imageheight}"  /></a></div><div class="description"><hgroup><a href="${link}" title="${title}" class="title"><h1>${title}</h1></a></hgroup><time>${publishdate}</time><aside>Categories: ${categories}</aside><p>${description}</p><a href="${link}" title="${title}" class="readmore">Read more</a></div>'
     */
    var tweetTmpl = '<p>${text}</p>';

    /**
     * The Dom Element for the tweets container
     *
     * private
     * @type Object
     */
    var $tweetsContainerDomElement;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
        $links = this.domElement.find('.menu a');
        $tweetsContainerDomElement = this.domElement.find('.latest-tweets article');
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
        addEventListeners();
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;

        this.domElement.addClass('active');

        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

    };

    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
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

seventytwolions.View.Footer.prototype = new seventytwolions.View.Base();
