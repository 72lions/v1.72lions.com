/**
 * Main Controller
 *
 * @module 72lions
 * @class Main
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Main = function() {

    /**
     * A reference to the navigation controller
     *
     * @private
     * @type STL.Controller.NaviMaingation
     * @default null
     */
    var navigationController = null;

    /**
     * A reference to the sections manager controller
     *
     * @private
     * @type STL.Controller.SectionsManager
     * @default null
     */
    var sectionsManager = null;

    /**
     * A reference to the footer controller
     *
     * @private
     * @type STL.Controller.Footer
     * @default null
     */
    var footerController = null;

    /**
     * The initial state of the website
     *
     * @private
     * @type Object
     */
    var initialState = Router.getState();

    /**
     * Its true if there is a state object in the windows history. Chrome triggers a popstate on load so that is true
     *
     * @private
     * @type Boolean
     */
    var popped = ('state' in window.history);

    /**
     * The page url upon loading
     *
     * @private
     * @type String
     */
    var initialURL = location.href;

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function() {

        navigationController = STL.ControllerManager.initializeController({
            type:'Navigation',
            id:'navigation',
            model: STL.Lookup.getModel({})
        });


        sectionsManager  = STL.ControllerManager.initializeController({
            type:'SectionsManager',
            id:'sectionsmanager',
            model: STL.Lookup.getModel({})
        });

        sectionsManager.addEventListener('onSectionLoaded', onSectionLoaded);
        sectionsManager.addEventListener('onChangeSectionDispatched', onChangeSectionDispatched);

        footerController  = STL.ControllerManager.initializeController({
            type:'Footer',
            id:'Footer',
            model: STL.Lookup.getModel({
               type: 'Footer',
               id: 'footter'
            })
        });

        onPopPushEvent(initialState);

        Router.registerForEvent('pop', onPopPushEvent);
        Router.registerForEvent('push', onPopPushEvent);

    };

    /**
     * Triggered when we have a pop or push event
     *
     * @private
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onPopPushEvent = function(state){
        var initialPop, sectionName;

        // Catch page reload pop event that happens in some browsers
        // and disregard it
        initialPop = !popped && location.href == initialURL;
        popped = true;
        //alert(initialPop + ", " + popped);
        //if ( initialPop ) return;

        // Clean memory
        initialPop = null;
        initialState = null;

        sectionName = '';

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
     *
     * @private
     * @param {Object} state The path of the section that we want to show
     * @author Thodoris Tsiridis
     */
    var changeSection = function(state){
        sectionsManager.showSectionWithName(state);
    };

    var onSectionLoaded = function(){
        footerController.show();
    };

    var onChangeSectionDispatched = function(){
        footerController.hide();
    };
};

STL.Controller.Main.prototype = new STL.Controller.Base();
