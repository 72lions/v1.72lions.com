/**
 * PostDetails View
 *
 * @module 72lions
 * @class PostDetails
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PostDetails = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('.post-details');

    /**
     * The id of the current article
     *
     * @type String
     * @default null
     */
    this.currentId = null;

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.PostDetails
     */
    var me = this;

    /**
     * Holds the data for a specific article
     *
     * @private
     * @type Object
     * @default null
     */
    var details = null;

    /**
     * The content DOM Element
     *
     * @private
     * @type Object
     */
    var contentDomElement = this.domElement.find('.content');

    /**
     * The aside DOM Element
     *
     * @private
     * @type Object
     */
    var asideDomElement = this.domElement.find('aside');

    /**
     * The title DOM Element
     *
     * @private
     * @type Object
     */
    var titleDomElement = contentDomElement.find('h1.title');

    /**
     * The categories DOM Element
     *
     * @private
     * @type Object
     */
    var categoriesDomElement = contentDomElement.find('.categories');

    /**
     * The text DOM Element
     *
     * @private
     * @type Object
     */
    var textDomElement = contentDomElement.find('.text');

    /**
     * The time DOM Element
     *
     * @private
     * @type Object
     */
    var timeDomElement = contentDomElement.find('time');

    /**
     * The github ribbon DOM Element
     *
     * @private
     * @type Object
     */
    var githublinkDomElement = contentDomElement.find('.github-link');

    /**
     * The download link DOM Element
     *
     * @private
     * @type Object
     */
    var downloadlinkDomElement = contentDomElement.find('.download-link');

    /**
     * The demo link DOM Element
     *
     * @private
     * @type Object
     */
    var demolinkDomElement = contentDomElement.find('.demo-link');

    /**
     * The comments DOM Element
     *
     * @private
     * @type Object
     */
    var commentsDomElement = this.domElement.find('.comments');

    /**
     * The back button DOM Element
     *
     * @private
     * @type Object
     */
    var backDomElement = this.domElement.find('.back');

    /**
     * Holds the total number of tries to load the disquss plugin
     *
     * @private
     * @final
     * @type {Number}
     */
    var TOTAL_DISQUS_TRIES = 10;

    /**
     * Holds the current number of tries to load the disquss plugin
     *
     * @private
     * @type {Number}
     */
    var disqusCurrentLoadTries = 0;
    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        backDomElement.bind('click', onBackClick);
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

   /**
     * Renders the view
     *
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        var asideHTML, categoriesStr, pDate, slug, url;

        asideHTML = categoriesStr = '';

        details = this.getModel().get('PostDetails'+this.currentId);

        textDomElement.html(details.Content);

        // Create categories string
        categories = details.Categories;

        for (var i = 0; i < categories.length; i++) {

            categoriesStr += categories[i].Name;

            if(i < categories.length - 1){
                categoriesStr +=', ';
            }

        }

        if(categoriesStr !== '') {
            categoriesDomElement.html('Categories: ' + categoriesStr);
            categoriesDomElement.fadeIn(0);
        } else {
            categoriesDomElement.fadeOut(0);
        }

        //seventytwolions.Console.log('Drawing view with name ' + this.name);
        if(typeof(details.Meta.github) !== 'undefined'){
            githublinkDomElement.attr('href', details.Meta.github);
            githublinkDomElement.addClass('visible');
        } else {
            githublinkDomElement.removeClass('visible');
        }

        if(typeof(details.Meta.download) !== 'undefined') {
            downloadlinkDomElement.attr('href', details.Meta.download);
            downloadlinkDomElement.addClass('visible');
        } else {
            downloadlinkDomElement.removeClass('visible');
        }

        if(typeof(details.Meta.demo) !== 'undefined') {
            demolinkDomElement.attr('href', details.Meta.demo);
            demolinkDomElement.addClass('visible');
        } else {
            demolinkDomElement.removeClass('visible');
        }

        //Firefox doesn't like dates with / in the constructor
        pDate = new Date(details.PublishDate.replace(/-/g ,'/'));
        timeDomElement.html(seventytwolions.Model.Locale.getDayName(pDate.getDay()) + ', ' +  seventytwolions.Model.Locale.getMonthName(pDate.getMonth()) + ' ' + pDate.getDate() +  ' ' + pDate.getFullYear());
        titleDomElement.html(details.Title);
        asideDomElement.html(asideHTML);

        slug = details.Slug;
        month = (pDate.getMonth() + 1).toString();
        month = month.length === 1 ? "0" + month : month;
        url = '/' + pDate.getFullYear() + '/' + month + '/' + slug;


        disqusCurrentLoadTries = TOTAL_DISQUS_TRIES;

        if(details.Meta.dsq_thread_id) {
            console.log(details.Meta.dsq_thread_id, url);
            tryToLoadDisqus(details.Meta.dsq_thread_id, url);
        } else {
            commentsDomElement.css('display', 'none');
        }

        document.title = details.Title + ' - ' + seventytwolions.Model.Locale.getPageTitle();
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
     * Triggered when the back button is clicked
     *
     * @private
     * @param {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onBackClick = function(event){
        event.preventDefault();
        Router.goBack(1);
    };

    /**
     * Tries to load the Disqus plugin. If it is not loaded then it tries again after one second. It will do that for 10 times
     *
     * @private
     * @param  {String} threadId The disqus thread id
     * @param  {String} url The url of the article
     * @author Thodoris Tsiridis
     */
    var tryToLoadDisqus = function(threadId, url){
        // If the disqus plugin is loaded
        if(window.isDisqusLoaded) {

            // Show the comments Dom Element
            commentsDomElement.css('display', 'block');

            // Load the corrent comment thread
            DISQUS.reset({
              reload: true,
              config: function () {
                this.page.identifier = threadId;
                this.page.url = "http://72lions.com" + url;
              }
            });

        } else {
            // Try again only if we haven't tried 10 times before
            if(disqusCurrentLoadTries >= 0){
                setTimeout(function(){tryToLoadDisqus(threadId, url);}, 1000);
            }

            disqusCurrentLoadTries--;
        }

    };

};

seventytwolions.View.PostDetails.prototype = new seventytwolions.View.Base();
