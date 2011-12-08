/**
 * Portfolio Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Portfolio = function() {

    var me = this;
    var categoriesModel;
    var portfolioItems = [];

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        this.loadPosts();
        this.loadCategories();

    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.getView().show();
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.getView().hide();
    };

    /**
     * Forces the model to load the posts
     * @author Thodoris Tsiridis
     */
    this.loadPosts = function() {
        this.getModel().getPosts(7, 0, 80, onPostsLoaded, this);
    };

    /**
     * Callback function that is triggered when the model posts are loaded
     * @param  {Object} result The result that came back from the model
     * @author Thodoris Tsiridis
     */
    var onPostsLoaded = function(result) {
        var i;
        if(typeof(this.getModel().get('Portfolio')) === 'undefined'){

            this.getModel().set('Portfolio', result);

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
            }
        }

    };

    /**
     * Forces the model to load the categories
     * @author Thodoris Tsiridis
     */
    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = seventytwolions.Lookup.getModel({
                type:'Categories',
                id:'categoriesPortfolio'
            });
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    /**
     * Callback function that is triggered when the model categories are loaded
     * @param  {Object} result The result that came back from the model
     * @author Thodoris Tsiridis
     */
    var onCategoriesLoaded = function(result) {

    };

};

seventytwolions.Controller.Portfolio.prototype = new seventytwolions.Controller.Base();
