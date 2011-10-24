/**
 * Base Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Base = function() {

    var _view, _model, _registeredEvents = {};

    this.data = {};
    this.name = '';

    this.initialize = function(name, data) {

        this.name = name;
        this.data = data || {};

        // get a reference to view
        _view = seventytwolions.Lookup.getView(name);

        // get a reference to the model
        _model = seventytwolions.Lookup.getModel(name);

        // ask it to initialize, draw and postDraw
        _view.initialize();
        _view.draw();
        _view.postDraw();
    };

    this.postInitialize = function() {
        console.log('post initialize')

    }

    /**
     * Returns the view of the specific controller
     * @returns A view
     * @type seventytwolions.View.Base
     * @author Thodoris Tsiridis
     */
    this.getView = function() {
        return _view;
    };

    /**
     * Returns the model of the specific controller
     * @returns A view
     * @type seventytwolions.Model.Base
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return _model;
    };

    /**
     * Notifies for a specific event. Usually this will be triggered by the view
     * @param {String} eventName The name of the event
     * @author Thodoris Tsiridis
     */
    this.notify = function(eventName){
        if(typeof(_registeredEvents[eventName]) !== 'null' && typeof(_registeredEvents[eventName]) !== 'undefined'){
            _registeredEvents[eventName]();
        }
    };

    /**
     * Registers a callback function for a specific event.
     * This way the view can talk to the controller
     * @param {String} eventName The name of the event
     * @param {Function} callback The function to be executed
     * @author Thodoris Tsiridis
     */
    this.registerEvent = function(eventName, callback){

        if(typeof(_registeredEvents[eventName]) == 'null' || typeof(_registeredEvents[eventName]) == 'undefined'){
            _registeredEvents[eventName] = [];
        }

        _registeredEvents[eventName].push(callback);

    };

}