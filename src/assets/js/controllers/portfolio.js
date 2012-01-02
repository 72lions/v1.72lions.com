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
     * Forces the model to load the posts
     *
     * @author Thodoris Tsiridis
     */
    this.loadData = function() {
        if(typeof(this.getModel().get('Portfolio')) === 'undefined'){
            this.dispatchEvent({type:'onDataStartedLoading'});
            this.getModel().getPosts(7, 0, 80, onDataLoaded, this);
        } else {
             onDataLoaded.call(this, this.getModel().get('Portfolio'));
        }
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

        this.getView().show();
        this.dispatchEvent({type:'onSectionLoaded'});

    };

};

STL.Controller.Portfolio.prototype = new STL.Controller.Base();
