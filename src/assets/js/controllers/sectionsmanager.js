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
     * The Tag Controller
     *
     * @private
     * @type STL.Controller.Tag
     * @property tag
     * @default undefined
     */
    var tag;

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
     * The current section name
     *
     * @private
     * @type String
     * @default '-'
     */
    var currentSection = '-';

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        // Initializing the portfolio controller, view and model
        portfolio = STL.ControllerManager.initializeController({
                type:'Portfolio',
                id:'portfolio',
                model: STL.Lookup.getModel({
                    type:'Posts',
                    id:'portfolioModel'
                })
        });

        portfolio.addEventListener('onSectionLoaded', onSectionLoaded);
        portfolio.addEventListener('onDataStartedLoading', onDataStartedLoading);

        // Initializing the experiments controller, view and model
        experiments = STL.ControllerManager.initializeController({
            type:'Grid',
            id:'experiments',
            view: STL.Lookup.getView({type:'Grid', id: 'experiments'}),
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'experimentsModel'
            })
        },
        {categoryId:4, modelName:'Experiments'},
        {domElement: $('.experiments'), title:'Experiments'});

        experiments.addEventListener('onSectionLoaded', onSectionLoaded);
        experiments.addEventListener('onDataStartedLoading', onDataStartedLoading);

        // Initializing the blog controller, view and model
        blog = STL.ControllerManager.initializeController({
            type:'Grid',
            id:'blog',
            view: STL.Lookup.getView({type:'Grid', id: 'blog'}),
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'blogModel'
            })
        },
        {categoryId:3, modelName:'Blog'},
        {domElement: $('.blog'), title:'Blog'});

        blog.addEventListener('onSectionLoaded', onSectionLoaded);
        blog.addEventListener('onDataStartedLoading', onDataStartedLoading);

        sections = [{name: 'portfolio', object: portfolio}, {name:'experiments', object: experiments}, {name:'blog', object: blog}];

        // Initializing the article details controller, view and model
        postDetails = STL.ControllerManager.initializeController({
            type:'PostDetails',
            id:'postDetails',
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'postDetailsModel'
            })
        });

        postDetails.addEventListener('onSectionLoaded', onSectionLoaded);
        postDetails.addEventListener('onDataStartedLoading', onDataStartedLoading);

        // Initializing the experiments controller, view and model
        tag = STL.ControllerManager.initializeController({
            type:'Grid',
            id:'tag',
            view: STL.Lookup.getView({type:'Grid', id: 'tag'}),
            model: STL.Lookup.getModel({
                type:'Tag',
                id:'tagsModel'
            })
        },
        {categoryId:4, modelName:'Tag'},
        {domElement: $('.tag'), title:'Tag'});

        tag.addEventListener('onSectionLoaded', onSectionLoaded);
        tag.addEventListener('onDataStartedLoading', onDataStartedLoading);

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

            //If this is the same section then don't do anything
            if (currentSection === section) {
                return;
            }

            currentSection = section;

            for (i = 0; i < len; i++) {

                if(sections[i].name === section){

                    this.dispatchEvent({type:'onChangeSectionDispatched'});
                    sections[i].object.show();

                } else {

                    sections[i].object.hide();

                }

            }

            postDetails.hide();
            tag.hide();

        } else {

            if (state) {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/' + state.path]);

                if(state.pathSegments[0] === 'tag') {

                    section = state.pathSegments[state.pathSegments.length - 2];
                    tagId = state.pathSegments[state.pathSegments.length - 1];

                    //If this is the same section then don't do anything
                    if (currentSection === section) {
                        return;
                    }

                    currentSection = section;

                    // if we don't have a path segment with category at its first position
                    for (i = 0; i < len; i++) {
                        sections[i].object.hide();
                    }

                    this.dispatchEvent({type:'onChangeSectionDispatched'});
                    postDetails.hide();

                    tag.loadData(tagId);


                } else {

                    section = state.pathSegments[state.pathSegments.length - 1];

                    //If this is the same section then don't do anything
                    if (currentSection === section) {
                        return;
                    }

                    currentSection = section;

                    // if we don't have a path segment with category at its first position
                    for (i = 0; i < len; i++) {
                        sections[i].object.hide();
                    }

                    this.dispatchEvent({type:'onChangeSectionDispatched'});
                    postDetails.load(section);
                }


            } else {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/']);

                section = 'blog';

                //If this is the same section then don't do anything
                if (currentSection === section) {
                    return;
                }

                currentSection = section;

                postDetails.hide();

                for (i = 0; i < len; i++) {

                    if(sections[i].name !== 'blog'){
                        sections[i].object.hide();
                    }

                }

                this.dispatchEvent({type:'onChangeSectionDispatched'});
                blog.show();

            }

        }

    };

    /**
     * Triggered when a section dispatches a onSectionLoaded event
     *
     * @private
     * @param {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onSectionLoaded = function(event){
        me.dispatchEvent({type:'onSectionLoaded'});
        me.getView().hidePreloader();
    };

    /**
     * Triggered when a section dispatches a onDataStartedLoading event
     *
     * @private
     * @param {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onDataStartedLoading = function (event){
        me.getView().showPreloader();
    };

};

STL.Controller.SectionsManager.prototype = new STL.Controller.Base();
