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
     * @param {Object} controllerOptions The options to use when initializing the controller
     * @param {Object} viewOptions The options to use when initializing the view
     * @return {STL.Controller.Base}
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(attributes, controllerOptions, viewOptions) {
        var ctl, model, view;

        view = attributes.view || STL.Lookup.getView({type:attributes.type, id: attributes.id});
        model = attributes.model || STL.Lookup.getModel({type:attributes.type, id: attributes.id});

        ctl = STL.Lookup.getController({type:attributes.type, id:attributes.id});

        view.setController(ctl);

        ctl.setView(view);

        view.initialize(viewOptions);
        view.draw();
        view.postDraw();

        ctl.setModel(model);
        ctl.postInitialize(controllerOptions);

        return ctl;
    };

    return this;

}(window);
