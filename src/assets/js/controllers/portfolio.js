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

        this.setModel(seventytwolions.Lookup.getModel('Posts','posts'));

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

    this.loadPosts = function() {
        this.getModel().get(7, 0, 20, onPostsLoaded, this);
    };

    var onPostsLoaded = function(result) {
        var i;

        for (i = 0; i < result.length; i++) {
            portfolioItems.push(seventytwolions.ControllerManager.initializeController({type:'ThumbnailItem', id:'ThumbnailItem' + result[i].Id, model:result[i]}));
            this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);

            portfolioItems[i].getView().render();
        }

        this.getView().positionItems();
    };

    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = seventytwolions.Lookup.getModel('Categories', 'categories');
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    var onCategoriesLoaded = function(result) {

    };

};

seventytwolions.Controller.Portfolio.prototype = new seventytwolions.Controller.Base();
