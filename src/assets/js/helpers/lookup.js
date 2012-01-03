/**
 * Lookup up utility that loads or creates controllers, views and models
 *
 * @module 72lions
 * @class Lookup
 * @namespace STL
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Lookup = function(global) {

    /**
     * An object holding all the different models
     *
     * @private
     * @type Object
     */
    var _models         = {};

    /**
     * An object holding all the different views
     *
     * @private
     * @type Object
     */
    var _views          = {};

    /**
     * An object holding all the different controllers
     *
     * @private
     * @type Object
     */
    var _controllers    = {};

    /**
     * Returns a controller with a specific name
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @returns A controller
     * @type STL.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.getController = function(attributes) {
        var className, id, model, controllerObj;
        var exists = -1;

        className = attributes.type || 'Base';
        id = attributes.id || ('_id_' + Math.floor(Math.random()*10000).toString());

        // Check if there is an array with objects of className type
        // If not then create a new array
        if(!_controllers[className] || !$.isArray(_controllers[className])) {
            _controllers[className] = [];
        }

        // Loop through al the items in the array
        // to check if an item with this id already exists
        for (var i = _controllers[className].length - 1; i >= 0; i--) {
            if(_controllers[className][i].id == id){
                exists = i;
                break;
            }
        }

        if(exists === -1){

            // Check if the class that we want to load exists
            if(STL.Controller[className] !== undefined){
                controllerObj = {id: id, classType: new STL.Controller[className]()};
            } else {
                // Create a generic controller
                controllerObj = {id: id, classType: new STL.Controller.Base()};
            }

            _controllers[className].push(controllerObj);
            controllerObj.classType.initialize({type:attributes.type, id:attributes.id});
            return controllerObj.classType;

        } else {

            return _controllers[className][exists].classType;
        }

    };

    /**
     * Returns a view with a specific name
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @returns A view
     * @type STL.View.Base
     * @author Thodoris Tsiridis
     */
    this.getView = function(attributes) {
        var exists = -1, viewObj, id, className;
        className = attributes.type || 'Base';
        id = attributes.id || ('_id_' + Math.floor(Math.random()*10000).toString());

        // Check if there is an array with objects of className type
        // If not then create a new array
        if(!_views[className] || !$.isArray(_views[className])) {
            _views[className] = [];
        }

        // Loop through al the items in the array
        // to check if an item with this id already exists
        for (var i = _views[className].length - 1; i >= 0; i--) {
            if(_views[className][i].id == id){
                exists = i;
            }
        }

        if(exists === -1){

            exists = null;

            // Check if the class that we want to load exists
            if(STL.View[className] !== undefined){
                viewObj = {id: id, classType: new STL.View[className]()};
            } else {
                viewObj = {id: id, classType: new STL.View.Base()};
            }

            _views[className].push(viewObj);
            viewObj.classType.preInitialize(attributes);
            return viewObj.classType;

        } else {
            return _views[className][exists].classType;
        }
    };

    /**
     * Returns a model with a specific name
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @param {Object} attributes.data The data of the model
     * @returns A model
     * @type STL.Model.Base
     * @author Thodoris Tsiridis
     */
    this.getModel = function(attributes) {
        var exists = -1, modelObj, name, modelData;
        modelData = attributes.data || {};
        name = attributes.type || 'Base';
        id = attributes.id || ('_id_' + Math.floor(Math.random()*10000).toString());

        // Check if there is an array with objects of className type
        // If not then create a new array
        if(!_models[name] || !$.isArray(_models[name])) {
            _models[name] = [];
        }

        // Loop through al the items in the array
        // to check if an item with this id already exists
        for (var i = _models[name].length - 1; i >= 0; i--) {
            if(_models[name][i].id == id){
                exists = i;
            }
        }

        if(exists === -1){

            exists = null;

            // Check if the class that we want to load exists
            if(STL.Model[name] !== undefined){
                modelObj = {id: id, classType: new STL.Model[name]()};
            } else {
                modelObj = {id: id, classType: new STL.Model.Base()};
            }

            _models[name].push(modelObj);

            modelObj.classType.setName(name);
            modelObj.classType.setId(id);
            modelObj.classType.setData(modelData);

            return modelObj.classType;

        } else {
            return _models[name][exists].classType;
        }
    };

    return this;

}(window);
