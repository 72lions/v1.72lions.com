/**
 * Blog Controller
 *
 * @module 72lions
 * @class Blog
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Blog = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Blog
     */
    var me = this;

    /**
     * The categories Model
     *
     * @private
     * @type seventytwolions.Model.Categories
     * @default undefined
     */
    var categoriesModel = undefined;

    /**
     * An array with all the portfolio items
     *
     * @private
     * @type Array
     * @default []
     */
    var portfolioItems = [];

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){
        this.loadBlogPosts();
        //this.loadCategories();

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
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
    this.loadBlogPosts = function() {
        this.getModel().getPosts(3, 0, 80, onBlogPostsLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onBlogPostsLoaded = function(result) {
        var i;

        if(typeof(this.getModel().get('Blog')) === 'undefined'){

            this.getModel().set('Blog', result);

            for (i = 0; i < result.length; i++) {

                portfolioItems.push(
                    seventytwolions.ControllerManager.initializeController({
                        type:'ThumbnailItem',
                        id:'ThumbnailItem' + result[i].Id,
                        model: seventytwolions.Lookup.getModel({
                            data:result[i]
                        })
                     })
                );

                this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
                portfolioItems[i].getView().render();
                portfolioItems[i].getView().showDescription();
            }

        }

        this.getView().positionItems();
    };

    /**
     * Loads the categories from the api
     *
     * @private
     * @author Thodoris Tsiridis
     */
    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = seventytwolions.Lookup.getModel({
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

seventytwolions.Controller.Blog.prototype = new seventytwolions.Controller.Base();
