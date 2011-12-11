/**
 * Component loader
 *
 * The component loaded is responsible for identifying all the components
 * by searching the DOM tree and it then creates and instanciates all the
 * components
 *
 * @author Thodoris Tsiridis
 * @version 1
 * @requires jQuery
 */
seventytwolions.componentloader = function(){

	// Declaring the API
	var api = {};

	// Private variables
	var registeredComponents				= {};
	var initializedComponents				= {};
	var id									= '';

	// jQuery DOM elements
	var $defaultContext						= $('body');

	/**
	* Initializes the component loader
	* @param {jQuery DOM Element} $context
	* @private
	* @author Thodoris Tsiridis
	*/
	var initializeComponents = function($context){

		// Check if a context is provided else use the default one
		$context = $context || $defaultContext;

		// Loop through all the items that have the component class
		$context.find('.component').each(function(i,e){

			// Cache the items
			var $item = $(this);
			var className = $item.data('class');

			// Check if there is a class data attribute defined
			if(typeof(className) !== 'undefined' && typeof(className) !== 'null' ){

				// Check if there is a class with that name registered
				if(typeof(registeredComponents[className]) !== 'undefined' && typeof(registeredComponents[className]) !== 'null'){

					// Instantiate the component
					var component = new registeredComponents[className]($item);
					var randomId = 'seventytwolions' + className + '' + Math.floor(Math.random() * 1000000);
					component.id = randomId;

					// Save that object for future reference
					initializedComponents[randomId] = component;

					// Initialize the component
					component.initialize();

					// Clean memory
					randomId = null;

				}

			}

			// Clean memory
			className = null;
			$item = null;

		});

	};

	/**
	 * Returns an instance of a instanciated component
	 * @private
	 * @param {String} id The id of the instance
	 * @returns The instance of a function
	 * @type {Function}
	 * @author Thodoris Tsiridis
	 */
	var getComponentInstanceById = function(id){

		// Check if there is a component instanciated with that id
		if(typeof(initializedComponents[id]) !== undefined && typeof(initializedComponents[id]) !== null){

			return initializedComponents[id];

		} else {

			return null;

		}
	};

	/**
	 * Registers a component with the component loader
	 * @private
	 * @param {String} name The name of the component
	 * @param {Funcion} component The component itself
	 * @author Thodoris Tsiridis
	 */
	var registerComponent = function(name, component){

		// If the specific component is not registered then
		if( typeof(registeredComponents[name]) === 'undefined' || typeof(registeredComponents[name]) === 'null' ){

			// Instantiate the component and cache it
			registeredComponents[name] =  component;

		} else {
			seventytwolions.Console.log('This class name is already registered');
		}

	};

	// Exposing functions
	api.registerComponent = registerComponent;
	api.initializeComponents = initializeComponents;
	api.getComponentInstanceById = getComponentInstanceById;

	// Exposing vars
	api.id = id;

	// Return the api
	return api;

};

// Instantiate the component loader so that we can use it as a singleton
seventytwolions.ComponentLoader = new seventytwolions.componentloader();
