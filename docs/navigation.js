/**
 * Navigation Controller
 *
 * @module 72lions
 * @class Navigation
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Navigation = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Navigation
     */
    var me = this;

    /**
     * This function is executed right after the initialized
     *
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        me.getView().addEventListener('menuClicked', onMenuItemClicked);

    };

    /**
     * Triggered when the view dispatches a menuClicked event
     *
     * @private
     * @param {Object} event The event object
     * @author Thodoris Tsiridis
     */
    var onMenuItemClicked = function(event){

        // Push the current url
        Router.push(null, event.title + ' - ' + STL.Model.Locale.getPageTitle(), event.path);

    };

};

STL.Controller.Navigation.prototype = new STL.Controller.Base();
