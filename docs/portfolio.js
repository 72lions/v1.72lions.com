/**
 * Portfolio Controller
 *
 * @module 72lions
 * @class Portfolio
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Portfolio = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Portfolio
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
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        if(!dataLoaded) {
            this.loadData();
        } else {
            this.dispatchEvent({type:'onSectionLoaded'});
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
     * Forces the model to load the posts
     *
     * @author Thodoris Tsiridis
     */
    this.loadData = function() {
        this.getModel().getPosts(7, 0, 80, onDataLoaded, this);
    };

    /**
     * Callback function that is triggered when the model posts are loaded
     *
     * @param  {Object} result The result that came back from the model
     * @author Thodoris Tsiridis
     */
    var onDataLoaded = function(result) {
        var i;
        if(typeof(this.getModel().get('Portfolio')) === 'undefined'){

            this.getModel().set('Portfolio', result);

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
                this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
            }

            this.getView().render();
        }

        dataLoaded = true;
        this.dispatchEvent({type:'onSectionLoaded'});

    };

    /**
     * Forces the model to load the categories
     *
     * @author Thodoris Tsiridis
     */
    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = STL.Lookup.getModel({
                type:'Categories',
                id:'categoriesPortfolio'
            });
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    /**
     * Callback function that is triggered when the model categories are loaded
     *
     * @param  {Object} result The result that came back from the model
     * @author Thodoris Tsiridis
     */
    var onCategoriesLoaded = function(result) {

    };

};

STL.Controller.Portfolio.prototype = new STL.Controller.Base();
