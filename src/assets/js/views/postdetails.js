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
    var contentDomElement = this.domElement.append('<div class="content"></div>');
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
        details = this.getModel().get('PostDetails');
        contentDomElement.html(details.Content);
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
        contentDomElement.html('');
        this.domElement.removeClass('active').css('opacity', 0);
    };

};

seventytwolions.View.PostDetails.prototype = new seventytwolions.View.Base();
