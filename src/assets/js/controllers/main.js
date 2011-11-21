/**
 * Main Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Main = function() {

    var navigationController = null;
    var sectionsManager = null;
    var initialState = Router.getState();
    var popped = ('state' in window.history);
    var initialURL = location.href;


    this.postInitialize = function() {

        navigationController = seventytwolions.ControllerManager.initializeController('Navigation', 'navigation');
        sectionsManager  = seventytwolions.ControllerManager.initializeController('SectionsManager', 'sectionsmanager');

        addEventListeners();

        onPopPushEvent(initialState);

        Router.registerForEvent('pop', onPopPushEvent);
        Router.registerForEvent('push', onPopPushEvent);

    };

    /**
     * Registers all event listeners
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        navigationController.addEventListener('menuClicked', onMenuClicked);
    };

    /**
     * Triggered when we have a pop or push event
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onPopPushEvent = function(state){

        // Catch page reload pop event that happens in some browsers
        // and disregard it
        var initialPop = !popped && location.href == initialURL;
        popped = true;
        if ( initialPop ) return;

        // Clean memory
        initialPop = null;
        initialState = null;

        var sectionName = '';

        // If the pathSegments are undefined then that
        // means that Home menu item is selected
        if(state.pathSegments === undefined){

            navigationController.getView().selectNavigationItem('portfolio');

            // Change the section
            changeSection('');

        } else {

            if(state.pathSegments.length){

                if(state.pathSegments[0] == 'category'){
                    sectionName = state.pathSegments[1];
                } else {
                    sectionName = state.pathSegments[0];
                }

            }

            // Select a specific menu item
            navigationController.getView().selectNavigationItem(sectionName);

            // Change the section
            changeSection(sectionName);

        }

        // Clean memory
        sectionName = null;
    };

    /**
     * Triggered when we get a menuClicked event from the navigation controller
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onMenuClicked = function(event){

       changeSection(event.path);

    };

    /**
     * Responsible for telling the sectionsManager to change section
     * @param {String} path The path of the section that we want to show
     * @author Thodoris Tsiridis
     */
    var changeSection = function(path){

        sectionsManager.showSectionWithName(path);
    };
};

seventytwolions.Controller.Main.prototype = new seventytwolions.Controller.Base();
