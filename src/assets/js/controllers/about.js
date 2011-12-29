/**
 * About Controller
 *
 * @module 72lions
 * @class About
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.About = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.About
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

STL.Controller.About.prototype = new STL.Controller.Base();
