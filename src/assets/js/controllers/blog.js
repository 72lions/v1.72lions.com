/**
 * Blog Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Blog = function() {

    var me = this;
    var categoriesModel;
    var portfolioItems = [];

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        this.setModel(seventytwolions.Lookup.getModel('Posts','blogpostsmodel'));

        this.loadBlogPosts();
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

    this.loadBlogPosts = function() {
        this.getModel().get(3, 0, 20, onBlogPostsLoaded, this);
    };

    var onBlogPostsLoaded = function(result) {
        var i;

        for (i = 0; i < result.length; i++) {
            portfolioItems.push(seventytwolions.ControllerManager.initializeController({type:'ThumbnailItem', id:'ThumbnailItem' + result[i].Id, model:result[i]}));
            this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);

            portfolioItems[i].getView().render();
            portfolioItems[i].getView().showDescription();
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

seventytwolions.Controller.Blog.prototype = new seventytwolions.Controller.Base();
