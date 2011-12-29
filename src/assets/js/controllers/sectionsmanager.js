/**
 * Sections Manager Controller
 *
 * @module 72lions
 * @class SectionsManager
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.SectionsManager = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.SectionsManager
     */
    var me = this;

    /**
     * The initial state of the website
     *
     * @private
     * @type Object
     */
    var initialState = Router.getState();

    /**
     * The Portfolio Controller
     *
     * @private
     * @type STL.Controller.Portfolio
     * @property portfolio
     * @default undefined
     */
    var portfolio;

    /**
     * The Experiments Controller
     *
     * @private
     * @type STL.Controller.Experiments
     * @property experiments
     * @default undefined
     */
    var experiments;

    /**
     * The Blog Controller
     *
     * @private
     * @type STL.Controller.Blog
     * @property blog
     * @default undefined
     */
    var blog;

    /**
     * The initial state of the website
     *
     * @private
     * @type STL.Controller.Contact
     * @property contact
     * @default undefined
     */
    var contact;

    /**
     * The Post Details Controller
     *
     * @private
     * @type STL.Controller.PostDetails
     * @property postDetails
     * @default undefined
     */
    var postDetails;

    /**
     * The array that will hold all the sections
     *
     * @private
     * @type Array
     * @property sections
     * @default undefined
     */
    var sections;

    /**
     * The number of total sections
     *
     * @private
     * @type Number
     * @default 4
     */
    var totalSections = 4;

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        portfolio = STL.ControllerManager.initializeController({
                type:'Portfolio',
                id:'portfolio',
                model: STL.Lookup.getModel({
                    type:'Posts',
                    id:'portfolioModel'
                })
        });

        experiments = STL.ControllerManager.initializeController({
            type:'Experiments',
            id:'experiments',
            model: STL.Lookup.getModel({
                id:'experimentsModel'
            })
        });

        blog = STL.ControllerManager.initializeController({
            type:'Blog',
            id:'blog',
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'blogModel'
            })
        });

        sections = [{name: 'portfolio', object: portfolio}, {name:'experiments', object: experiments}, {name:'blog', object: blog}];

        postDetails = STL.ControllerManager.initializeController({
            type:'PostDetails',
            id:'postDetails',
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'postDetailsModel'
            })
        });

    };

    /**
     * Shows a a section with a specific name
     *
     * @param {Object} state The state of the url
     * @author Thodoris Tsiridis
     */
    this.showSectionWithName = function(state){
        var len, i, section;

        len = sections.length;

        if(state && state.pathSegments[0] == 'category'){
            // Trackk ajax calls with google analytics
            _gaq.push(['_trackPageview', '/' + state.path]);

            section = state.pathSegments[1];

            for (i = 0; i < len; i++) {

                if(sections[i].name === section){

                    sections[i].object.show();

                } else {

                    sections[i].object.hide();

                }

            }

            postDetails.hide();

        } else {

            if (state) {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/' + state.path]);

                // if we don't have a path segment with category at its first position
                for (i = 0; i < len; i++) {
                    sections[i].object.hide();
                }

                section = state.pathSegments[state.pathSegments.length - 1];
                postDetails.load(section);

            } else {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/']);

                postDetails.hide();
                for (i = 0; i < len; i++) {

                    if(sections[i].name !== 'blog'){
                        sections[i].object.hide();
                    }

                }

                blog.show();

            }



        }

    };

};

STL.Controller.SectionsManager.prototype = new STL.Controller.Base();
