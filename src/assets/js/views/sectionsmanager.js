/**
 * Sections Manager View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.SectionsManager = function() {

    var me = this;

	this.domElement = $('#sections-wrapper');

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

    /**
     * Shows a a section with a specific name
     * @param {String} section The name of the section
     * @author Thodoris Tsiridis
     */
    this.showSectionWithName = function(section){
        var targetSection;
        // Make sure that we have the correct section
        section = section === '' ? 'portfolio' : section;
        targetSection = me.domElement.find('section.' + section);
        // Get the offset of the target section
        targetSection.addClass('active').siblings().removeClass('active');
        setTimeout(function(){
            targetSection.css('opacity', 1).siblings().css('opacity', 0);
        }, 10);

    };

};

seventytwolions.View.SectionsManager.prototype = new seventytwolions.View.Base();
