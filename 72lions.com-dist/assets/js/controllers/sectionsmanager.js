/**
 * Index Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.SectionsManager = function() {

    var me = this;
    var initialState = Router.getState();
    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Shows a a section with a specific name
     * @param {String} section The name of the section
     * @author Thodoris Tsiridis
     */
    this.showSectionWithName = function(section){
        me.getView().showSectionWithName(section);
    };

};

seventytwolions.Controller.SectionsManager.prototype = new seventytwolions.Controller.Base();