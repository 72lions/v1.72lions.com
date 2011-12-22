/**
 * Experiments Controller
 *
 * @module 72lions
 * @class Experiments
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Experiments = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Experiments
     */
    var me = this;


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
    this.show = function() {
        this.getView().show();
    };

    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
        this.getView().hide();
    };

};

seventytwolions.Controller.Experiments.prototype = new seventytwolions.Controller.Base();
