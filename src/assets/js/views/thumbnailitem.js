/**
 * Portfolio Item View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.ThumbnailItem = function() {

    this.isFeatured = false;

    var me = this;
    var tmpl = '<div class="photo">'+
                    '<a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a>'+
                    '<a href="${link}" title="${title}"><img src="${image}" alt="${title}" width="${imgwidth}" height="${imgheight}" /></a>'+
                '</div>'+
                '<div class="description">'+
                    '<hgroup><a href="${link}" title="${title}"><h1>${title}</h1></a></hgroup>'+
                    '<time>${publishdate}</time>'+
                    '<aside>Categories: ${categories}</aside>'+
                    '<p>'+
                    '${description}'+
                    '</p>' +
                    '<a href="${link}" title="${title}" class="readmore">Read more</a>'+
                '</div>';

	this.domElement = $('<li class="portfolio-item clearfix"></li>');

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

        var random, model, meta, body, pdate, categories, categoriesStr, thumbnail, imgWidth, imgHeight, hasThumbnail;
        categoriesStr= '';
        hasThumbnail = false;
        model = this.getModel();
        body = tmpl;

        meta = model.get('Meta');

        if(meta.showcase !== undefined){
            this.setAsFeatured(true);
        }

        body = body.replace(/\${title}/g, model.get('Title'));
        body = body.replace(/\${description}/g, model.get('Description'));
        body = body.replace(/\${link}/g, model.get('Link'));

        //Firefox doesn't like dates with / in the constructor
        pDate = new Date(model.get('PublishDate').replace(/-/g ,'/'));

        body = body.replace(/\${publishdate}/g, seventytwolions.Model.Locale.getDayName(pDate.getDay()) + ', ' +  seventytwolions.Model.Locale.getMonthName(pDate.getMonth()) + ' ' + pDate.getDate() +  ' ' + pDate.getFullYear());

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
        if(meta.github !== undefined){
            body = body.replace(/\${github}/g, meta.github);
        }

        this.domElement.html(body);

        if(meta.github !== undefined){
          this.domElement.find('.github-ribbon').css('display', 'block');
        }

        if(!hasThumbnail) {
            this.domElement.find('.photo').css('display', 'none');
        }


        addEventListeners();

    };

    /**
     * Shows the description of the item
     * @author Thodoris Tsiridis
     */
    this.showDescription = function() {
        this.domElement.find('p').css('display','block');
    };

    /**
     * Hides the description of the item
     * @author Thodoris Tsiridis
     */
    this.hideDescription = function() {
        this.domElement.find('p').css('display','none');
    };

    /**
     * Registers all the events
     */
    var addEventListeners = function() {
        me.domElement.find('a').bind('click', onThumbnailClicked);
    };

    /**
     * Triggered when we click the thumbnail
     * @param  {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onThumbnailClicked = function(event) {
        var model, pubDate, slug, url;

        event.preventDefault();
        model = me.getModel();

        pubDate = model.get('PublishDate');
        slug = model.get('Slug');
        pubDate = new Date(pubDate.replace(/-/g ,'/'));

        url = pubDate.getFullYear() + '/' + (pubDate.getMonth() + 1) + '/' + slug;

        // Push the current url
        Router.push(null, $(this).attr('title'), '/' + url);

    };

};

seventytwolions.View.ThumbnailItem.prototype = new seventytwolions.View.Base();