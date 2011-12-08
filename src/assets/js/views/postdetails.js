/**
 * PostDetails View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PostDetails = function() {

	this.domElement = $('.post-details');
    this.currentId = null;

    var me = this;
    var details = null;
    var contentDomElement = this.domElement.find('.content');
    var asideDomElement = this.domElement.find('aside');
    var titleDomElement = contentDomElement.find('h1.title');
    var categoriesDomElement = contentDomElement.find('.categories');
    var textDomElement = contentDomElement.find('.text');
    var timeDomElement = contentDomElement.find('time');
    var githublinkDomElement = contentDomElement.find('.github-link');
    var downloadlinkDomElement = contentDomElement.find('.download-link');
    var demolinkDomElement = contentDomElement.find('.demo-link');

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

        var asideHTML, categoriesStr, pDate;
        asideHTML = categoriesStr = '';

        details = this.getModel().get('PostDetails'+this.currentId);
        console.log(details);
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
