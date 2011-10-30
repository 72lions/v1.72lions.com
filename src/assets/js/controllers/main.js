/**
 * Index Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Main = function() {

    var navigationController = null;
    var sectionsManager = null;

    this.postInitialize = function() {
        navigationController = seventytwolions.ControllerManager.initializeController('Navigation', 'navigation');
        sectionsManager = seventytwolions.ControllerManager.initializeController('SectionsManager', 'sectionsmanager');
        addEventListeners();
    };

    /**
     * Registers all event listeners
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        navigationController.addEventListener('menuClicked', onMenuClicked);
    };

    /**
     * Triggered when we get a menuClicked event from the navigation controller
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onMenuClicked = function(event){

        sectionsManager.showSectionWithName(event.path);

    };
};

seventytwolions.Controller.Main.prototype = new seventytwolions.Controller.Base();