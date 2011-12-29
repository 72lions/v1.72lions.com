/**
 * Navigation View
 *
 * @module 72lions
 * @class Navigation
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Navigation = function() {

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
     * @type STL.View.Navigation
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('.navigation');

    /**
     * The clicked DOM Element
     *
     * @type Object
     * @default undefined
     */
    this.clickedItem = undefined;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
        $links = this.domElement.find('a');
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
     * Hightlits a menu item
     * @param {String} section The name of the section that we want to highlight
     * @author Thodoris Tsiridis
     */
    this.selectNavigationItem = function(section) {
        section = section === '' ? 'home' : section;
        this.domElement.find('.nav-' + section).parent().addClass('active').siblings().removeClass('active');
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
        var $item;

        e.preventDefault();

        // Cache the item
        $item = me.clickedItem = $(this);

        // Check if the item that was clicked was the logo
        // and if it was use a delay so that we first scroll up
        if($item.hasClass('logo')){
            delay = 200;
            // Scroll to top
            $('body,html').stop().animate({scrollTop:0}, delay, 'easeOutQuint');
        } else {
            delay = 0;
        }

        setTimeout(function(){
            // Dispatch the event
            me.dispatchEvent({type: 'menuClicked', path: me.clickedItem.attr('href'), title: me.clickedItem.attr('title')});
        }, delay + 100);

        // Clear memory
        $item = null;
    };

};

STL.View.Navigation.prototype = new STL.View.Base();
