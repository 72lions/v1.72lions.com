/**
 * Portfolio Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Portfolio = function() {

    var me = this;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){
        var model;
        model = seventytwolions.Lookup.getModel('Posts');
        this.setModel(model);

        this.loadPosts();
    };

    this.loadPosts = function() {
        console.log(this.getModel());
        this.getModel().get(33, onPostsLoaded);
    };

    var onPostsLoaded = function(result) {
        console.log(result);
    };

};

seventytwolions.Controller.Portfolio.prototype = new seventytwolions.Controller.Base();
