/**
 * Portfolio Item View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PortfolioItem = function() {

    var me = this;
    var tmpl = '<div class="photo">'+
                '${image}'+
                '</div>'+
                '<hgroup><a href="${link}" title="${title}"><h1>${title}</a></h1></hgroup>'+
                '<aside>Categories: ${categories}</aside>'+
                '<p>'+
                '${description}'+
                '<!--<a href="${link}" title="${title}">Read more...</a>-->'+
                '</p>';

	this.domElement = $('<li class="portfolio-item"></li>');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name + ', ' + this.id);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		var random, model, body, categories, categoriesStr;
        categoriesStr= '';
        model = this.getModel();
        body = tmpl;

        body = body.replace(/\${title}/g, model.get('Title'));
        body = body.replace(/\${description}/g, model.get('Description'));
        body = body.replace(/\${link}/g, model.get('Link'));

        // Create categories
        categories = model.get('Categories');
        for (var i = 0; i < categories.length; i++) {

            categoriesStr += categories[i].Name;

            if(i < categories.length - 1){
                categoriesStr +=', ';
            }

        }

        body = body.replace(/\${categories}/g, categoriesStr);

        //seventytwolions.Console.log('Drawing view with name ' + this.name);

        this.domElement.html(body);

	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Sets the current item as featured item
     * @param {Boolean} isFeatured Set to true if we need to render it as a featured item
     * @author Thodoris Tsiridis
     */
    this.setAsFeatured = function(isFeatured){

        if(isFeatured){
            this.domElement.addClass('featured');
        } else {
            this.domElement.removeClass('featured');
        }

    };

};

seventytwolions.View.PortfolioItem.prototype = new seventytwolions.View.Base();
