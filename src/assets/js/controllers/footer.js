/**
 * Footer Controller
 *
 * @module 72lions
 * @class Footer
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Footer = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Footer
     */
    var me = this;

    /**
     * This function is executed right after the initialized
     *
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        me.getView().addEventListener('menuClicked', onMenuItemClicked);
        this.loadTweets();

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.getView().show();
    };
    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.getView().hide();
    };

    /**
     * Loads the latest tweets
     */
    this.loadTweets = function() {
        this.getModel().getTweets(onTweetsLoaded, this);
        this.getModel().getFlickr(onFlickrLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the Twitter ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onTweetsLoaded = function(result) {
        this.getView().showTweets();
    };

    /**
     * Callback function for when we get all the data from the Flickr ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onFlickrLoaded = function(result) {

    };

    /**
     * Triggered when the view dispatches a menuClicked event
     *
     * @private
     * @param {Object} event The event object
     * @author Thodoris Tsiridis
     */
    var onMenuItemClicked = function(event){

        // Push the current url
        Router.push(null, event.title + ' - ' + seventytwolions.Model.Locale.getPageTitle(), event.path);

    };

};

seventytwolions.Controller.Footer.prototype = new seventytwolions.Controller.Base();
