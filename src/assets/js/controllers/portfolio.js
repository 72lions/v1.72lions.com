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

        this.setModel(seventytwolions.Lookup.getModel('Posts'));

        this.loadPosts();
        this.loadCategories();

    };

    this.loadPosts = function() {
        this.getModel().get(null, 0, 5, onPostsLoaded, this);
    };

    var onPostsLoaded = function(result) {
        var i;
        for (i = 0; i < result.length; i++) {

            portfolioItems.push(seventytwolions.ControllerManager.initializeController('PortfolioItem', 'portfolioitem' + result[i].Id, null, result));
            portfolioItems[i].render();
        }
    };

    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = seventytwolions.Lookup.getModel('Categories');
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    var onCategoriesLoaded = function(result) {

    };

};

seventytwolions.Controller.Portfolio.prototype = new seventytwolions.Controller.Base();
