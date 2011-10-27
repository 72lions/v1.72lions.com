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

        var path = Router.getState().pathSegments;

        if(path.length){
            if(path[0] == 'category'){
                path = path[1];
            } else {
                path = path[0];
            }
        }

        // Highlight the clicked menu item
        me.getView().selectNavigationItem(path);

        path = null;

    };

    /**
     * Triggered when we have a pop or push event
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onPopPushEvent = function(state){

        var path = '';

        // Check if it is a page refresh
        if(state.isRefresh === true){
            // If the pathSegments are undefined then that
            // means that Home menu item is selected
            if(state.pathSegments === undefined){
                me.getView().selectNavigationItem('');
            } else {

                if(state.pathSegments.length){

                    if(state.pathSegments[0] == 'category'){
                        path = state.pathSegments[1];
                    } else {
                        path = state.pathSegments[0];
                    }

                }

                // Select a specific menu item
                me.getView().selectNavigationItem(path);
            }

        }

        path = null;
    };
};

seventytwolions.Controller.Navigation.prototype = new seventytwolions.Controller.Base();