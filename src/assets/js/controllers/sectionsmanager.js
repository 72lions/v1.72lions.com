/**
 * Sections Manager Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.SectionsManager = function() {

    var me = this;
    var initialState = Router.getState();
    var portfolio, experiments, blog, about, contact;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){
        portfolio = seventytwolions.ControllerManager.initializeController({type:'Portfolio', id:'portfolio'});
        experiments = seventytwolions.ControllerManager.initializeController({type:'Experiments', id:'experiments'});
        blog = seventytwolions.ControllerManager.initializeController({type:'Blog', id:'blog'});
        about = seventytwolions.ControllerManager.initializeController({type:'About', id:'about'});
        contact = seventytwolions.ControllerManager.initializeController({type:'Contact', id:'contact'});
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
