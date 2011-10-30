/**
 * Home View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.SectionsManager = function(name) {

    var me = this;

	this.setName(name);
	this.domElement = $('#wrapper');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        seventytwolions.Console.log('Initializing view with name ' + this.name);
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
    };

    /**
     * Shows a a section with a specific name
     * @param {String} section The name of the section
     * @author Thodoris Tsiridis
     */
    this.showSectionWithName = function(section){

        // Make sure that we have the correct section
        section = section === '' ? 'portfolio' : section;

        // Get the offset of the target section
        var sectionOffset = me.domElement.find('section.' + section).css('left');

        // Move the wrapper so that the correct section is visible
        me.domElement.css('left','-' + sectionOffset);

        // Clean memory
        sectionOffset = null;

    };

};

seventytwolions.View.SectionsManager.prototype = new seventytwolions.View.Base();