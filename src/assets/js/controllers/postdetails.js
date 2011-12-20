/**
 * PostDetails Controller
 *
 * @module 72lions
 * @class PostDetails
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.PostDetails = function() {

    var me = this;
    this.currentId = null;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Loads a page or post from the model
     * @param  {String} sectionSlug The name of the page's slug
     * @author Thodoris Tsiridis
     */
    this.load = function(sectionSlug) {
        if(this.currentId !== sectionSlug){
            this.currentId = sectionSlug;

            if(typeof(this.getModel().get('PostDetails'+this.currentId)) !== 'undefined'){
                onPostDetailsLoaded.call(this, this.getModel().get('PostDetails'+this.currentId));
            } else {
                this.getModel().getDetails(sectionSlug, onPostDetailsLoaded, this);
            }


        }
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function() {
        this.getView().show();
    };

    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
        this.getView().hide();
        this.currentId = null;
    };

    var onPostDetailsLoaded = function(result) {
        this.getModel().set('PostDetails'+this.currentId, result);
        this.getView().currentId = this.currentId;
        this.getView().render();
        this.show();
    };

};

seventytwolions.Controller.PostDetails.prototype = new seventytwolions.Controller.Base();
