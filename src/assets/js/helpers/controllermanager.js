/**
 * The controller manager is responsible for instantiating controllers
 *
 * @module 72lions
 * @class ControllerManager
 * @namespace STL
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.ControllerManager = function(global) {

    /**
     * Initializes a controller with a specific type, id, view and model
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @param {STL.Model.Base} attributes.model The model to be used by this controller
     * @param {STL.View.Base} attributes.view The view to be used by this controller
     * @return {STL.Controller.Base}
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(attributes) {
        var ctl;

        ctl = STL.Lookup.getController({type:attributes.type, id:attributes.id});

        ctl.setView(attributes.view || STL.Lookup.getView({type:attributes.type, id: attributes.id}));
        ctl.setModel(attributes.model || STL.Lookup.getModel({type:attributes.type, id: attributes.id}));

        ctl.postInitialize();

        return ctl;
    };

    return this;

}(window);
