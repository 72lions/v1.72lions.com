/**
 * Main Controller
 *
 * @module 72lions
 * @class Main
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
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

        navigationController = seventytwolions.ControllerManager.initializeController({
            type:'Navigation',
            id:'navigation',
            model: seventytwolions.Lookup.getModel({})
        });
        sectionsManager  = seventytwolions.ControllerManager.initializeController({
            type:'SectionsManager',
            id:'sectionsmanager',
            model: seventytwolions.Lookup.getModel({})
        });

        onPopPushEvent(initialState);

        Router.registerForEvent('pop', onPopPushEvent);
        Router.registerForEvent('push', onPopPushEvent);

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

            navigationController.getView().selectNavigationItem('blog');

            // Change the section
            changeSection();

        } else {

            if(state.pathSegments.length){

                // Select a specific menu item
                navigationController.getView().selectNavigationItem(state.pathSegments[state.pathSegments.length - 1]);

                // Change the section
                changeSection(state);

            }

        }

        // Clean memory
        sectionName = null;
    };

    /**
     * Responsible for telling the sectionsManager to change section
     * @param {Object} state The path of the section that we want to show
     * @author Thodoris Tsiridis
     */
    var changeSection = function(state){
        sectionsManager.showSectionWithName(state);
    };
};

seventytwolions.Controller.Main.prototype = new seventytwolions.Controller.Base();
