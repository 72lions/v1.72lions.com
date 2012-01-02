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

        this.loadData();

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
        if(typeof(this.getModel().get(modelName)) === 'undefined'){
            this.dispatchEvent({type:'onDataStartedLoading'});
            this.getModel().getPosts(categoryId, 0, 80, onDataLoaded, this);
        } else {
             onDataLoaded.call(this, this.getModel().get(modelName));
        }

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

        this.dispatchEvent({type:'onSectionLoaded'});
        this.getView().show();

    };

};

STL.Controller.Blog.prototype = new STL.Controller.Base();
