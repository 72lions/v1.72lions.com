/**
 * Grid View
 *
 * @module 72lions
 * @class Grid
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Grid = function() {

    /**
     * The DOM Element
     *
     * @property {Object} domElement The DOM element
     */
   this.domElement = $('.blog');

    /**
     * The section title
     *
     * @property {String} title The section title
     */
    this.title = 'Blog';

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Blog
     */
    var me = this;

    /**
     * The items container DOM Element
     *
     * @private
     * @property {Object} itemsContainer The items container DOM Element
     * @type Object
     */
    var itemsContainer;

    /**
     * Its true the first time we load the website
     *
     * @private
     * @type Boolean
     * @default true
     */
    var isFirstTime = true;

    /**
     * The minimum columns that we can have
     *
     * @private
     * @final
     * @type Number
     * @default 1
     */
    var COLUMN_MIN = 2;

    /**
     * The column width
     *
     * @private
     * @final
     * @type Number
     * @default 218
     */
    var COLUMN_WIDTH = 218;

    /**
     * The column margin
     *
     * @private
     * @final
     * @type Number
     * @default 20
     */
    var COLUMN_MARGIN = 20;

    /**
     * The markup that will be rendered on the page
     *
     * @private
     * @type Object
     * @default ''
     */
    var markup = $('<div>');

    /**
     * Initializes the view
     *
     * @param {Object} options The options to use when initializing the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(options){
        //STL.Console.log('Initializing view with name ' + this.name);
        if(options){
            this.domElement = options.domElement || this.domElement;
            this.title = options.title || this.title;
        }

        itemsContainer = this.domElement.find('.centered');

    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //STL.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
        $(window).bind("resize", onWindowResize);
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        //STL.Console.log('Show view with name ' + this.name);
        var that = this;

        document.title = this.title + ' - ' + STL.Model.Locale.getPageTitle();

        this.domElement.addClass('active');

        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

        isFirstTime = true;
        this.positionItems();
    };
    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        //STL.Console.log('Hide view with name ' + this.name);
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     *
     * @param {Object} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        markup.append(item);
    };


    /**
     * Renders the html markup on the page
     *
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        itemsContainer.append(markup);
    };

    /**
     * Positions the grid items based on the page width
     *
     * @author Thodoris Tsiridis
     */
    this.positionItems = function() {

        var domItems = itemsContainer.find('article');
        var domItemsFeatured = itemsContainer.find('article.featured');
        var windowHeight = itemsContainer.height();
        var windowWidth = itemsContainer.width();
        var gridTop = 0;
        var gridLeft = 0;// this.domElement.offset().left;
        var items = [];
        var _7 = 0;
        var _8 = 0;
        var minColumns = Math.max(COLUMN_MIN, parseInt(windowWidth / (COLUMN_WIDTH + COLUMN_MARGIN), 0));
        var maxHeight = 0;

        if(isFirstTime){
            isFirstTime = false;
        } else {
            itemsContainer.addClass('animated');
        }

        for (x = 0; x < minColumns; x++) {
            items[x] = 0;
        }

        domItems.each(function (i, e) {
            var x, _a, _b, _c, _d = 0;
            var target_x =0;
            var target_y = 0;
            _c = (Math.floor($(e).outerWidth() / COLUMN_WIDTH));
            _b = 0;

            if (_c > 1) {

                for (x = 0; x < minColumns - (_c - 1); x++) {
                    _b = (items[x] < items[_b]) ? x : _b;
                }

                _a = _b;

                for (x = 0; x < _c; x++) {
                    _d = Math.max(_d, items[_a + x]);
                }

                for (x = 0; x < _c; x++) {
                    items[_a + x] = parseInt($(e).outerHeight(), 0) + COLUMN_MARGIN + _d;
                }

                target_x = _a * (COLUMN_WIDTH + COLUMN_MARGIN) + gridLeft;
                target_y = _d + gridTop;

                _7 = (_d > _7) ? items[_a + _c - 1] : _7;

            } else {

                for (x = 0; x < minColumns; x++) {
                    _b = (items[x] < items[_b]) ? x : _b;
                }

                target_x = _b * (COLUMN_WIDTH + COLUMN_MARGIN) + gridLeft;
                target_y = items[_b] + gridTop;
                items[_b] += $(e).outerHeight() + COLUMN_MARGIN;
                _7 = (items[_b] > _7) ? items[_b] : _7;

            }
            if(!Modernizr.mq('all and (max-width: 600px)')) {

                $(this).css({
                    left: target_x + "px",
                    top: target_y + COLUMN_MARGIN + "px"
                });

            }

            itemBottom = parseInt(target_y + COLUMN_MARGIN,0) + $(this).innerHeight();

            if(maxHeight < itemBottom){
                maxHeight = itemBottom;
            }

            _8 = (_8 < _b) ? _b : _8;

        });

        if(!Modernizr.mq('all and (max-width: 600px)')) {
            if (maxHeight > 0 ){
                itemsContainer.attr('style', 'height: ' + maxHeight + 'px');
            }
        } else {
            itemsContainer.css('height', 'auto !important');
        }

        var _f = parseInt(($('body').innerWidth() - (COLUMN_WIDTH + COLUMN_MARGIN) * (_8 + 1)) / 2, 0) - 0;
    };

    /**
     * Triggered when the window is resized
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var onWindowResize = function() {
        me.positionItems();
    };


};

STL.View.Grid.prototype = new STL.View.Base();
