/**
 * Home View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Navigation = function(name) {

    var $links;
    var me = this;

	this.setName(name);
	this.domElement = $('.navigation');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        seventytwolions.Console.log('Initializing view with name ' + this.name);

        $links = this.domElement.find('a');
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        seventytwolions.Console.log('Post draw view with name ' + this.name);
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
     * @private
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        $links.bind('click', onLinkClick);
    };

    /**
     * Triggered when we click a link
     * @private
     * @author Thodoris Tsiridis
     */
    var onLinkClick = function(e){
        e.preventDefault();

        // Cache the item
        var $item = $(this);

        // Dispatch the event
        me.dispatchEvent({type: 'menuClicked', path:$item.attr('href'), title:$item.attr('title')});

        // Clear memory
        $item = null;
    };

};

seventytwolions.View.Navigation.prototype = new seventytwolions.View.Base();