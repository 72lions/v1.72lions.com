/**
 * Sections Manager Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.SectionsManager = function() {

    var me = this;
    var initialState = Router.getState();
    var portfolio, experiments, blog, contact, postDetails, sections;
    var totalSections = 4;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        portfolio = seventytwolions.ControllerManager.initializeController({
                type:'Portfolio',
                id:'portfolio',
                model: seventytwolions.Lookup.getModel({
                    type:'Posts',
                    id:'portfolioModel'
                })
        });

        experiments = seventytwolions.ControllerManager.initializeController({
            type:'Experiments',
            id:'experiments',
            model: seventytwolions.Lookup.getModel({
                id:'experimentsModel'
            })
        });

        blog = seventytwolions.ControllerManager.initializeController({
            type:'Blog',
            id:'blog',
            model: seventytwolions.Lookup.getModel({
                type:'Posts',
                id:'blogModel'
            })
        });

        /*contact = seventytwolions.ControllerManager.initializeController({
            type:'Contact',
            id:'contact',
            model: seventytwolions.Lookup.getModel({
                id:'contactModel'
            })
        });*/

        sections = [{name: 'portfolio', object: portfolio}, {name:'experiments', object: experiments}, {name:'blog', object: blog}/**, {name:'contact', object: contact}*/];

        postDetails = seventytwolions.ControllerManager.initializeController({
            type:'PostDetails',
            id:'postDetails',
            model: seventytwolions.Lookup.getModel({
                type:'Posts',
                id:'postDetailsModel'
            })
        });

    };

    /**
     * Shows a a section with a specific name
     * @param {Object} state The state of the url
     * @author Thodoris Tsiridis
     */
    this.showSectionWithName = function(state){
        var len, i, section;
        len = sections.length;

        if(state && state.pathSegments[0] == 'category'){

            section = state.pathSegments[1];

            for (i = 0; i < len; i++) {

                if(sections[i].name === section){

                    sections[i].object.show();

                } else {

                    sections[i].object.hide();

                }

            }

            postDetails.hide();

        } else if (state) {
            // if we don't have a path segment with category at its first position
            for (i = 0; i < len; i++) {
                sections[i].object.hide();
            }
            section = state.pathSegments[state.pathSegments.length - 1];
            console.log('section to load:', section);
            postDetails.load(section);

        } else {
            // First time load, so load blog
            for (i = 0; i < len; i++) {
                sections[i].object.hide();
            }

            blog.show();
        }

    };

};

seventytwolions.Controller.SectionsManager.prototype = new seventytwolions.Controller.Base();
