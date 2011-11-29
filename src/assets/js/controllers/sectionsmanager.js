/**
 * Sections Manager Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.SectionsManager = function() {

    var me = this;
    var initialState = Router.getState();
    var portfolio, experiments, blog, about, contact, sections;
    var totalSections = 4;

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

        sections = [{name: 'portfolio', object: portfolio}, {name:'experiments', object: experiments}, {name:'blog', object: blog}, {name:'about', object: about}, {name:'contact', object: contact}];

    };

    /**
     * Shows a a section with a specific name
     * @param {String} section The name of the section
     * @author Thodoris Tsiridis
     */
    this.showSectionWithName = function(section){
        var len, i;
        len = sections.length;

        section = section === '' ? 'blog' : section;

        for (i = 0; i < len; i++) {
            if(sections[i].name === section){
                sections[i].object.show();
            } else {
                if(section !== 'about'){
                    sections[i].object.hide();
                }
            }
        }

    };

};

seventytwolions.Controller.SectionsManager.prototype = new seventytwolions.Controller.Base();
