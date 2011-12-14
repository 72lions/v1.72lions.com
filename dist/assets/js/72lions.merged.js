/** Routing manager is responsible for listening to popstates in order to dispatch events
 * Clients can register their interest on these events
 *
 * @author Thodoris Tsiridis
 * @version 0.2
 */
var router = function(){

	var isRefresh = true;
	var registeredMembers = { push: [], pop: []};
	var registeredPathMembers = {};
	var currentState = null;
	var hashChangeIntervalId = null;
	var currentHash = '';
	var isHistoryAPISupported = true;

	this.basePath = '';
	this.hashListenInterval = 500;

	/**
	 * Pushes a new state on the history api
	 * @public
	 * @param {Ojbect} state The state; could be a JSON object that is passed on the popstate
	 * @param {String} title The title of the page. Most browsers don't use it yet
	 * @param {String} url The url that we need to push
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	this.push = function(state, title, url){

		// Change the title
		document.title = title;

		if(isHistoryAPISupported){

			history.pushState(state, title, this.basePath + url);

		}

		//Get the state
		currentState = getState();

		//Notify all the members that there was a push event
		notifyRegisteredMembers('push');

		// If History API is supported then push the path
		if(isHistoryAPISupported){
			notifyRegisteredPathChangeMembers(currentState.path);
		} else {
			// Else push the hash
			notifyRegisteredPathChangeMembers(currentState.hash);
		}

	};

	/**
	 * Replaces the current state with a new state
	 * @public
	 * @param {Ojbect} state The state; could be a JSON object that is passed on the popstate
	 * @param {String} title The title of the page. Most browsers don't use it yet
	 * @param {String} url The url that we need to push
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	this.replace = function(state, title, url){

		if(isHistoryAPISupported){

			history.replaceState(state, title, this.basePath + url);

		}

		//Get the state
		currentState = getState();

		//Notify all the members that there was a push event
		notifyRegisteredMembers('push');

		// If History API is supported then push the path
		if(isHistoryAPISupported){
			notifyRegisteredPathChangeMembers(currentState.path);
		} else {
			// Else push the hash
			notifyRegisteredPathChangeMembers(currentState.hash);
		}

	};

	/**
	 * Registers a specific callback to a specific event
	 * @public
	 * @param {String} eventType The name of the event e.x. push, pop
	 * @param {Function} callback The function to execute
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	this.registerForEvent = function(eventType, callback){

		// Check if it already registered by going through all registered callbacks
		// for this event
		var alreadyRegistered = false;

		for (var i = registeredMembers[eventType].length - 1; i >= 0; i--) {

			if(registeredMembers[eventType][i] === callback){
				alreadyRegistered = true;
				break;
			}
		}

		if(!alreadyRegistered){
			registeredMembers[eventType].push(callback);
		}

		// Clear memory
		alreadyRegistered = null;
	};

	/**
	 * Registers a specific callback to a specific path
	 * @public
	 * @param {String} path The name of the event e.x. segment1/segment2
	 * @param {Function} callback The function to execute
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	this.registerForPathChange = function(path, callback, priority){

		//Save a valid value for the priority
		priority = priority || 0;

		//Adding the basepath also in the path
		path = this.basepath + path;

		// Check if it already registered by going through all registered callbacks
		// for this event
		var alreadyRegistered = false;

		var cache = registeredPathMembers[path];

		if(cache !== undefined){

			for (var i = cache.length - 1; i >= 0; i--) {

				if( cache[i].callback === callback){
					alreadyRegistered = true;
					break;
				}

			}

		} else {
			registeredPathMembers[path] = [];
		}

		if(!alreadyRegistered){
			registeredPathMembers[path].push( { callback: callback, priority: priority } );
			sortRegisteredPathMembers(path);
		}

		// Clear memory
		cache = null;
		alreadyRegistered = null;

	};

	/**
	 * It goes back in history
	 * @public
	 * @param {Integer} steps The number of steps that you want to go backwards
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	this.goBack = function(steps){
		history.go(0 - (steps === null || steps === undefined ? 1 : steps));
	};

	/**
	 * It goes forward in history
	 * @public
	 * @param {Integer} steps The number of steps that you want to go forward
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	this.goForward = function(steps){
		history.go(steps === null || steps === undefined ? 1 : steps);
	};
	/**
	 * It returns the state of the object
	 * @public
	 * @returns
	 * @type Object
	 * @author Thodoris Tsiridis
	 */
	this.getState = function(){
		return getState();
	};

	/**
	 * This is function is triggered on a window popstate
	 * @private
	 * @param {Object} e The object returned from the event
	 *
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var onPopstate = function(e) {

		//Get the state
		currentState = getState();

		// If the popstate runs again then it will not be a refresh but a push
		// Only the first time of a pop state we know for sure that it is a refresh
		if(isRefresh){
			isRefresh = false;
		}

		//Notify all the members that there was a pop state
		notifyRegisteredMembers('pop');

		// If History API is supported then push the path
		if(isHistoryAPISupported){
			notifyRegisteredPathChangeMembers(currentState.path);
		} else {
			// Else push the hash
			notifyRegisteredPathChangeMembers(currentState.hash);
		}
	};

	/**
	 * Gets the current state by reading the URL
	 * @private
	 * @returns Returns an object with the following keys
	 *		{String} domain The domain of the url
	 *		{String} hash The hashs value if it exists. If not then it is null
	 *		{Array} hashSegments An array with all the hashes if more than one
	 *		{Boolean} isRefresh If the state was poped after a refresh the value is true
	 *		{String} path The url path
	 *		{Array} pathSegments An array with all the path segments
	 *		{String} port The port of the url
	 *		{String} query The query that follows the ?
	 *		{String} url The full URL
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var getState = function(){

		var tempState = parseURL(location.href);
		tempState.isRefresh = isRefresh;

		return tempState;
	};

	/**
	 * Notifies all the registered members
	 * @private
	 * @param {String} eventType The name of the event e.x. push, pop
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var notifyRegisteredMembers = function(eventType) {

		var members = registeredMembers[eventType];

		for (var i = members.length - 1; i >= 0; i--) {
			members[i](currentState);
		}

		// Clear memory
		members = null;
	};

	/**
	 * Notifies all the registered members when a path change happens
	 * @private
	 * @param {String} path The path e.x. segment1/segment2
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var notifyRegisteredPathChangeMembers = function(path){

		var members = registeredPathMembers[this.basepath + path];

		if(members !== undefined){

			for (var i = members.length - 1; i >= 0; i--) {
				members[i].callback(currentState);
			}

		}

		members = null;
	};

	/**
	 * Sorts the array based on priority
	 * @private
	 * @param {String} path The path e.x. segment1/segment2
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var sortRegisteredPathMembers = function(path){
		var cache = registeredPathMembers[path];
		cache.sort(sortByPriority);
		cache = null;

	};

	/**
	 * Performs a check to see if the hash has changed and triggers then onPopstate function
	 * @private
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var checkHashChange = function(){

		var hash = getState().hash;

		if (currentHash !== hash) {
			currentHash = hash;
			onPopstate(null);
		}

	};

	/**
	 * Parses a url and returns an object containing the folowing data (if found):
	 *
	 * protocol, domain, post, path and path segments, hash and hash segments, query
	 * string and an object containing a key/value pair representation of the query
	 *
	 * @public
	 * @param {String} url The url that we need to parse
	 * @returns {Object} The object containing the different segments from the parsed URL
	 * @author Justin Windle
	 */
	var parseURL = function( url ) {

		url = unescape( url );

		// remove protocol, domain and port
		var cut = url.replace( /^(http(s)?:\/\/)?[^\/]+\/?/i, '' );

		// try to match patterns for the data we need
		var parse = {

			protocol: url.match( /^(http(s)?):\/\//i ),
			domain: url.match( /^(http(s)?:\/\/)?([^\/:]+)/i ),
			query: url.match( /\?([\w\+\-\=&]+)/ ),
			port: url.match( /\w:(\d{1,5})/ ),
			hash: url.match( /#([\w\-\/]+)/ ),
			path: cut.match( /^\/?([\w\-\/\.]+)/ )

		};

		// Create a result form any matches returned
		var result = {

			protocol: parse.protocol ? parse.protocol[1] : null,
			domain: parse.domain ? parse.domain[3] : null,
			query: parse.query ? parse.query[1] : null,
			port: parse.port ? parse.port[1] : null,
			hash: parse.hash ? parse.hash[1] : null,
			path: parse.path ? parse.path[1] : null,
			 url: url /* return the unescaped url */

		};

		// Split the path into segments
		if( result.path ) {
			result.pathSegments = result.path.replace( /^\/|\/$/g, '' ).split( '/' );
		}

		// Split the hash into segments
		if( result.hash ) {
			result.hashSegments = result.hash.replace( /^\/|\/$/g, '' ).split( '/' );
		}

		// Parse the query parameters
		if( result.query ) {

			result.params = {};

			var regex = /([\w\+\-]+)\=([\w\+\-]+)/g;
			var param = regex.exec( result.query );

			while( param ) {
				result.params[ param[1] ] = param[2];
				param = regex.exec( result.query );
			}

		}

		return result;
	};

	/**
	 * Checks if the history API is supported
	 * @public
	 * @returns A Boolean value
	 * @type Boolean
	 * @author Thodoris Tsiridis
	 */
	var supportsHistoryAPI = function(){
		return !!(window.history && history.pushState);
	};

	/**
	 * Checks if the onhashchange is supported
	 * @public
	 * @returns A Boolean value
	 * @type Boolean
	 * @author Thodoris Tsiridis
	 */
	var supportsHashChange = function(){
		return !!(window.onhashchange);
	};

	/**
	 * Sorts an array based on the priority key
	 * @public
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var sortByPriority = function(a, b){
		var x = parseInt(a.priority, 0);
		var y = parseInt(b.priority, 0);
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	};

	/**
	 * Initalizes the utility
	 * @public
	 * @returns
	 * @type void
	 * @author Thodoris Tsiridis
	 */
	var init = function(){

		// Check if the browser supports the History API
		if(supportsHistoryAPI()){

			window.onpopstate = onPopstate;

		} else {

			// Use hashes instead
			isHistoryAPISupported = false;

			if(supportsHashChange()){

				window.onhashchange = onPopstate;

			} else {

				// Listen for changes at specific intervals
				hashChangeIntervalId = setInterval(function(){
					checkHashChange();
				}, this.hashListenInterval);

			}
		}
	};

	init();

};

var Router = new router();

/**
 * @author mr.doob / http://mrdoob.com/
 */

var EventTarget = function () {

    var listeners = {};

    this.addEventListener = function ( type, listener ) {

        if ( listeners[ type ] === undefined ) {

            listeners[ type ] = [];

        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {

            listeners[ type ].push( listener );

        }

    };

    this.dispatchEvent = function ( event ) {

        for ( var listener in listeners[ event.type ] ) {

            listeners[ event.type ][ listener ]( event );

        }

    };

    this.removeEventListener = function ( type, listener ) {

        var index = listeners[ type ].indexOf( listener );

        if ( index !== - 1 ) {

            listeners[ type ].splice( index, 1 );

        }

    };

};
var seventytwolions = {};
seventytwolions.Controller = seventytwolions.Controller || {};
seventytwolions.View = seventytwolions.View || {};
seventytwolions.Model = seventytwolions.Model || {};
seventytwolions.Model.locale = function(){

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var pageTitle = "72Lions - The playground of developer Thodoris Tsiridis";
    /**
     * Returns the name of the month
     * @param  {Number} monthIndex The month index
     * @return {String}
     */
    this.getMonthName = function(monthIndex){
        return months[monthIndex];
    };

    /**
     * Returns the name of a day of the week
     * @param  {Number} dayIndex The day of the week index
     * @return {String}
     */
    this.getDayName = function(dayIndex){
        return days[dayIndex];
    };

    /**
     * Returns the title of the page
     * @return {String}
     */
    this.getPageTitle = function (){
        return pageTitle;
    };

};

seventytwolions.Model.Locale = new seventytwolions.Model.locale();

/**
 * Controller Manager
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.controllerManager = function() {

    var newController;
    this.data = null;

    /**
     * Initializes a controller with a specific name
     * @param {Object} object The parameters
     * @returns A controller
     * @type seventytwolions.Controller.Base
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(object) {
        return seventytwolions.Lookup.getController(object);
    };

};

// Instantiate the controller manager so that we can use it as a singleton
seventytwolions.ControllerManager = new seventytwolions.controllerManager();

/**
 * Lookup for models views and controllers
 * Initializes or returns new controllers, views or models
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.lookup = function() {

    var _models         = {},
        _views          = {},
        _controllers    = {};

    /**
     * Returns a controller with a specific name
     * @param {String} className The name of the controllers
     * @param {String} id The unique id for this controller
     * @param {String} viewClassName The name of a different view
     * @param {Object} model The model that we want to use
     * @returns A controller
     * @type seventytwolions.Controller.Base
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

            exists = null;
            // Check if the class that we want to load exists
            if(seventytwolions.Controller[className] !== undefined){
                controllerObj = {id: id, classType: new seventytwolions.Controller[className]()};
            } else {
                // Create a generic controller
                controllerObj = {id: id, classType: new seventytwolions.Controller.Base()};
            }

            _controllers[className].push(controllerObj);
            controllerObj.classType.initialize(attributes);
            return controllerObj.classType;

        } else {

            return _controllers[className][exists].classType;
        }

    };

    /**
     * Returns a view with a specific name
     * @param {String} name The name of the controllers
     * @param {String} id The unique id for this controller
     * @returns A view
     * @type seventytwolions.View.Base
     * @author Thodoris Tsiridis
     */
    this.getView = function(className, id) {
        var exists = -1, viewObj;

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
            if(seventytwolions.View[className] !== undefined){
                viewObj = {id: id, classType: new seventytwolions.View[className]()};
            } else {
                viewObj = {id: id, classType: new seventytwolions.View.Base()};
            }

            _views[className].push(viewObj);
            viewObj.classType.preInitialize(className, id);
            return viewObj.classType;

        } else {
            return _views[className][exists].classType;
        }
    };

    /**
     * Returns a model with a specific name
     * @param {String} name The name of the controllers
     * @param {Object} modelData The data of the model
     * @returns A model
     * @type seventytwolions.Model.Base
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
            if(seventytwolions.Model[name] !== undefined){
                modelObj = {id: id, classType: new seventytwolions.Model[name]()};
            } else {
                modelObj = {id: id, classType: new seventytwolions.Model.Base()};
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
};

// Instantiate the lookup so that we can use it as a singleton
seventytwolions.Lookup = new seventytwolions.lookup();

seventytwolions.console = function(){

	// Declaring the API
	var api = {};

	api.debug = true;

	/**
	 * Logs out a message
	 * @private
	 * @param Multiple arguments
	 * @returns Nothing
	 * @type null
	 * @author Thodoris Tsiridis
	 */
	var log = function() {

		if(api.debug){
			/*console.log(arguments)*/;
		}

	};

	// Exposing functions
	api.log = log;

	// Return the api
	return api;

};

// Instantiate the model so that we can use it as a singleton
seventytwolions.Console = new seventytwolions.console();
/**
 * Base View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Base = function() {

    EventTarget.call( this );

    this.name = null;
    this.id = null;
    this.model = null;
    this.domElement = null;

    /**
     * Function for when showing the view
     * @author Thodoris Tsiridis
     */
    this.show = function() {
    };

    /**
     * Function for when hiding the view
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
    };

    /**
     * Sets the name of the view
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the name of the view
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setId = function(id) {
        this.id = id;
    };

    /**
     * Sets the model for the view
     * @param {seventytwolions.models.Base} model The model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
        this.model = model;
    };

    /**
     * Gets the model for the view
     * @return The model
     * @type {seventytwolions.Model.Base}
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return this.model;
    };

    /**
     * Returns the main dom element of the view
     * @returns A DOM element
     * @type jQuery DOM element
     * @author Thodoris Tsiridis
     */
    this.getDOMElement = function() {
        return this.domElement;
    };

    /**
     * Is triggered before initialization of the view
     * @author Thodoris Tsiridis
     */
    this.preInitialize = function(name, id) {
        this.setName(name);
        this.setId(id);
    };

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize = function(){

    };

    /**
     * Draws the view
     * @author Thodoris Tsiridis
     */
    this.draw = function(){

    };

    /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw = function(){

    };

};

seventytwolions.Model.Base = function(){

    var data = {};
    this.name = '';
    this.id = '';

    /**
     * Sets the model data
     * @param {Object} modelData The model data
     * @author Thodoris Tsiridis
     */
    this.setData = function(modelData) {
        data = modelData;
    };

    /**
     * Sets the name of the model
     * @param {String} name The name/type of the model
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the id of the model
     * @param {String} id The id of the model
     * @author Thodoris Tsiridis
     */
    this.setId = function (id) {
        this.id = id;
    };

    this.set = function(key, value) {
        data[key] = value;
    };

    this.get = function(key) {
        return data[key];
    };

};


/**
 * Base Controller
 * @param {String} className the name of the class that we initialized
 * @param {String} id The unique id of this class
 * @param {String} viewClassName The class of the view (in case we want a different view)
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Base = function() {

    EventTarget.call( this );
    var _view, _model, _registeredEvents = {};

    this.id = '';
    this.name = '';
    this.model = undefined;

    /**
     * Initializes the plugin
     * @author Thodoris Tsiridis
     */
    this.initialize = function(attributes) {

        this.id = attributes.id || id;
        this.name = attributes.type || '';

        // Get a reference to the view
        _view = attributes.view || seventytwolions.Lookup.getView(this.name, this.id);
        // get a reference to the model
        _model = this.model = attributes.model;

        // ask it to set the model, initialize, draw and postDraw
        _view.setModel(_model);
        _view.initialize();
        _view.draw();
        _view.postDraw();
        this.postInitialize();

    };

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function() {

    };

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
     * Sets the model of the controller
     * @param {seventytowlions.Model.Base} model The new model
     */
    this.setModel = function(model) {
      _model = model;
      _view.setModel(model);
    };

};

/**
 * Main Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Main = function() {

    var navigationController = null;
    var sectionsManager = null;
    var initialState = Router.getState();
    var popped = ('state' in window.history);
    var initialURL = location.href;

    this.postInitialize = function() {

        navigationController = seventytwolions.ControllerManager.initializeController({
            type:'Navigation',
            id:'navigation',
            model: seventytwolions.Lookup.getModel({})
        });
        sectionsManager  = seventytwolions.ControllerManager.initializeController({
            type:'SectionsManager',
            id:'sectionsmanager',
            model: seventytwolions.Lookup.getModel({})
        });

        onPopPushEvent(initialState);

        Router.registerForEvent('pop', onPopPushEvent);
        Router.registerForEvent('push', onPopPushEvent);

    };

    /**
     * Triggered when we have a pop or push event
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onPopPushEvent = function(state){
        // Catch page reload pop event that happens in some browsers
        // and disregard it
        var initialPop = !popped && location.href == initialURL;
        popped = true;
        if ( initialPop ) return;

        // Clean memory
        initialPop = null;
        initialState = null;

        var sectionName = '';

        // If the pathSegments are undefined then that
        // means that Home menu item is selected
        if(state.pathSegments === undefined){

            navigationController.getView().selectNavigationItem('blog');

            // Change the section
            changeSection();

        } else {

            if(state.pathSegments.length){

                // Select a specific menu item
                navigationController.getView().selectNavigationItem(state.pathSegments[state.pathSegments.length - 1]);

                // Change the section
                changeSection(state);

            }

        }

        // Clean memory
        sectionName = null;
    };

    /**
     * Responsible for telling the sectionsManager to change section
     * @param {Object} state The path of the section that we want to show
     * @author Thodoris Tsiridis
     */
    var changeSection = function(state){
        sectionsManager.showSectionWithName(state);
    };
};

seventytwolions.Controller.Main.prototype = new seventytwolions.Controller.Base();

/**
 * Navigatio Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Navigation = function() {

    var me = this;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        me.getView().addEventListener('menuClicked', onMenuItemClicked);

    };

    /**
     * Triggered when the view dispatches a menuClicked event
     * @param {Object} event The event object
     * @author Thodoris Tsiridis
     */
    var onMenuItemClicked = function(event){

        // Push the current url
        Router.push(null, event.title + ' - ' + seventytwolions.Model.Locale.getPageTitle(), '/' + event.path);

    };

};

seventytwolions.Controller.Navigation.prototype = new seventytwolions.Controller.Base();

/**
 * Sections Manager Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.SectionsManager = function() {

    var me = this;
    var initialState = Router.getState();
    var portfolio, experiments, blog, contact, postDetails, sections;
    var totalSections = 4;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        portfolio = seventytwolions.ControllerManager.initializeController({
                type:'Portfolio',
                id:'portfolio',
                model: seventytwolions.Lookup.getModel({
                    type:'Posts',
                    id:'portfolioModel'
                })
        });

        experiments = seventytwolions.ControllerManager.initializeController({
            type:'Experiments',
            id:'experiments',
            model: seventytwolions.Lookup.getModel({
                id:'experimentsModel'
            })
        });

        blog = seventytwolions.ControllerManager.initializeController({
            type:'Blog',
            id:'blog',
            model: seventytwolions.Lookup.getModel({
                type:'Posts',
                id:'blogModel'
            })
        });

        sections = [{name: 'portfolio', object: portfolio}, {name:'experiments', object: experiments}, {name:'blog', object: blog}/**, {name:'contact', object: contact}*/];

        postDetails = seventytwolions.ControllerManager.initializeController({
            type:'PostDetails',
            id:'postDetails',
            model: seventytwolions.Lookup.getModel({
                type:'Posts',
                id:'postDetailsModel'
            })
        });

    };

    /**
     * Shows a a section with a specific name
     * @param {Object} state The state of the url
     * @author Thodoris Tsiridis
     */
    this.showSectionWithName = function(state){
        var len, i, section;

        len = sections.length;

        if(state && state.pathSegments[0] == 'category'){
            // Trackk ajax calls with google analytics
            _gaq.push(['_trackPageview', '/' + state.path]);

            section = state.pathSegments[1];

            for (i = 0; i < len; i++) {

                if(sections[i].name === section){

                    sections[i].object.show();

                } else {

                    sections[i].object.hide();

                }

            }

            postDetails.hide();

        } else {

            if (state) {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/' + state.path]);

                // if we don't have a path segment with category at its first position
                for (i = 0; i < len; i++) {
                    sections[i].object.hide();
                }

                section = state.pathSegments[state.pathSegments.length - 1];
                postDetails.load(section);

            } else {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/']);

                postDetails.hide();
                for (i = 0; i < len; i++) {

                    if(sections[i].name !== 'blog'){
                        sections[i].object.hide();
                    }

                }

                blog.show();
            }



        }

    };

};

seventytwolions.Controller.SectionsManager.prototype = new seventytwolions.Controller.Base();

/**
 * Portfolio Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Portfolio = function() {

    var me = this;
    var categoriesModel;
    var portfolioItems = [];

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        this.loadPosts();
        this.loadCategories();

    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.getView().show();
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.getView().hide();
    };

    /**
     * Forces the model to load the posts
     * @author Thodoris Tsiridis
     */
    this.loadPosts = function() {
        this.getModel().getPosts(7, 0, 80, onPostsLoaded, this);
    };

    /**
     * Callback function that is triggered when the model posts are loaded
     * @param  {Object} result The result that came back from the model
     * @author Thodoris Tsiridis
     */
    var onPostsLoaded = function(result) {
        var i;
        if(typeof(this.getModel().get('Portfolio')) === 'undefined'){

            this.getModel().set('Portfolio', result);

            for (i = 0; i < result.length; i++) {
                portfolioItems.push(
                    seventytwolions.ControllerManager.initializeController({
                        type:'ThumbnailItem',
                        id:'ThumbnailItem' + result[i].Id,
                        model: seventytwolions.Lookup.getModel({
                            data:result[i]
                        })
                    })
                );

                this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
                portfolioItems[i].getView().render();
            }
        }

    };

    /**
     * Forces the model to load the categories
     * @author Thodoris Tsiridis
     */
    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = seventytwolions.Lookup.getModel({
                type:'Categories',
                id:'categoriesPortfolio'
            });
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    /**
     * Callback function that is triggered when the model categories are loaded
     * @param  {Object} result The result that came back from the model
     * @author Thodoris Tsiridis
     */
    var onCategoriesLoaded = function(result) {

    };

};

seventytwolions.Controller.Portfolio.prototype = new seventytwolions.Controller.Base();

/**
 * Experiments Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Experiments = function() {

    var me = this;


    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function() {
        this.getView().show();
    };

    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
        this.getView().hide();
    };

};

seventytwolions.Controller.Experiments.prototype = new seventytwolions.Controller.Base();

/**
 * Blog Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Blog = function() {

    var me = this;
    var categoriesModel;
    var portfolioItems = [];

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        this.loadBlogPosts();
        this.loadCategories();

    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.getView().show();
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.getView().hide();
    };

    this.loadBlogPosts = function() {
        this.getModel().getPosts(3, 0, 80, onBlogPostsLoaded, this);
    };

    var onBlogPostsLoaded = function(result) {
        var i;

        if(typeof(this.getModel().get('Blog')) === 'undefined'){

            this.getModel().set('Blog', result);

            for (i = 0; i < result.length; i++) {

                portfolioItems.push(
                    seventytwolions.ControllerManager.initializeController({
                        type:'ThumbnailItem',
                        id:'ThumbnailItem' + result[i].Id,
                        model: seventytwolions.Lookup.getModel({
                            data:result[i]
                        })
                     })
                );

                this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
                portfolioItems[i].getView().render();
                portfolioItems[i].getView().showDescription();
            }

        }

        this.getView().positionItems();
    };

    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = seventytwolions.Lookup.getModel({
                type:'Categories',
                id:'categoriesBlog'
            });
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    var onCategoriesLoaded = function(result) {

    };
};

seventytwolions.Controller.Blog.prototype = new seventytwolions.Controller.Base();

/**
 * About Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.About = function() {

    var me = this;


    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function() {
        this.getView().show();
    };

    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
        this.getView().hide();
    };

};

seventytwolions.Controller.About.prototype = new seventytwolions.Controller.Base();

/**
 * Contact Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Contact = function() {

    var me = this;


    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function() {
        this.getView().show();
    };

    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
        this.getView().hide();
    };

};

seventytwolions.Controller.Contact.prototype = new seventytwolions.Controller.Base();

/**
 * Portfolio Item Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.ThumbnailItem = function() {

    var me = this;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

};

seventytwolions.Controller.ThumbnailItem.prototype = new seventytwolions.Controller.Base();

/**
 * About Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.PostDetails = function() {

    var me = this;
    this.currentId = null;

    /**
     * This function is executed right after the initialized
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Loads a page or post from the model
     * @param  {String} sectionSlug The name of the page's slug
     * @author Thodoris Tsiridis
     */
    this.load = function(sectionSlug) {
        if(this.currentId !== sectionSlug){
            this.currentId = sectionSlug;

            if(typeof(this.getModel().get('PostDetails'+this.currentId)) !== 'undefined'){
                onPostDetailsLoaded.call(this, this.getModel().get('PostDetails'+this.currentId));
            } else {
                this.getModel().getDetails(sectionSlug, onPostDetailsLoaded, this);
            }


        }
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function() {
        this.getView().show();
    };

    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
        this.getView().hide();
        this.currentId = null;
    };

    var onPostDetailsLoaded = function(result) {
        this.getModel().set('PostDetails'+this.currentId, result);
        this.getView().currentId = this.currentId;
        this.getView().render();
        this.show();
    };

};

seventytwolions.Controller.PostDetails.prototype = new seventytwolions.Controller.Base();

seventytwolions.Model.Categories = function(){

    var CATEGORIES_URL = '/api/getCategories.php';
    var DEFAULT_START = 0;
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    // Declaring the API
    var api = {};
    var req;
    var data = {};

    /**
     * Returns an array of categories
     * @private
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @returns An array with objects
     * @type Array
     * @author Thodoris Tsiridis
     */
    this.get = function(start, total, callback, ctx) {
        var dataString;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 's=' + start + '&t=' + total;

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
                    url: CATEGORIES_URL,
                    dataType: 'json',
                    data: dataString,
                    success: function(res){
                        data.posts = res.Results;
                        if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                            callback.apply(ctx, [data.posts]);
                            req = undefined;
                        }
                    }
                });

    };

};

seventytwolions.Model.Categories.prototype = new seventytwolions.Model.Base();

seventytwolions.Model.Posts = function(){

    // Constants
    var POSTS_URL = '/api/getPosts.php';
    var POST_DETAILS_URL = '/api/getPostDetails.php';
    var DEFAULT_START = 0;
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    var req, reqDetails;
    var data = {};

    /**
     * Returns an array of posts
     * @param {Number} categoryId The category of the posts that we want to load
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @returns An array with objects
     * @type Array
     * @author Thodoris Tsiridis
     */
    this.getPosts = function(categoryid, start, total, callback, ctx) {

        var dataString;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 's=' + start + '&t=' + total;

        if(categoryid !== null){
            dataString += '&cid=' + categoryid;
        }

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
                url: POSTS_URL,
                dataType: 'json',
                data: dataString,
                success: function(res){
                    data.posts = res.Results;
                    if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                        callback.apply(ctx, [data.posts]);
                        req = undefined;
                    }
                }
            });
    };

    /**
     * Returns an array of posts
     * @param {String} slug The slug of the page
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @returns An array with objects
     * @type Array
     * @author Thodoris Tsiridis
     */
    this.getDetails = function(slug, callback, ctx) {

        if(reqDetails !== undefined){
            reqDetails.abort();
        }

        reqDetails = $.ajax({
                url: POST_DETAILS_URL,
                dataType: 'json',
                data: 'id=' + slug,
                success: function(res){
                    data.post = res.Results;
                    if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                        callback.apply(ctx, [data.post]);
                        req = undefined;
                    }
                }
            });
    };

};

seventytwolions.Model.Posts.prototype = new seventytwolions.Model.Base();

/**
 * Main View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Main = function() {

	this.domElement = null;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //seventytwolions.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

};

seventytwolions.View.Main.prototype = new seventytwolions.View.Base();

/**
 * Navigation View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Navigation = function() {

    var $links;
    var me = this;

	this.domElement = $('.navigation');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
        $links = this.domElement.find('a');
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
        addEventListeners();
    };

    /**
     * Hightlits a menu item
     * @param {String} section The name of the section that we want to highlight
     * @author Thodoris Tsiridis
     */
    this.selectNavigationItem = function(section) {
        section = section === '' ? 'home' : section;
        this.domElement.find('.nav-' + section).parent().addClass('active').siblings().removeClass('active');
    };

    /**
     * Registers all the event listeners
     * @private
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        $links.bind('click', onLinkClick);
    };

    /**
     * Triggered when we click a link
     * @private
     * @author Thodoris Tsiridis
     */
    var onLinkClick = function(e){
        e.preventDefault();

        // Cache the item
        var $item = $(this);

        // Dispatch the event
        me.dispatchEvent({type: 'menuClicked', path:$item.attr('href'), title:$item.attr('title')});

        // Clear memory
        $item = null;
    };

};

seventytwolions.View.Navigation.prototype = new seventytwolions.View.Base();

/**
 * Sections Manager View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.SectionsManager = function() {

    var me = this;

	this.domElement = $('#sections-wrapper');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

};

seventytwolions.View.SectionsManager.prototype = new seventytwolions.View.Base();

/**
 * Portfolio View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Portfolio = function() {

    this.domElement = $('.portfolio');

    var me = this;
    var itemsContainer = this.domElement.find('.centered');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     * @param {DOMElement} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        itemsContainer.append(item);
    };

};

seventytwolions.View.Portfolio.prototype = new seventytwolions.View.Base();

/**
 * Experiments View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Experiments = function() {

    var me = this;

	this.domElement = $('.experiments');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

};

seventytwolions.View.Experiments.prototype = new seventytwolions.View.Base();

/**
 * Blog View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Blog = function() {

   this.domElement = $('.blog');

    var me = this;
    var itemsContainer = this.domElement.find('.centered');
    var isFirstTime = true;

    // Constants
    var COLUMN_MIN = 2;
    var COLUMN_WIDTH = 218;
    var COLUMN_MARGIN = 20;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //seventytwolions.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
        $(window).bind("resize", onWindowResize);
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

        isFirstTime = true;
        this.positionItems();
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     * @param {DOMElement} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        itemsContainer.append(item);
    };

    this.positionItems = function() {


        var domItems = itemsContainer.find('article');
        var domItemsFeatured = itemsContainer.find('article.featured');
        var windowHeight = itemsContainer.height();
        var windowWidth = itemsContainer.width();
        var gridTop = 0;
        var gridLeft = 0;// this.domElement.offset().left;
        var items = [];
        var _7 = 0;
        var _8 = 0;
        var minColumns = Math.max(COLUMN_MIN, parseInt(windowWidth / (COLUMN_WIDTH + COLUMN_MARGIN), 0));
        var maxHeight = 0;

        if(isFirstTime){
            isFirstTime = false;
        } else {
            itemsContainer.addClass('animated');
        }

        for (x = 0; x < minColumns; x++) {
            items[x] = 0;
        }

        domItems.each(function (i, e) {
            var x, _a, _b, _c, _d = 0;
            var target_x =0;
            var target_y = 0;
            _c = (Math.floor($(e).outerWidth() / COLUMN_WIDTH));
            _b = 0;

            if (_c > 1) {

                for (x = 0; x < minColumns - (_c - 1); x++) {
                    _b = (items[x] < items[_b]) ? x : _b;
                }

                _a = _b;

                for (x = 0; x < _c; x++) {
                    _d = Math.max(_d, items[_a + x]);
                }

                for (x = 0; x < _c; x++) {
                    items[_a + x] = parseInt($(e).outerHeight(), 0) + COLUMN_MARGIN + _d;
                }

                target_x = _a * (COLUMN_WIDTH + COLUMN_MARGIN) + gridLeft;
                target_y = _d + gridTop;

                _7 = (_d > _7) ? items[_a + _c - 1] : _7;

            } else {

                for (x = 0; x < minColumns; x++) {
                    _b = (items[x] < items[_b]) ? x : _b;
                }

                target_x = _b * (COLUMN_WIDTH + COLUMN_MARGIN) + gridLeft;
                target_y = items[_b] + gridTop;
                items[_b] += $(e).outerHeight() + COLUMN_MARGIN;
                _7 = (items[_b] > _7) ? items[_b] : _7;

            }

            $(this).css({
                left: target_x + "px",
                top: target_y + COLUMN_MARGIN + "px"
            });

            itemBottom = parseInt($(this).offset().top,0) + $(this).innerHeight();
            if(maxHeight < itemBottom){
                maxHeight = itemBottom;
            }

            _8 = (_8 < _b) ? _b : _8;

        });

        itemsContainer.css('height', maxHeight + 'px');

        var _f = parseInt(($('body').innerWidth() - (COLUMN_WIDTH + COLUMN_MARGIN) * (_8 + 1)) / 2, 0) - 0;
    };

    var onWindowResize = function() {
        me.positionItems();
    };


};

seventytwolions.View.Blog.prototype = new seventytwolions.View.Base();

/**
 * About View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.About = function() {

    var me = this;

	this.domElement = $('.about');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.domElement.slideDown();
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.slideUp();
    };

};

seventytwolions.View.About.prototype = new seventytwolions.View.Base();

/**
 * Contact View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Contact = function() {

    var me = this;

	this.domElement = $('.contact');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

};

seventytwolions.View.Contact.prototype = new seventytwolions.View.Base();

/**
 * Portfolio Item View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.ThumbnailItem = function() {

    this.isFeatured = false;

    var me = this;
    var tmpl = '<div class="photo">'+
                    '<a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a>'+
                    '<a href="${link}" title="${title}"><img class="thumbnail-image" src="${image}" alt="${title}" width="${imgwidth}" height="${imgheight}" /></a>'+
                '</div>'+
                '<div class="description">'+
                    '<hgroup><a href="${link}" title="${title}" class="title"><h1>${title}</h1></a></hgroup>'+
                    '<time>${publishdate}</time>'+
                    '<aside>Categories: ${categories}</aside>'+
                    '<p>'+
                    '${description}'+
                    '</p>' +
                    '<a href="${link}" title="${title}" class="readmore">Read more</a>'+
                '</div>';

	this.domElement = $('<article class="portfolio-item clearfix"></article>');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name + ', ' + this.id);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {

	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Sets the current item as featured item
     * @param {Boolean} isFeatured Set to true if we need to render it as a featured item
     * @author Thodoris Tsiridis
     */
    this.setAsFeatured = function(isFeatured){

        this.isFeatured = isFeatured;

        if(isFeatured){
            this.domElement.addClass('featured');
        } else {
            this.domElement.removeClass('featured');
        }

    };

    this.render = function() {

        var random, month, model, meta, body, pdate, url, slug, categories, categoriesStr, thumbnail, imgWidth, imgHeight, hasThumbnail;
        categoriesStr= '';
        hasThumbnail = false;
        model = this.getModel();
        body = tmpl;

        meta = model.get('Meta');

        if(meta.showcase !== undefined){
            this.setAsFeatured(true);
        }

        //Firefox doesn't like dates with / in the constructor
        pDate = new Date(model.get('PublishDate').replace(/-/g ,'/'));
        body = body.replace(/\${publishdate}/g, seventytwolions.Model.Locale.getDayName(pDate.getDay()) + ', ' +  seventytwolions.Model.Locale.getMonthName(pDate.getMonth()) + ' ' + pDate.getDate() +  ' ' + pDate.getFullYear());

        slug = model.get('Slug');

        month = (pDate.getMonth() + 1);
        month = month.toString().length === 1 ? '0' + month : month;

        url = '/' + pDate.getFullYear() + '/' + month + '/' + slug;

        body = body.replace(/\${title}/g, model.get('Title'));
        body = body.replace(/\${description}/g, model.get('Description'));
        body = body.replace(/\${link}/g, url);

        // Create categories string
        categories = model.get('Categories');
        for (var i = 0; i < categories.length; i++) {

            categoriesStr += categories[i].Name;

            if(i < categories.length - 1){
                categoriesStr +=', ';
            }

        }

        body = body.replace(/\${categories}/g, categoriesStr);

        thumbnail = model.get('Thumbnail');
        if(thumbnail.Data !== null && thumbnail.Data !== undefined){
            hasThumbnail = true;
            if(this.isFeatured){
                imgWidth = thumbnail.Data.sizes.medium.width;
                imgHeight = thumbnail.Data.sizes.medium.height;
            } else {
                imgWidth = thumbnail.Data.sizes.thumbnail.width;
                imgHeight = thumbnail.Data.sizes.thumbnail.height;
            }

            body = body.replace(/\${image}/g, '/wp-content/uploads/' + thumbnail.File);
            body = body.replace(/\${imgwidth}/g, imgWidth);
            body = body.replace(/\${imgheight}/g, imgHeight);

        }
        //seventytwolions.Console.log('Drawing view with name ' + this.name);
        if(meta.github !== undefined){
            body = body.replace(/\${github}/g, meta.github);
        }

        this.domElement.html(body);

        if(meta.github !== undefined){
          this.domElement.find('.github-ribbon').css('display', 'block');
        } else {
            this.domElement.find('.github-ribbon').remove();
        }

        if(!hasThumbnail) {
            this.domElement.find('.photo').remove();
        }

        addEventListeners();

    };

    /**
     * Shows the description of the item
     * @author Thodoris Tsiridis
     */
    this.showDescription = function() {
        this.domElement.find('p').css('display','block');
    };

    /**
     * Hides the description of the item
     * @author Thodoris Tsiridis
     */
    this.hideDescription = function() {
        this.domElement.find('p').css('display','none');
    };

    /**
     * Registers all the events
     */
    var addEventListeners = function() {
        me.domElement.find('a').bind('click', onThumbnailClicked);
    };

    /**
     * Triggered when we click the thumbnail
     * @param  {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onThumbnailClicked = function(event) {
        var model, pubDate, slug, url, month, title;

        event.preventDefault();
        model = me.getModel();

        pubDate = model.get('PublishDate');
        slug = model.get('Slug');
        pubDate = new Date(pubDate.replace(/-/g ,'/'));

        month = (pubDate.getMonth() + 1);
        month = month.toString().length === 1 ? '0' + month : month;
        url = pubDate.getFullYear() + '/' + month + '/' + slug;
        title = $(this).attr('title') + ' - 72Lions - Thodoris Tsiridis - Web developer';
        // Push the current url
        Router.push(null, title + ' - ' + seventytwolions.Model.Locale.getPageTitle(), '/' + url);

    };

};

seventytwolions.View.ThumbnailItem.prototype = new seventytwolions.View.Base();

/**
 * PostDetails View
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PostDetails = function() {

	this.domElement = $('.post-details');
    this.currentId = null;

    var me = this;
    var details = null;
    var contentDomElement = this.domElement.find('.content');
    var asideDomElement = this.domElement.find('aside');
    var titleDomElement = contentDomElement.find('h1.title');
    var categoriesDomElement = contentDomElement.find('.categories');
    var textDomElement = contentDomElement.find('.text');
    var timeDomElement = contentDomElement.find('time');
    var githublinkDomElement = contentDomElement.find('.github-link');
    var downloadlinkDomElement = contentDomElement.find('.download-link');
    var demolinkDomElement = contentDomElement.find('.demo-link');
    var commentsDomElement = this.domElement.find('.comments');
    var backDomElement = this.domElement.find('.back');

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        backDomElement.bind('click', onBackClick);
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    this.render = function() {

        var asideHTML, categoriesStr, pDate, slug, url;
        asideHTML = categoriesStr = '';

        details = this.getModel().get('PostDetails'+this.currentId);

        textDomElement.html(details.Content);

        // Create categories string
        categories = details.Categories;

        for (var i = 0; i < categories.length; i++) {

            categoriesStr += categories[i].Name;

            if(i < categories.length - 1){
                categoriesStr +=', ';
            }

        }

        if(categoriesStr !== '') {
            categoriesDomElement.html('Categories: ' + categoriesStr);
            categoriesDomElement.fadeIn(0);
        } else {
            categoriesDomElement.fadeOut(0);
        }

        //seventytwolions.Console.log('Drawing view with name ' + this.name);
        if(typeof(details.Meta.github) !== 'undefined'){
            githublinkDomElement.attr('href', details.Meta.github);
            githublinkDomElement.addClass('visible');
        } else {
            githublinkDomElement.removeClass('visible');
        }

        if(typeof(details.Meta.download) !== 'undefined') {
            downloadlinkDomElement.attr('href', details.Meta.download);
            downloadlinkDomElement.addClass('visible');
        } else {
            downloadlinkDomElement.removeClass('visible');
        }

        if(typeof(details.Meta.demo) !== 'undefined') {
            demolinkDomElement.attr('href', details.Meta.demo);
            demolinkDomElement.addClass('visible');
        } else {
            demolinkDomElement.removeClass('visible');
        }

        //Firefox doesn't like dates with / in the constructor
        pDate = new Date(details.PublishDate.replace(/-/g ,'/'));
        timeDomElement.html(seventytwolions.Model.Locale.getDayName(pDate.getDay()) + ', ' +  seventytwolions.Model.Locale.getMonthName(pDate.getMonth()) + ' ' + pDate.getDate() +  ' ' + pDate.getFullYear());
        titleDomElement.html(details.Title);
        asideDomElement.html(asideHTML);

        slug = details.Slug;
        month = (pDate.getMonth() + 1).toString();
        month = month.length === 1 ? "0" + month : month;
        url = '/' + pDate.getFullYear() + '/' + month + '/' + slug;

        if(details.Meta.dsq_thread_id) {
            /*console.log(details.Meta.dsq_thread_id, url)*/;
            commentsDomElement.css('display', 'block');
            DISQUS.reset({
              reload: true,
              config: function () {
                this.page.identifier = details.Meta.dsq_thread_id;
                this.page.url = "http://72lions.com" + url;
              }
            });
        } else {
            commentsDomElement.css('display', 'none');
        }
    };

    /**
     * Shows the view
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);
    };
    /**
     * Hides the view
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

    var onBackClick = function(event){
        event.preventDefault();
        Router.goBack(1);
        /*console.log('onbackclick')*/;
    };

};

seventytwolions.View.PostDetails.prototype = new seventytwolions.View.Base();

seventytwolions.ControllerManager.initializeController({
    type:'Main',
    id:'main',
    model: seventytwolions.Lookup.getModel({})
});

