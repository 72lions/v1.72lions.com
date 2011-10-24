/**
 * Index Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Main = function() {

    this.postInitialize = function() {
        seventytwolions.ControllerManager.initializeController('Navigation');
    }
}

seventytwolions.Controller.Main.prototype = new seventytwolions.Controller.Base();