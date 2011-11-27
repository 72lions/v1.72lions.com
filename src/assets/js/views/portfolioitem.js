/**
 * Portfolio Item View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PortfolioItem = function() {

    this.isFeatured = false;

    var me = this;
    var tmpl =  '<div class="photo">'+
                '<a href="${link}" title="${title}"><img src="${image}" alt="${title}" width="${imgwidth}" height="${imgheight}" /></a>'+
                '</div>'+
                '<time>${publishdate}</time>'+
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

        this.isFeatured = isFeatured;

        if(isFeatured){
            this.domElement.addClass('featured');
        } else {
            this.domElement.removeClass('featured');
        }

    };

    this.render = function() {
        var random, model, body, categories, categoriesStr, thumbnail, imgWidth, imgHeight, hasThumbnail;
        categoriesStr= '';
        hasThumbnail = false;
        model = this.getModel();
        body = tmpl;
        body = body.replace(/\${title}/g, model.get('Title'));
        body = body.replace(/\${description}/g, model.get('Description'));
        body = body.replace(/\${link}/g, model.get('Link'));
        body = body.replace(/\${publishdate}/g, model.get('PublishDate'));

        // Create categories string
        categories = model.get('Categories');
        for (var i = 0; i < categories.length; i++) {

            categoriesStr += categories[i].Name;

            if(i < categories.length - 1){
                categoriesStr +=', ';
            }

        }

        body = body.replace(/\${categories}/g, categoriesStr);

        thumbnail = model.get('Thumbnail');
        if(thumbnail.Data !== null && thumbnail.Data !== undefined){
            hasThumbnail = true;
            if(this.isFeatured){
                imgWidth = thumbnail.Data.sizes.medium.width;
                imgHeight = thumbnail.Data.sizes.medium.height;
            } else {
                imgWidth = thumbnail.Data.sizes.thumbnail.width;
                imgHeight = thumbnail.Data.sizes.thumbnail.height;
            }

            body = body.replace(/\${image}/g, 'http://192.168.0.64:9011/wp-content/uploads/' + thumbnail.File);
            body = body.replace(/\${imgwidth}/g, imgWidth);
            body = body.replace(/\${imgheight}/g, imgHeight);

        }
        //seventytwolions.Console.log('Drawing view with name ' + this.name);

        this.domElement.html(body);

        if(!hasThumbnail) {
            this.domElement.find('.photo').css('display', 'none');
        }
    };

};

seventytwolions.View.PortfolioItem.prototype = new seventytwolions.View.Base();
