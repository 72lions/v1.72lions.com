/**
 * PostDetails View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PostDetails = function() {

	this.domElement = $('.post-details');

    var me = this;
    var details = null;
    var contentDomElement = this.domElement.find('.content');
    var asideDomElement = this.domElement.find('aside');
    var titleDomElement = contentDomElement.find('h1.title');
    var categoriesDomElement = contentDomElement.find('.categories');
    var textDomElement = contentDomElement.find('.text');
    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
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
    };

    this.render = function() {
        var asideHTML, categoriesStr;
        asideHTML = categoriesStr = '';

        details = this.getModel().get('PostDetails');
        textDomElement.html(details.Content);

        // Create categories string
        categories = details.Categories;

        for (var i = 0; i < categories.length; i++) {

            categoriesStr += categories[i].Name;

            if(i < categories.length - 1){
                categoriesStr +=', ';
            }

        }
        console.log(categoriesDomElement);
        categoriesDomElement.html('Categories:' + categoriesStr);
        titleDomElement.html(details.Title);
        asideDomElement.html(asideHTML);
    };

    /**
     * Shows the view
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
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

};

seventytwolions.View.PostDetails.prototype = new seventytwolions.View.Base();
