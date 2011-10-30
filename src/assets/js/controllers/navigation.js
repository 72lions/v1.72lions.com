/**
 * Index Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Navigation = function() {

    var me = this;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        Router.registerForEvent('pop', onPopPushEvent);
        Router.registerForEvent('push', onPopPushEvent);

        me.getView().addEventListener('menuClicked', onMenuItemClicked);

    };

    /**
     * Triggered when the view dispatches a menuClicked event
     * @param {Object} event The event object
     * @author Thodoris Tsiridis
     */
    var onMenuItemClicked = function(event){

        // Push the current url
        Router.push(null, event.title, '/' + event.path);

    };

    /**
     * Triggered when we have a pop or push event
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onPopPushEvent = function(state){

        var sectionName = '';

        // If the pathSegments are undefined then that
        // means that Home menu item is selected
        if(state.pathSegments === undefined){

            me.getView().selectNavigationItem('portfolio');

            // Dispatch the event so that the parent controller can get it
            me.dispatchEvent({type: 'menuClicked', path:''});

        } else {

            if(state.pathSegments.length){

                if(state.pathSegments[0] == 'category'){
                    sectionName = state.pathSegments[1];
                } else {
                    sectionName = state.pathSegments[0];
                }

            }

            // Select a specific menu item
            me.getView().selectNavigationItem(sectionName);

            // Dispatch the event so that the parent controller can get it
            me.dispatchEvent({type: 'menuClicked', path:sectionName});

        }

        // Clean memory
        sectionName = null;
    };
};

seventytwolions.Controller.Navigation.prototype = new seventytwolions.Controller.Base();