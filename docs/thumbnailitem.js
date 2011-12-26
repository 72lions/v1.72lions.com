/**
 * ThumbnailItem View
 *
 * @module 72lions
 * @class ThumbnailItem
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.ThumbnailItem = function() {

    /**
     * If the thumbnail item is of type featured then this value is set to true
     *
     * @type Boolean
     * @default false
     */
    this.isFeatured = false;

    /**
     * The DOM Element
     *
     * @type Object
     */
    this.domElement = $('<article class="portfolio-item clearfix"></article>');

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.ThumbnailItem
     */
    var me = this;

    /**
     * The path to the images
     *
     * @private
     * @type String
     * @default 'http://72lions.com/wp-content/uploads/'
     */
    var IMAGES_PATH = 'http://72lions.com/wp-content/uploads/';

    /**
     * The HTML template for the thumbnail item
     *
     * @private
     * @type String
     * @default '<div class="photo"><a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a><a href="${link}" title="${title}"><img class="thumbnail-image" src="${image}" alt="${title}" width="${imagewidth}" height="${imageheight}"  /></a></div><div class="description"><hgroup><a href="${link}" title="${title}" class="title"><h1>${title}</h1></a></hgroup><time>${publishdate}</time><aside>Categories: ${categories}</aside><p>${description}</p><a href="${link}" title="${title}" class="readmore">Read more</a></div>'
     */
    var tmpl = '<div class="photo">'+
                    '<a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a>'+
                    '<a href="${link}" title="${title}"><img class="thumbnail-image" src="${image}" alt="${title}" width="${imagewidth}" height="${imageheight}"  /></a>'+
                '</div>'+
                '<div class="description">'+
                    '<hgroup><a href="${link}" title="${title}" class="title"><h1>${title}</h1></a></hgroup>'+
                    '<time>${publishdate}</time>'+
                    '<aside>Categories: ${categories}</aside>'+
                    '<p>'+
                    '${description}'+
                    '</p>' +
                    '<a href="${link}" title="${title}" class="readmore">Read more</a>'+
                '</div>';




    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name + ', ' + this.id);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {

	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Sets the current item as featured item
     *
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

   /**
     * Renders the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        var random, month, model, meta, body, pdate, url, slug, categories, categoriesStr, thumbnail, imgWidth, imgHeight, hasThumbnail, thumbnailFile;

        categoriesStr= '';
        hasThumbnail = false;
        model = this.getModel();
        body = tmpl;

        meta = model.get('Meta');
        if(meta && meta.showcase !== undefined){
            this.setAsFeatured(true);
        }

        //Firefox doesn't like dates with / in the constructor
        pDate = new Date(model.get('PublishDate').replace(/-/g ,'/'));
        body = body.replace(/\${publishdate}/g, seventytwolions.Model.Locale.getDayName(pDate.getDay()) + ', ' +  seventytwolions.Model.Locale.getMonthName(pDate.getMonth()) + ' ' + pDate.getDate() +  ' ' + pDate.getFullYear());

        slug = model.get('Slug');

        month = (pDate.getMonth() + 1);
        month = month.toString().length === 1 ? '0' + month : month;

        url = '/' + pDate.getFullYear() + '/' + month + '/' + slug;

        body = body.replace(/\${title}/g, model.get('Title'));
        body = body.replace(/\${description}/g, model.get('Description'));
        body = body.replace(/\${link}/g, url);

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
        thumbnailFile = thumbnail.File.split('/');
        thumbnailFile = thumbnailFile[0] + '/' + thumbnailFile[1] + '/';

        if(thumbnail.Data !== null && thumbnail.Data !== undefined){

            hasThumbnail = true;

            thumbnailFile += thumbnail.Data.sizes.medium.file;

            if(this.isFeatured){
                imgWidth = parseInt(thumbnail.Data.sizes.medium.width, 0) + 6;
                imgHeight = parseInt(thumbnail.Data.sizes.medium.height, 0) + 6;

            } else {
                imgWidth = parseInt(thumbnail.Data.sizes.thumbnail.width, 0) + 6;
                imgHeight = parseInt(thumbnail.Data.sizes.thumbnail.height, 0) + 6;
                //thumbnailFile += thumbnail.Data.sizes.thumbnail.file;
            }

            body = body.replace(/\${image}/g, IMAGES_PATH + thumbnailFile);
            // Plus 6 for the border
            body = body.replace(/\${imagewidth}/g, imgWidth);
            body = body.replace(/\${imageheight}/g, imgHeight);

        }
        //seventytwolions.Console.log('Drawing view with name ' + this.name);
        if(meta && meta.github !== undefined){
            body = body.replace(/\${github}/g, meta.github);
        }

        this.domElement.html(body);

        if(meta.github !== undefined){
          this.domElement.find('.github-ribbon').css('display', 'block');
        } else {
            this.domElement.find('.github-ribbon').remove();
        }

        if(!hasThumbnail) {
            this.domElement.find('.photo').remove();
        }

        addEventListeners();

    };

    /**
     * Shows the description of the item
     *
     * @author Thodoris Tsiridis
     */
    this.showDescription = function() {
        this.domElement.find('p').css('display','block');
    };

    /**
     * Hides the description of the item
     *
     * @author Thodoris Tsiridis
     */
    this.hideDescription = function() {
        this.domElement.find('p').css('display','none');
    };

    /**
     * Registers all the events
     *
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function() {
        me.domElement.find('a').bind('click', onThumbnailClicked);
    };

    /**
     * Triggered when we click the thumbnail
     *
     * @private
     * @param  {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onThumbnailClicked = function(event) {
        var model, pubDate, slug, url, month, title;

        // Prevent the default functionality
        event.preventDefault();

        // Get the model
        model = me.getModel();

        // Create the link by using the publish date and the slug
        pubDate = model.get('PublishDate');
        slug = model.get('Slug');
        pubDate = new Date(pubDate.replace(/-/g ,'/'));
        month = (pubDate.getMonth() + 1);
        month = month.toString().length === 1 ? '0' + month : month;

        url = pubDate.getFullYear() + '/' + month + '/' + slug;
        title = $(this).attr('title') + ' - 72Lions - Thodoris Tsiridis - Web developer';

        // Push the current url
        Router.push(null, title, '/' + url);

        // Move to top
        window.scrollTo(0, 0);

    };

};

seventytwolions.View.ThumbnailItem.prototype = new seventytwolions.View.Base();
