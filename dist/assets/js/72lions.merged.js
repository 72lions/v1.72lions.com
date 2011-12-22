/**
 * Routing manager is responsible for listening to popstates in order to dispatch events. Clients can register their interest on these events
 *
 * @module 72lions
 * @class Router
 * @author Thodoris Tsiridis
 * @version 1.0
 */
var Router = (function(global){

    /**
     * It is set to true the first time we get a popstate
     *
     * @private
     * @type Boolean
     * @default true
     */
    var isRefresh = true;

    /**
     * It holds all the registered events for the pop and push
     *
     * @private
     * @type Object
     * @default { push: [], pop: []}
     */
    var registeredMembers = { push: [], pop: []};

    /**
     * It holds all the registered events for the path changes
     *
     * @private
     * @type Object
     * @default {}
     */
    var registeredPathMembers = {};

    /**
     * It holds the current state
     *
     * @private
     * @type Object
     * @default null
     */
    var currentState = null;

    /**
     * Holds the intervalId for the setInterval function if the History API isn't supported and hashes are used instead
     *
     * @private
     * @type Number
     * @default null
     */
    var hashChangeIntervalId = null;

    /**
     * The current hash
     *
     * @private
     * @type String
     * @default ''
     */
    var currentHash = '';

    /**
     * It is true if the History API is supported
     *
     * @private
     * @type Boolean
     * @default true
     */
    var isHistoryAPISupported = true;

    /**
     * The base path
     *
     * @type String
     * @default ''
     */
    this.basePath = '';

    /**
     * After how many milliseconds the app will listen for a hash change
     *
     * @type Number
     * @default 500
     */
    this.hashListenInterval = 500;

    /**
     * Pushes a new state on the history api
     *
     * @public
     * @param {Ojbect} state The state; could be a JSON object that is passed on the popstate
     * @param {String} title The title of the page. Most browsers don't use it yet
     * @param {String} url The url that we need to push
     * @author Thodoris Tsiridis
     */
    this.push = function(state, title, url){

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
     *
     * @public
     * @param {Ojbect} state The state could be a JSON object that is passed on the popstate
     * @param {String} title The title of the page. Most browsers don't use it yet
     * @param {String} url The url that we need to push
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
     *
     * @public
     * @param {String} eventType The name of the event e.x. push, pop
     * @param {Function} callback The function to execute
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
     *
     * @public
     * @param {String} path The name of the event e.x. segment1/segment2
     * @param {Function} callback The function to execute
     * @param {Number} priority The priority of the callback function
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
     *
     * @public
     * @param {Integer} steps The number of steps that you want to go backwards
     * @author Thodoris Tsiridis
     */
    this.goBack = function(steps){
        history.go(0 - (steps === null || steps === undefined ? 1 : steps));
    };

    /**
     * It goes forward in history
     *
     * @public
     * @param {Integer} steps The number of steps that you want to go forward
     * @author Thodoris Tsiridis
     */
    this.goForward = function(steps){
        history.go(steps === null || steps === undefined ? 1 : steps);
    };

    /**
     * It returns the state of the object
     *
     * @public
     * @return {Object}
     * @author Thodoris Tsiridis
     */
    this.getState = function(){
        return getAPIState();
    };

    /**
     * This is function is triggered on a window popstate
     *
     * @private
     * @param {Object} e The object returned from the event
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
     *
     * @private
     * @return {Object} Returns an object with the following keys
     * @author Thodoris Tsiridis
     */
    var getAPIState = function(){

        var tempState = parseURL(location.href);
        tempState.isRefresh = isRefresh;
        return tempState;
    };

    /**
     * Notifies all the registered members
     *
     * @private
     * @param {String} eventType The name of the event e.x. push, pop
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
     *
     * @private
     * @param {String} path The path e.x. segment1/segment2
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
     *
     * @private
     * @param {String} path The path e.x. segment1/segment2
     * @author Thodoris Tsiridis
     */
    var sortRegisteredPathMembers = function(path){
        var cache = registeredPathMembers[path];
        cache.sort(sortByPriority);
        cache = null;

    };

    /**
     * Performs a check to see if the hash has changed and triggers then onPopstate function
     *
     * @private
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
     * Parses a url and returns an object containing the folowing data (if found): protocol, domain, post, path and path segments, hash and hash segments, query string and an object containing a key/value pair representation of the query
     *
     * @private
     * @param {String} url The url that we need to parse
     * @return {Object} The object containing the different segments from the parsed URL
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
     *
     * @private
     * @return {Boolean} True if the history api is supported
     * @author Thodoris Tsiridis
     */
    var supportsHistoryAPI = function(){
        return !!(window.history && history.pushState);
    };

    /**
     * Checks if the onhashchange is supported
     *
     * @private
     * @return {Boolean} True if hash change event is supported
     * @author Thodoris Tsiridis
     */
    var supportsHashChange = function(){
        return !!(window.onhashchange);
    };

    /**
     * Sorts an array based on the priority key
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var sortByPriority = function(a, b){
        var x = parseInt(a.priority, 0);
        var y = parseInt(b.priority, 0);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };

    /**
     * Initalizes the utility
     *
     * @private
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

    return this;

})(window);

/**
 * Event target is used as a mixin so that the classes can support dispatch events and add events commands
 *
 * @module 72lions
 * @class EventTarget
 * @author Thodoris Tsiridis
 * @version 1.0
 */
var EventTarget = function () {
    /**
     * The object that will hold all the event listeners
     *
     * @private
     * @type Object
     */
    var listeners = {};

    /**
     * Registers an event
     *
     * @param {String} type The event type
     * @param {Function} listener The callback function
     * @author Thodoris Tsiridis
     */
    this.addEventListener = function ( type, listener ) {

        if ( listeners[ type ] === undefined ) {
            listeners[ type ] = [];
        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {
            listeners[ type ].push( listener );
        }

    };

    /**
     * Dispatches an event
     *
     * @param {String} type The event type
     * @author Thodoris Tsiridis
     */
    this.dispatchEvent = function ( event ) {

        for ( var listener in listeners[ event.type ] ) {
            listeners[ event.type ][ listener ]( event );
        }

    };

    /**
     * Removes an event
     *
     * @param {String} type The event type
     * @param {Function} listener The callback function
     * @author Thodoris Tsiridis
     */
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
/**
 * Locale Model
 *
 * @module 72lions
 * @class Locale
 * @namespace seventytwolions.Model
 * @extends seventytwolions.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Locale = (function(global){

    /**
     * An array of all the months
     *
     * @private
     * @type Array
     * @default ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
     */
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    /**
     * An array of all the week days
     *
     * @private
     * @type Array
     * @default ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
     */
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    /**
     * The page title
     *
     * @private
     * @type String
     * @default "72Lions - The playground of developer Thodoris Tsiridis"
     */
    var pageTitle = "72Lions - The playground of developer Thodoris Tsiridis";

    /**
     * Returns the name of the month
     *
     * @param  {Number} monthIndex The month index
     * @return {String}
     */
    this.getMonthName = function(monthIndex){
        return months[monthIndex];
    };

    /**
     * Returns the name of a day of the week
     *
     * @param  {Number} dayIndex The day of the week index
     * @return {String}
     */
    this.getDayName = function(dayIndex){
        return days[dayIndex];
    };

    /**
     * Returns the title of the page
     *
     * @return {String}
     */
    this.getPageTitle = function (){
        return pageTitle;
    };

    return this;

})(window);

/**
 * The controller manager is responsible for instantiating controllers
 *
 * @module 72lions
 * @class ControllerManager
 * @namespace seventytwolions
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.ControllerManager = (function(global) {

    /**
     * Initializes a controller with a specific name
     *
     * @param {Object} object The parameters
     * @return {seventytwolions.Controller.Base}
     * @author Thodoris Tsiridis
     */
    this.initializeController = function(object) {
        return seventytwolions.Lookup.getController(object);
    };

    return this;

})(window);

/**
 * Lookup up utility that loads or creates controllers, views and models
 *
 * @module 72lions
 * @class Lookup
 * @namespace seventytwolions
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Lookup = (function(global) {

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
     *
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
     *
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

    return this;

})(window);

/**
 * Console is used for outputing console.log messages
 *
 * @module 72lions
 * @class Console
 * @namespace seventytwolions
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Console = (function(global){

    /**
     * Set to true and debug will be enabled
     *
     * @type {Boolean}
     * @default true
     */
    this.debug = true;

    /**
     * Logs out a message
     *
     * @param {Object || Array || Number || String || Arguments} arguments The message to pass down to console.log
     * @author Thodoris Tsiridis
     */
    this.log = function() {

        if(this.debug){
            /*console.log(arguments)*/;
        }

    };

    // Return the api
    return this;

})(window);

/**
 * Base View
 *
 * @module 72lions
 * @class Base
 * @namespace seventytwolions.View
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Base = function() {

    EventTarget.call( this );

    /**
     * The view name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * The view id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * A reference to this view's model
     *
     * @type seventytwolions.View.Base
     * @default undefined
     */
    this.model = undefined;

    /**
     * The DOM Element
     *
     * @type Object
     * @default null
     */
    this.domElement = null;

    /**
     * Function for when showing the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function() {
    };

    /**
     * Function for when hiding the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function() {
    };

    /**
     * Sets the name of the view
     *
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the name of the view
     *
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setId = function(id) {
        this.id = id;
    };

    /**
     * Sets the model for the view
     *
     * @param {seventytwolions.Model.Base} model The model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
        this.model = model;
    };

    /**
     * Gets the model for the view
     *
     * @return {seventytwolions.Model.Base} The model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return this.model;
    };

    /**
     * Returns the main dom element of the view
     *
     * @return {Object} A DOM element
     * @author Thodoris Tsiridis
     */
    this.getDOMElement = function() {
        return this.domElement;
    };

    /**
     * Is triggered before initialization of the view
     *
     * @author Thodoris Tsiridis
     */
    this.preInitialize = function(name, id) {
        this.setName(name);
        this.setId(id);
    };

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize = function(){

    };

    /**
     * Draws the view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function(){

    };

    /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw = function(){

    };

};

/**
 * Base Model
 *
 * @module 72lions
 * @class Base
 * @namespace seventytwolions.Model
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Base = function(){

    /**
     * The object that holds the data
     *
     * @private
     * @type String
     */
    var data = {};

    /**
     * The view name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * The view id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * Sets the model data
     *
     * @param {Object} modelData The model data
     * @author Thodoris Tsiridis
     */
    this.setData = function(modelData) {
        this.data = modelData;
    };

    /**
     * Gets the model data
     *
     * @return {Object} The data
     * @author Thodoris Tsiridis
     */
    this.getData = function() {
        return this.data;
    };

    /**
     * Sets the name of the model
     *
     * @param {String} name The name/type of the model
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the id of the model
     *
     * @param {String} id The id of the model
     * @author Thodoris Tsiridis
     */
    this.setId = function (id) {
        this.id = id;
    };

    /**
     * Saves a value to a specific key of the model
     *
     * @param {String} key The key of the data object to be set
     * @param {Object || String || Number || Array} value The value to save on the specific key
     * @author Thodoris Tsiridis
     */
    this.set = function(key, value) {
        this.data[key] = value;
    };

    /**
     * Returns a value to a specific key of the model
     *
     * @param {String} key The key of the data object to be set
     * @return {Object || String || Number || Array} The value of the specific data key
     * @author Thodoris Tsiridis
     */
    this.get = function(key) {
        return this.data[key];
    };

};


/**
 * Base Controller
 *
 * @module 72lions
 * @class Base
 * @namespace seventytwolions.Controller
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Base = function() {

    EventTarget.call( this );

    /**
     * A reference to this controller's view
     *
     * @private
     * @type seventytwolions.View.Base
     * @default undefined
     */
    var _view = undefined;

    /**
     * A reference to this controller's model
     *
     * @private
     * @type seventytwolions.Controller.Base
     * @default undefined
     */
    var _model = undefined;

    /**
     * The controller id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * The controller name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * A reference to this controller's model
     *
     * @type seventytwolions.Controller.Base
     * @default undefined
     */
    this.model = undefined;

    /**
     * Initializes the plugin
     *
     * @param {Object} attributes The attributes to be used while initializing a controller
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
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function() {

    };

    /**
     * Returns the view of the specific view
     *
     * @return {seventytwolions.View.Base} The Base view
     * @author Thodoris Tsiridis
     */
    this.getView = function() {
        return _view;
    };

    /**
     * Returns the model of the specific model
     *
     * @return {seventytwolions.Model.Base} The Base model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return _model;
    };

    /**
     * Sets the model of the controller
     *
     * @param {seventytowlions.Model.Base} model The new model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
      _model = model;
      _view.setModel(model);
    };

};

/**
 * Main Controller
 *
 * @module 72lions
 * @class Main
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Main = function() {

    /**
     * A reference to the navigation controller
     *
     * @private
     * @type seventytwolions.Controller.NaviMaingation
     * @default null
     */
    var navigationController = null;

    /**
     * A reference to the sections manager controller
     *
     * @private
     * @type seventytwolions.Controller.SectionsManager
     * @default null
     */
    var sectionsManager = null;

    /**
     * A reference to the footer controller
     *
     * @private
     * @type seventytwolions.Controller.Footer
     * @default null
     */
    var footerController = null;

    /**
     * The initial state of the website
     *
     * @private
     * @type Object
     */
    var initialState = Router.getState();

    /**
     * Its true if there is a state object in the windows history. Chrome triggers a popstate on load so that is true
     *
     * @private
     * @type Boolean
     */
    var popped = ('state' in window.history);

    /**
     * The page url upon loading
     *
     * @private
     * @type String
     */
    var initialURL = location.href;

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
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

        footerController  = seventytwolions.ControllerManager.initializeController({
            type:'Footer',
            id:'Footer',
            model: seventytwolions.Lookup.getModel({
               type: 'Footer',
               id: 'footter'
            })
        });

        onPopPushEvent(initialState);

        Router.registerForEvent('pop', onPopPushEvent);
        Router.registerForEvent('push', onPopPushEvent);

    };

    /**
     * Triggered when we have a pop or push event
     *
     * @private
     * @param {Object} state The state object
     * @author Thodoris Tsiridis
     */
    var onPopPushEvent = function(state){
        var initialPop, sectionName;

        // Catch page reload pop event that happens in some browsers
        // and disregard it
        initialPop = !popped && location.href == initialURL;
        popped = true;
        //alert(initialPop + ", " + popped);
        //if ( initialPop ) return;

        // Clean memory
        initialPop = null;
        initialState = null;

        sectionName = '';

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
     *
     * @private
     * @param {Object} state The path of the section that we want to show
     * @author Thodoris Tsiridis
     */
    var changeSection = function(state){
        footerController.hide();
        sectionsManager.showSectionWithName(state);
        footerController.show();
    };
};

seventytwolions.Controller.Main.prototype = new seventytwolions.Controller.Base();

/**
 * Navigation Controller
 *
 * @module 72lions
 * @class Navigation
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Navigation = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Navigation
     */
    var me = this;

    /**
     * This function is executed right after the initialized
     *
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        me.getView().addEventListener('menuClicked', onMenuItemClicked);

    };

    /**
     * Triggered when the view dispatches a menuClicked event
     *
     * @private
     * @param {Object} event The event object
     * @author Thodoris Tsiridis
     */
    var onMenuItemClicked = function(event){

        // Push the current url
        Router.push(null, event.title + ' - ' + seventytwolions.Model.Locale.getPageTitle(), event.path);

    };

};

seventytwolions.Controller.Navigation.prototype = new seventytwolions.Controller.Base();

/**
 * Sections Manager Controller
 *
 * @module 72lions
 * @class SectionsManager
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.SectionsManager = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.SectionsManager
     */
    var me = this;

    /**
     * The initial state of the website
     *
     * @private
     * @type Object
     */
    var initialState = Router.getState();

    /**
     * The Portfolio Controller
     *
     * @private
     * @type seventytwolions.Controller.Portfolio
     * @default undefined
     */
    var portfolio;

    /**
     * The Experiments Controller
     *
     * @private
     * @type seventytwolions.Controller.Experiments
     * @default undefined
     */
    var experiments;

    /**
     * The Blog Controller
     *
     * @private
     * @type seventytwolions.Controller.Blog
     * @default undefined
     */
    var blog;

    /**
     * The initial state of the website
     *
     * @private
     * @type seventytwolions.Controller.Contact
     * @default undefined
     */
    var contact;

    /**
     * The Post Details Controller
     *
     * @private
     * @type seventytwolions.Controller.PostDetails
     * @default undefined
     */
    var postDetails;

    /**
     * The array that will hold all the sections
     *
     * @private
     * @type Array
     * @default undefined
     */
    var sections;

    /**
     * The number of total sections
     *
     * @private
     * @type Number
     * @default 4
     */
    var totalSections = 4;

    /**
     * This function is executed right after the initialized function is called
     *
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

        sections = [{name: 'portfolio', object: portfolio}, {name:'experiments', object: experiments}, {name:'blog', object: blog}];

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
     *
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
 * @module 72lions
 * @class Portfolio
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Portfolio = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Portfolio
     */
    var me = this;

    /**
     * The categories Model
     *
     * @private
     * @type seventytwolions.Model.Categories
     * @default undefined
     */
    var categoriesModel = undefined;

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

        this.loadPosts();
        //this.loadCategories();

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.getView().show();
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
    this.loadPosts = function() {
        this.getModel().getPosts(7, 0, 80, onPostsLoaded, this);
    };

    /**
     * Callback function that is triggered when the model posts are loaded
     *
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
     *
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
     *
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

/**
 * Blog Controller
 *
 * @module 72lions
 * @class Blog
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Blog = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Blog
     */
    var me = this;

    /**
     * The categories Model
     *
     * @private
     * @type seventytwolions.Model.Categories
     * @default undefined
     */
    var categoriesModel;

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
        this.loadBlogPosts();
        //this.loadCategories();

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.getView().show();
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
     * Loads the data from the model
     *
     * @author Thodoris Tsiridis
     */
    this.loadBlogPosts = function() {
        this.getModel().getPosts(3, 0, 80, onBlogPostsLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
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

    /**
     * Loads the categories from the api
     *
     * @private
     * @author Thodoris Tsiridis
     */
    this.loadCategories = function() {

        if(categoriesModel === undefined){
            categoriesModel = seventytwolions.Lookup.getModel({
                type:'Categories',
                id:'categoriesBlog'
            });
        }

        categoriesModel.get(0, 5, onCategoriesLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onCategoriesLoaded = function(result) {

    };
};

seventytwolions.Controller.Blog.prototype = new seventytwolions.Controller.Base();

/**
 * About Controller
 *
 * @module 72lions
 * @class About
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.About = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Contact
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

seventytwolions.Controller.About.prototype = new seventytwolions.Controller.Base();

/**
 * Contact Controller
 *
 * @module 72lions
 * @class Contact
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Contact = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Contact
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

seventytwolions.Controller.Contact.prototype = new seventytwolions.Controller.Base();

/**
 * ThumbnailItem Controller
 *
 * @module 72lions
 * @class ThumbnailItem
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.ThumbnailItem = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.ThumbnailItem
     */
    var me = this;

    /**
     * This function is executed right after the initialized function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

};

seventytwolions.Controller.ThumbnailItem.prototype = new seventytwolions.Controller.Base();

/**
 * PostDetails Controller
 *
 * @module 72lions
 * @class PostDetails
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.PostDetails = function() {
    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.ThumbnailItem
     */
    var me = this;

    /**
     * The id of the current article
     *
     * @type String
     * @default null
     */
    this.currentId = null;

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

    /**
     * Loads a page or post from the model
     *
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
        this.currentId = null;
    };

    /**
     * Shows a a section with a specific name
     *
     * @private
     * @param {Object} result The data that came from the model
     * @author Thodoris Tsiridis
     */
    var onPostDetailsLoaded = function(result) {
        this.getModel().set('PostDetails'+this.currentId, result);
        this.getView().currentId = this.currentId;
        this.getView().render();
        this.show();
    };

};

seventytwolions.Controller.PostDetails.prototype = new seventytwolions.Controller.Base();

/**
 * Footer Controller
 *
 * @module 72lions
 * @class Footer
 * @namespace seventytwolions.Controller
 * @extends seventytwolions.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Footer = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.Controller.Navigation
     */
    var me = this;

    /**
     * This function is executed right after the initialized
     *
     * function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        me.getView().addEventListener('menuClicked', onMenuItemClicked);
        this.loadTweets();

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.getView().show();
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
     * Loads the latest tweets
     */
    this.loadTweets = function() {
        this.getModel().getTweets(onTweetsLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onTweetsLoaded = function(result) {
        this.getView().showTweets();
    };

    /**
     * Triggered when the view dispatches a menuClicked event
     *
     * @private
     * @param {Object} event The event object
     * @author Thodoris Tsiridis
     */
    var onMenuItemClicked = function(event){

        // Push the current url
        Router.push(null, event.title + ' - ' + seventytwolions.Model.Locale.getPageTitle(), event.path);

    };

};

seventytwolions.Controller.Footer.prototype = new seventytwolions.Controller.Base();

/**
 * Categories Model
 *
 * @module 72lions
 * @class Categories
 * @namespace seventytwolions.Model
 * @extends seventytwolions.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Categories = function(){

    /**
     * The api url for the categories
     *
     * @private
     * @final
     * @type String
     * @default '/api/getCategories.php'
     */
    var CATEGORIES_URL = '/api/getCategories.php';

    /**
     * The start offset for the categories
     *
     * @private
     * @final
     * @type Number
     * @default 0
     */
    var DEFAULT_START = 0;

    /**
     * The total number of items to retrieve from the api
     *
     * @private
     * @final
     * @type Number
     * @default 10
     */
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    /**
     * The ajax request as returned from jQuery.ajax()
     *
     * @private
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The object that holds the data
     *
     * @private
     * @type String
     */
    var data = {};

    /**
     * Returns an array of categories
     *
     * @private
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.get = function(start, total, callback, ctx) {
        var dataString, me;

        me = this;

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
                        me.set('posts', res.Results);
                        if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                            callback.apply(ctx, [me.get('posts')]);
                            req = undefined;
                        }
                    }
                });

    };

};

seventytwolions.Model.Categories.prototype = new seventytwolions.Model.Base();

/**
 * Posts Model
 *
 * @module 72lions
 * @class Posts
 * @namespace seventytwolions.Model
 * @extends seventytwolions.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Posts = function(){

    /**
     * The api url for the posts
     *
     * @private
     * @final
     * @type String
     * @default '/api/getPosts.php'
     */
    var POSTS_URL = '/api/getPosts.php';

    /**
     * The api url for the posts details
     *
     * @private
     * @final
     * @type String
     * @default '/api/getPostDetails.php'
     */
    var POST_DETAILS_URL = '/api/getPostDetails.php';

    /**
     * The start offset for the categories
     *
     * @private
     * @final
     * @type Number
     * @default 0
     */
    var DEFAULT_START = 0;

    /**
     * The total number of items to retrieve from the api
     *
     * @private
     * @final
     * @type Number
     * @default 10
     */
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    /**
     * The ajax request as returned from jQuery.ajax()
     *
     * @private
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The ajax request for the details call as returned from jQuery.ajax()
     *
     * @private
     * @type jqXHR
     * @default undefined
     */
    var reqDetails;

    /**
     * The object that holds the data
     *
     * @type String
     */
    var data = {};

    /**
     * Returns an array of posts
     *
     * @param {Number} categoryId The category of the posts that we want to load
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.getPosts = function(categoryid, start, total, callback, ctx) {
        var dataString, me;

        me = this;

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
                me.set('posts', res.Results);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('posts')]);
                    req = undefined;
                }
            }
        });
    };

    /**
     * Returns an array of posts
     *
     * @param {String} slug The slug of the page
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.getDetails = function(slug, callback, ctx) {
        var me;

        me = this;

        if(reqDetails !== undefined){
            reqDetails.abort();
        }

        reqDetails = $.ajax({
                url: POST_DETAILS_URL,
                dataType: 'json',
                data: 'id=' + slug,
                success: function(res){
                    me.set('post', res.Results);
                    if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                        callback.apply(ctx, [me.get('post')]);
                        req = undefined;
                    }
                }
            });
    };

};

seventytwolions.Model.Posts.prototype = new seventytwolions.Model.Base();

/**
 * Footer Model
 *
 * @module 72lions
 * @class Footer
 * @namespace seventytwolions.Model
 * @extends seventytwolions.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Model.Footer = function(){

    /**
     * The api url for the categories
     *
     * @private
     * @final
     * @type String
     * @default '/api/getTweets.php'
     */
    var TWITTER_URL = '/api/getTweets.php';

    /**
     * The total number of tweets to get
     *
     * @private
     * @final
     * @type Number
     * @default 2
     */
    var TOTAL_TWEETS = 2;

    /**
     * The ajax request as returned from jQuery.ajax()
     *
     * @private
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The object that holds the data
     *
     * @private
     * @type String
     */
    var data = {};

    /**
     * Returns an array of tweets
     *
     * @private
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @return Array An array with objects
     * @author Thodoris Tsiridis
     */
    this.getTweets = function(callback, ctx) {
        var dataString, tme;
        me = this;

        dataString = 't=' + TOTAL_TWEETS;

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
            url: TWITTER_URL,
            dataType: 'json',
            data: dataString,
            success: function(res){
                me.set('tweets', res.results);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('tweets')]);
                    req = undefined;
                }
            }
        });

    };

};

seventytwolions.Model.Footer.prototype = new seventytwolions.Model.Base();

/**
 * Main View
 *
 * @module 72lions
 * @class Main
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Main = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = null;

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //seventytwolions.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     *
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
 * @module 72lions
 * @class Navigation
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Navigation = function() {

    /**
     * The links DOM Elements
     *
     * @type Array
     * @default undefined
     */
    var $links;

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.Navigation
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('.navigation');

    /**
     * The clicked DOM Element
     *
     * @type Object
     * @default undefined
     */
    this.clickedItem = undefined;

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
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        $links.bind('click', onLinkClick);
    };

    /**
     * Triggered when we click a link
     *
     * @private
     * @param {Object} e The event
     * @author Thodoris Tsiridis
     */
    var onLinkClick = function(e){
        var $item;

        e.preventDefault();

        // Cache the item
        $item = me.clickedItem = $(this);

        // Check if the item that was clicked was the logo
        // and if it was use a delay so that we first scroll up
        if($item.hasClass('logo')){
            delay = 200;
            // Scroll to top
            $('body,html').stop().animate({scrollTop:0}, delay, 'easeOutQuint');
        } else {
            delay = 0;
        }

        setTimeout(function(){
            // Dispatch the event
            me.dispatchEvent({type: 'menuClicked', path: me.clickedItem.attr('href'), title: me.clickedItem.attr('title')});
        }, delay + 100);

        // Clear memory
        $item = null;
    };

};

seventytwolions.View.Navigation.prototype = new seventytwolions.View.Base();

/**
 * Sections Manager View
 *
 * @module 72lions
 * @class SectionsManager
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.SectionsManager = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.SectionsManager
     */
    var me = this;

    /**
     * The HTML Element
     *
     * @type Object
     */
	this.domElement = $('#sections-wrapper');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
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
 * @module 72lions
 * @class Portfolio
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Portfolio = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
    this.domElement = $('.portfolio');

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.Portfolio
     */
    var me = this;

    /**
     * The items container DOM Element
     *
     * @private
     * @type Object
     */
    var itemsContainer = this.domElement.find('.centered');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;
        this.domElement.addClass('active');
        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

        document.title = 'Portfolio - ' + seventytwolions.Model.Locale.getPageTitle();

    };
    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     *
     * @param {Object} item The dom element that we want to append to the portfolio page
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
 * @module 72lions
 * @class Experiments
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Experiments = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.Experiments
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('.experiments');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     *
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
     *
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
 * @module 72lions
 * @class Blog
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Blog = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
   this.domElement = $('.blog');

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.Blog
     */
    var me = this;

    /**
     * The items container DOM Element
     *
     * @private
     * @type Object
     */
    var itemsContainer = this.domElement.find('.centered');

    /**
     * Its true the first time we load the website
     *
     * @private
     * @type Boolean
     * @default true
     */
    var isFirstTime = true;

    /**
     * The minimum columns that we can have
     *
     * @private
     * @final
     * @type Number
     * @default 1
     */
    var COLUMN_MIN = 2;

    /**
     * The column width
     *
     * @private
     * @final
     * @type Number
     * @default 218
     */
    var COLUMN_WIDTH = 218;

    /**
     * The column margin
     *
     * @private
     * @final
     * @type Number
     * @default 20
     */
    var COLUMN_MARGIN = 20;

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //seventytwolions.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
        $(window).bind("resize", onWindowResize);
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        var that = this;

        document.title = 'Blog - ' + seventytwolions.Model.Locale.getPageTitle();

        this.domElement.addClass('active');

        setTimeout(function(){
            that.domElement.css('opacity', 1);
        }, 10);

        isFirstTime = true;
        this.positionItems();
    };
    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     *
     * @param {Object} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        itemsContainer.append(item);
    };

    /**
     * Positions the grid items based on the page width
     *
     * @author Thodoris Tsiridis
     */
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

    /**
     * Triggered when the window is resized
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var onWindowResize = function() {
        me.positionItems();
    };


};

seventytwolions.View.Blog.prototype = new seventytwolions.View.Base();

/**
 * About View
 *
 * @module 72lions
 * @class About
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.About = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.About
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('.about');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.domElement.slideDown();
    };

    /**
     * Hides the view
     *
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
 * @module 72lions
 * @class Contact
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Contact = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.Contact
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
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
 * ThumbnailItem View
 *
 * @module 72lions
 * @class ThumbnailItem
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.ThumbnailItem = function() {

    /**
     * If the thumbnail item is of type featured then this value is set to true
     *
     * @type Boolean
     * @default false
     */
    this.isFeatured = false;

    /**
     * The DOM Element
     *
     * @type Object
     */
    this.domElement = $('<article class="portfolio-item clearfix"></article>');

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.ThumbnailItem
     */
    var me = this;

    /**
     * The path to the images
     *
     * @private
     * @type String
     * @default 'http://72lions.com/wp-content/uploads/'
     */
    var IMAGES_PATH = 'http://72lions.com/wp-content/uploads/';

    /**
     * The HTML template for the thumbnail item
     *
     * @private
     * @type String
     * @default '<div class="photo"><a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a><a href="${link}" title="${title}"><img class="thumbnail-image" src="${image}" alt="${title}" width="${imagewidth}" height="${imageheight}"  /></a></div><div class="description"><hgroup><a href="${link}" title="${title}" class="title"><h1>${title}</h1></a></hgroup><time>${publishdate}</time><aside>Categories: ${categories}</aside><p>${description}</p><a href="${link}" title="${title}" class="readmore">Read more</a></div>'
     */
    var tmpl = '<div class="photo">'+
                    '<a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a>'+
                    '<a href="${link}" title="${title}"><img class="thumbnail-image" src="${image}" alt="${title}" width="${imagewidth}" height="${imageheight}"  /></a>'+
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




    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name + ', ' + this.id);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {

	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Sets the current item as featured item
     *
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

   /**
     * Renders the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        var random, month, model, meta, body, pdate, url, slug, categories, categoriesStr, thumbnail, imgWidth, imgHeight, hasThumbnail, thumbnailFile;

        categoriesStr= '';
        hasThumbnail = false;
        model = this.getModel();
        body = tmpl;

        meta = model.get('Meta');
        if(meta && meta.showcase !== undefined){
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
        thumbnailFile = thumbnail.File.split('/');
        thumbnailFile = thumbnailFile[0] + '/' + thumbnailFile[1] + '/';

        if(thumbnail.Data !== null && thumbnail.Data !== undefined){

            hasThumbnail = true;

            if(this.isFeatured){
                imgWidth = thumbnail.Data.sizes.medium.width;
                imgHeight = thumbnail.Data.sizes.medium.height;
                thumbnailFile += thumbnail.Data.sizes.medium.file;
            } else {
                imgWidth = thumbnail.Data.sizes.thumbnail.width;
                imgHeight = thumbnail.Data.sizes.thumbnail.height;
                thumbnailFile += thumbnail.Data.sizes.thumbnail.file;
            }

            body = body.replace(/\${image}/g, IMAGES_PATH + thumbnailFile);
            body = body.replace(/\${imagewidth}/g, imgWidth);
            body = body.replace(/\${imageheight}/g, imgHeight);

        }
        //seventytwolions.Console.log('Drawing view with name ' + this.name);
        if(meta && meta.github !== undefined){
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
     *
     * @author Thodoris Tsiridis
     */
    this.showDescription = function() {
        this.domElement.find('p').css('display','block');
    };

    /**
     * Hides the description of the item
     *
     * @author Thodoris Tsiridis
     */
    this.hideDescription = function() {
        this.domElement.find('p').css('display','none');
    };

    /**
     * Registers all the events
     *
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function() {
        me.domElement.find('a').bind('click', onThumbnailClicked);
    };

    /**
     * Triggered when we click the thumbnail
     *
     * @private
     * @param  {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onThumbnailClicked = function(event) {
        var model, pubDate, slug, url, month, title;

        // Prevent the default functionality
        event.preventDefault();

        // Get the model
        model = me.getModel();

        // Create the link by using the publish date and the slug
        pubDate = model.get('PublishDate');
        slug = model.get('Slug');
        pubDate = new Date(pubDate.replace(/-/g ,'/'));
        month = (pubDate.getMonth() + 1);
        month = month.toString().length === 1 ? '0' + month : month;

        url = pubDate.getFullYear() + '/' + month + '/' + slug;
        title = $(this).attr('title') + ' - 72Lions - Thodoris Tsiridis - Web developer';

        // Push the current url
        Router.push(null, title, '/' + url);

        // Move to top
        window.scrollTo(0, 0);

    };

};

seventytwolions.View.ThumbnailItem.prototype = new seventytwolions.View.Base();

/**
 * PostDetails View
 *
 * @module 72lions
 * @class PostDetails
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.PostDetails = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('.post-details');

    /**
     * The id of the current article
     *
     * @type String
     * @default null
     */
    this.currentId = null;

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.PostDetails
     */
    var me = this;

    /**
     * Holds the data for a specific article
     *
     * @private
     * @type Object
     * @default null
     */
    var details = null;

    /**
     * The content DOM Element
     *
     * @type Object
     */
    var contentDomElement = this.domElement.find('.content');

    /**
     * The aside DOM Element
     *
     * @type Object
     */
    var asideDomElement = this.domElement.find('aside');

    /**
     * The title DOM Element
     *
     * @type Object
     */
    var titleDomElement = contentDomElement.find('h1.title');

    /**
     * The categories DOM Element
     *
     * @type Object
     */
    var categoriesDomElement = contentDomElement.find('.categories');

    /**
     * The text DOM Element
     *
     * @type Object
     */
    var textDomElement = contentDomElement.find('.text');

    /**
     * The time DOM Element
     *
     * @type Object
     */
    var timeDomElement = contentDomElement.find('time');

    /**
     * The github ribbon DOM Element
     *
     * @type Object
     */
    var githublinkDomElement = contentDomElement.find('.github-link');

    /**
     * The download link DOM Element
     *
     * @type Object
     */
    var downloadlinkDomElement = contentDomElement.find('.download-link');

    /**
     * The demo link DOM Element
     *
     * @type Object
     */
    var demolinkDomElement = contentDomElement.find('.demo-link');

    /**
     * The comments DOM Element
     *
     * @type Object
     */
    var commentsDomElement = this.domElement.find('.comments');

    /**
     * The back button DOM Element
     *
     * @type Object
     */
    var backDomElement = this.domElement.find('.back');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//seventytwolions.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        backDomElement.bind('click', onBackClick);
        //seventytwolions.Console.log('Post draw view with name ' + this.name);
    };

   /**
     * Renders the view
     *
     * @author Thodoris Tsiridis
     */
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

        document.title = details.Title + ' - ' + seventytwolions.Model.Locale.getPageTitle();
    };

    /**
     * Shows the view
     *
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
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };

   /**
     * Triggered when the back button is clicked
     *
     * @private
     * @param {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onBackClick = function(event){
        event.preventDefault();
        Router.goBack(1);
    };

};

seventytwolions.View.PostDetails.prototype = new seventytwolions.View.Base();

/**
 * Footer View
 *
 * @module 72lions
 * @class Footer
 * @namespace seventytwolions.View
 * @extends seventytwolions.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.View.Footer = function() {

    /**
     * The links DOM Elements
     *
     * @type Array
     * @default undefined
     */
    var $links;

    /**
     * A reference to this class
     *
     * @private
     * @type seventytwolions.View.Navigation
     */
    var me = this;

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('footer');

    /**
     * The clicked DOM Element
     *
     * @type Object
     * @default undefined
     */
    this.clickedItem = undefined;

    /**
     * The HTML template for the thumbnail item
     *
     * @private
     * @type String
     * @default '<div class="photo"><a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a><a href="${link}" title="${title}"><img class="thumbnail-image" src="${image}" alt="${title}" width="${imagewidth}" height="${imageheight}"  /></a></div><div class="description"><hgroup><a href="${link}" title="${title}" class="title"><h1>${title}</h1></a></hgroup><time>${publishdate}</time><aside>Categories: ${categories}</aside><p>${description}</p><a href="${link}" title="${title}" class="readmore">Read more</a></div>'
     */
    var tmpl = '<p>${text}</p>';

    /**
     * The Dom Element for the tweets container
     *
     * private
     * @type Object
     */
    var $tweetsContainerDomElement;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //seventytwolions.Console.log('Initializing view with name ' + this.name);
        $links = this.domElement.find('.menu a');
        $tweetsContainerDomElement = this.domElement.find('.latest-tweets article');
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
     * Shows the view
     *
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
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active').css('opacity', 0);
    };
    /**
     * Renders the latest tweets in the footer
     */
    this.showTweets = function() {
        var tweets, body, markup, len, i;

        markup = '';
        tweets = this.getModel().get('tweets');
        len = tweets.length;
        for (i = 0; i < len; i++) {

            body = tmpl;
            body = body.replace(/\${text}/g, twitterify(tweets[i].text));
            markup += body;

        }

        $tweetsContainerDomElement.append(markup);

    };

    /**
     * Gets a string and convert hashes, links and users into anchors
     *
     * @private
     * @param {String} text The tweet to convert
     * @return {String} The converted HTML
     */
    var twitterify = function (tweet) {

        //Links
        tweet = tweet.replace(/http([s]?):\/\/([^\ \)$]*)/g,"<a rel='nofollow' target='_blank' href='http$1://$2'>http$1://$2</a>");
        //Users
        tweet = tweet.replace(/(^|\s)@(\w+)/g, "$1@<a href='http://www.twitter.com/$2' target='_blank'>$2</a>");
        //Mentions
        tweet = tweet.replace(/(^|\s)#(\w+)/g, "$1#<a href='http://twitter.com/search/%23$2'target='_blank'>$2</a>");

        return tweet;

    };

    /**
     * Registers all the event listeners
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var addEventListeners = function(){
        $links.bind('click', onLinkClick);
    };

    /**
     * Triggered when we click a link
     *
     * @private
     * @param {Object} e The event
     * @author Thodoris Tsiridis
     */
    var onLinkClick = function(e){
        var $item, delay;

        e.preventDefault();

        // Cache the item
        $item = me.clickedItem = $(this);

        delay = 200;

        // Scroll to top
        $('body,html').stop().animate({scrollTop:0}, delay, 'easeOutQuint');

        setTimeout(function(){
            // Dispatch the event
            /*console.log('dispatch event')*/;
            me.dispatchEvent({type: 'menuClicked', path: me.clickedItem.attr('href'), title: me.clickedItem.attr('title')});
        }, delay + 100);

        // Clear memory
        $item = null;
    };

};

seventytwolions.View.Footer.prototype = new seventytwolions.View.Base();

seventytwolions.ControllerManager.initializeController({
    type:'Main',
    id:'main',
    model: seventytwolions.Lookup.getModel({})
});

