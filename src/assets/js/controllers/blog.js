/**
 * Blog Controller
 *
 * @module 72lions
 * @class Blog
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Blog = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Blog
     */
    var me = this;

    /**
     * The categories Model
     *
     * @private
     * @type STL.Model.Categories
     * @property categoriesModel
     * @default undefined
     */
    var categoriesModel;

    /**
     * An array with all the portfolio items
     *
     * @private
     * @type Array
     * @default []
     */
    var portfolioItems = [];

    /**
     * The id of the blog category
     *
     * @private
     * @type Number
     * @default 3
     */
    var categoryId = 3;

    /**
     * The name of the data from the model
     *
     * @private
     * @type String
     * @default 'Blog'
     */
    var modelName = 'Blog';

    /**
     * Is set to true when the data for this page are loaded
     *
     * @private
     * @type Boolean
     * @default false
     */
    var dataLoaded = false;

    /**
     * This function is executed right after the initialized function is called
     *
     * @param {Object} options The options to use when initialing the controller
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(options){

        if(options){
            modelName = options.modelName || modelName;
            categoryId = options.categoryId || categoryId;
        }

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        if(!dataLoaded) {
            this.loadData();
        }
        this.getView().show();
    };
    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.getView().hide();
    };

    /**
     * Loads the data from the model
     *
     * @author Thodoris Tsiridis
     */
    this.loadData = function() {
        this.getModel().getPosts(categoryId, 0, 80, onDataLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onDataLoaded = function(result) {
        var i;

        if(typeof(this.getModel().get(modelName)) === 'undefined'){

            this.getModel().set(modelName, result);

            for (i = 0; i < result.length; i++) {

                portfolioItems.push(
                    STL.ControllerManager.initializeController({
                        type:'ThumbnailItem',
                        id:'ThumbnailItem' + result[i].Id,
                        model: STL.Lookup.getModel({
                            data:result[i]
                        })
                     })
                );


                portfolioItems[i].getView().render();
                portfolioItems[i].getView().showDescription();
                this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
            }

            this.getView().render();
        }

        dataLoaded = true;
        this.getView().positionItems();
        this.dispatchEvent({type:'onSectionLoaded'});

    };

    /**
     * Loads the categories from the api
     *
     * @private
     * @author Thodoris Tsiridis
     */
    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = STL.Lookup.getModel({
                type:'Categories',
                id:'categoriesBlog'
            });
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onCategoriesLoaded = function(result) {

    };
};

STL.Controller.Blog.prototype = new STL.Controller.Base();
