(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/**
 * Routing manager is responsible for listening to popstates in order to dispatch events. Clients can register their interest on these events
 *
 * @module 72lions
 * @class Router
 * @author Thodoris Tsiridis
 * @version 1.0
 */
var Router = function(global){

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
     * @private
     * @default ''
     */
    var basePath = '';

    /**
     * After how many milliseconds the app will listen for a hash change
     *
     * @type Number
     * @private
     * @default 500
     */
    var hashListenInterval = 500;

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

            history.pushState(state, title, basePath + url);

        } else {

            location.href = basePath + '#' + url;
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

            history.replaceState(state, title, basePath + url);

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

        /*console.log('registering path', path)*/;
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
     * Sets the basepath
     * @param {String} path The path to be used as the basepath
     */
    this.setBasePath = function (path) {
        basePath = path;
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
        var members = registeredPathMembers[(path)];

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
            return;
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
        return "onhashchange" in window;
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
                }, hashListenInterval);

            }
        }
    };

    init();

    return this;

}(window);
/**
 * Event target is used as a mixin so that the classes can support dispatch events and add events commands
 *
 * @module 72lions
 * @class EventTarget
 * @author Mr.Doob
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
     * @param {Object} ctx The context that will be used for the calling the callback
     * @author Mr.Doob
     */
    this.addEventListener = function ( type, listener, ctx ) {

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
     * @author Mr.Doob
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
     * @author Mr.Doob
     */
    this.removeEventListener = function ( type, listener ) {

        var index = listeners[ type ].indexOf( listener );

        if ( index !== - 1 ) {
            listeners[ type ].splice( index, 1 );
        }

    };

};
/**
 * Simulates a display object just like in AS3
 *
 * @module 72lions
 * @class Router
 * @author Thodoris Tsiridis
 * @version 1.0
 */

var CanvasDisplayObject = function() {

    var _children = [];

    this.name = '';
    this.x = 0;
    this.y  = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.visible = true;
    this.alpha = 1;
    this.extra = {};

    /**
     * It is set to true the first time we get a popstate
     *
     * @private
     * @type ST.CanvasDisplayObject
     * @default null
     */
    this.parent = null;

    /**
     * Adds a child to the display object
     *
     * @param {CanvasDisplayObject} child The display object to add as a child
     * @author Thodoris Tsiridis
     */
    this.addChild = function(child) {

        //Check if the child doesn't already exist
        if (_children.indexOf(child) === - 1) {

            //Check if the child already has a parent
            if( child.parent !== null ) {

                //If it already has a parent then remove it from it's parent
                child.parent.removeChild( child );

            }

            //Set the parent of the child
            child.parent = this;

            //Push the child in the array
            _children.push( child );

        }

    };
    /**
     * Removes a child
     *
     * @param {CanvasDisplayObject} child  The display object to remove
     * @author Thodoris Tsiridis
     */
    this.removeChild = function(child) {

        var childIndex = _children.indexOf( child );

        //Check the child index
        if (  childIndex !== - 1 ) {

            child.parent = null;

            //Remove the child from the children array
            _children.splice( childIndex, 1 );

        }
    };
    /**
     * Returns an array with all the children
     *
     * @returns {Array} The array with all the children
     * @author Thodoris Tsiridis
     */
    this.getChildren = function() {
        return _children;
    };
    /**
     * Updates the object
     *
     * @param {CanvasContext} ctx The context on which everything will be drawn
     * @author Thodoris Tsiridis
     */
    this.update = function(ctx) {

        if(this.visible !== false) {

            //Save the current translation, rotation
            ctx.save();

            //Translate Scale and Rotate
            ctx.translate(this.x, this.y);
            ctx.scale(this.scaleX,this.scaleY);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = ctx.globalAlpha * this.alpha;

            this.draw();

            //Invoke the update function for each child
            var d = 0;

            while(d < _children.length) {

                _children[d].update(ctx);

                d++;
            }

            //Restore the translation, rotation
            ctx.restore();

            d = null;

        }
    };
};

/**
 * Generic function for overwritting and adding the your code
 */
CanvasDisplayObject.prototype.draw = function() {

};
var STL = {};
STL.Controller = STL.Controller || {};
STL.View = STL.View || {};
STL.Model = STL.Model || {};
/**
 * Locale Model
 *
 * @module 72lions
 * @class Locale
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Locale = function(global){

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

}(window);
/**
 * The controller manager is responsible for instantiating controllers
 *
 * @module 72lions
 * @class ControllerManager
 * @namespace STL
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.ControllerManager = ( function() {

    return {
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
        initializeController: function(attributes, controllerOptions, viewOptions) {
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
        }
    };

})();
/**
 * Lookup up utility that loads or creates controllers, views and models
 *
 * @module 72lions
 * @class Lookup
 * @namespace STL
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Lookup = (function() {

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


    return {
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
        getController: function(attributes) {
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

        },

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
        getView: function(attributes) {
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
        },

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
        getModel: function(attributes) {
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
        }

    };

})();
/**
 * Console is used for outputing console.log messages
 *
 * @module 72lions
 * @class Console
 * @namespace STL
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Console = ( function(){

    return {

        /**
         * Set to true and debug will be enabled
         *
         * @type {Boolean}
         * @default true
         */
        debug: true,

        /**
         * Logs out a message
         *
         * @param {Object || Array || Number || String || Arguments} arguments The message to pass down to console.log
         * @author Thodoris Tsiridis
         */
        log: function() {

            if(STL.Console.debug){
                /*console.log(arguments)*/;
            }

        }
    };

})();
/**
 * Base View
 *
 * @module 72lions
 * @class Base
 * @namespace STL.View
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Base = function() {

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
     * The section title
     * @type String
     * @default ''
     */
    this.title = '';

    /**
     * A reference to this view's controller
     *
     * @type STL.Controller.Base
     * @default undefined
     */
    this._controller = undefined;

    /**
     * A reference to this view's model
     *
     * @type STL.View.Base
     * @default undefined
     */
    this._model = undefined;

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
     * Gets the model for the view
     *
     * @return {STL.Model.Base} The model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {

        if(this._controller){
            return this._controller.getModel();
        }

        return undefined;
    };

    /**
     * Sets the controller for the view
     *
     * @param {STL.Controller.Base} controller The controller
     * @author Thodoris Tsiridis
     */
    this.setController = function(controller) {
        this._controller = controller;
    };

    /**
     * Gets the controller for the view
     *
     * @return {STL.Controller.Base} The controller
     * @author Thodoris Tsiridis
     */
    this.getController = function() {
        return this._controller;
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
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @author Thodoris Tsiridis
     */
    this.preInitialize = function(attributes) {
        this.setName(attributes.type);
        this.setId(attributes.id);
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
 * @namespace STL.Model
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Base = function(){

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
 * @namespace STL.Controller
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Base = function() {

    EventTarget.call( this );

    /**
     * A reference to this controller's view
     *
     * @private
     * @type STL.View.Base
     * @property _view
     * @default undefined
     */
    this._view = undefined;

    /**
     * A reference to this controller's model
     *
     * @private
     * @type STL.Controller.Base
     * @property _model
     * @default undefined
     */
    this._model = undefined;

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
     * Initializes the plugin
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.type The class type
     * @param {String} attributes.id The unique id for this class
     * @author Thodoris Tsiridis
     */
    this.initialize = function(attributes) {
        this.id = attributes.id || id;
        this.name = attributes.type || '';

    };

    /**
     * This function is executed right after the initialized function is called
     *
     * @param {Object} options The options that will be used to initialize the controller
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(options) {

    };

    /**
     * Sets the view of the controller
     *
     * @param {seventytowlions.View.Base} view The new view
     * @author Thodoris Tsiridis
     */
    this.setView = function(view) {
        this._view = view;
    };

    /**
     * Returns the view of the specific view
     *
     * @return {STL.View.Base} The Base view
     * @author Thodoris Tsiridis
     */
    this.getView = function() {
        return this._view;
    };

    /**
     * Returns the model of the specific model
     *
     * @return {STL.Model.Base} The Base model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return this._model;
    };

    /**
     * Sets the model of the controller
     *
     * @param {seventytowlions.Model.Base} model The new model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
      this._model = model;
    };

};
/**
 * Main Controller
 *
 * @module 72lions
 * @class Main
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Main = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Blog
     */
    var me = this;

    /**
     * A reference to the navigation controller
     *
     * @private
     * @type STL.Controller.NaviMaingation
     * @default null
     */
    var navigationController = null;

    /**
     * A reference to the sections manager controller
     *
     * @private
     * @type STL.Controller.SectionsManager
     * @default null
     */
    var sectionsManager = null;

    /**
     * A reference to the footer controller
     *
     * @private
     * @type STL.Controller.Footer
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

        navigationController = STL.ControllerManager.initializeController({
            type:'Navigation',
            id:'navigation',
            model: STL.Lookup.getModel({})
        });

        sectionsManager  = STL.ControllerManager.initializeController({
            type:'SectionsManager',
            id:'sectionsmanager',
            model: STL.Lookup.getModel({})
        });

        sectionsManager.addEventListener('onSectionLoaded', onSectionLoaded);
        sectionsManager.addEventListener('onChangeSectionDispatched', onChangeSectionDispatched);

        footerController  = STL.ControllerManager.initializeController({
            type:'Footer',
            id:'Footer',
            model: STL.Lookup.getModel({
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
        sectionsManager.showSectionWithName(state);
    };

    var onSectionLoaded = function(){
        footerController.show();
    };

    var onChangeSectionDispatched = function(){
        footerController.hide();
    };
};

STL.Controller.Main.prototype = new STL.Controller.Base();
/**
 * Navigation Controller
 *
 * @module 72lions
 * @class Navigation
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Navigation = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Navigation
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
        Router.push(null, event.title + ' - ' + STL.Model.Locale.getPageTitle(), event.path);

    };

};

STL.Controller.Navigation.prototype = new STL.Controller.Base();
/**
 * Sections Manager Controller
 *
 * @module 72lions
 * @class SectionsManager
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.SectionsManager = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.SectionsManager
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
     * @type STL.Controller.Portfolio
     * @property portfolio
     * @default undefined
     */
    var portfolio;

    /**
     * The Experiments Controller
     *
     * @private
     * @type STL.Controller.Experiments
     * @property experiments
     * @default undefined
     */
    var experiments;

    /**
     * The Tag Controller
     *
     * @private
     * @type STL.Controller.Tag
     * @property tag
     * @default undefined
     */
    var tag;

    /**
     * The Blog Controller
     *
     * @private
     * @type STL.Controller.Blog
     * @property blog
     * @default undefined
     */
    var blog;

    /**
     * The initial state of the website
     *
     * @private
     * @type STL.Controller.Contact
     * @property contact
     * @default undefined
     */
    var contact;

    /**
     * The Post Details Controller
     *
     * @private
     * @type STL.Controller.PostDetails
     * @property postDetails
     * @default undefined
     */
    var postDetails;

    /**
     * The array that will hold all the sections
     *
     * @private
     * @type Array
     * @property sections
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
     * The current section name
     *
     * @private
     * @type String
     * @default '-'
     */
    var currentSection = '-';

    /**
     * This function is executed right after the initialized function is called
     *
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

        // Initializing the portfolio controller, view and model
        portfolio = STL.ControllerManager.initializeController({
                type:'Portfolio',
                id:'portfolio',
                model: STL.Lookup.getModel({
                    type:'Posts',
                    id:'portfolioModel'
                })
        });

        portfolio.addEventListener('onSectionLoaded', onSectionLoaded);
        portfolio.addEventListener('onDataStartedLoading', onDataStartedLoading);

        // Initializing the experiments controller, view and model
        experiments = STL.ControllerManager.initializeController({
            type:'Grid',
            id:'experiments',
            view: STL.Lookup.getView({type:'Grid', id: 'experiments'}),
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'experimentsModel'
            })
        },
        {categoryId:4, modelName:'Experiments'},
        {domElement: $('.experiments'), title:'Experiments'});

        experiments.addEventListener('onSectionLoaded', onSectionLoaded);
        experiments.addEventListener('onDataStartedLoading', onDataStartedLoading);

        // Initializing the blog controller, view and model
        blog = STL.ControllerManager.initializeController({
            type:'Grid',
            id:'blog',
            view: STL.Lookup.getView({type:'Grid', id: 'blog'}),
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'blogModel'
            })
        },
        {categoryId:3, modelName:'Blog'},
        {domElement: $('.blog'), title:'Blog'});

        blog.addEventListener('onSectionLoaded', onSectionLoaded);
        blog.addEventListener('onDataStartedLoading', onDataStartedLoading);

        sections = [{name: 'portfolio', object: portfolio}, {name:'experiments', object: experiments}, {name:'blog', object: blog}];

        // Initializing the article details controller, view and model
        postDetails = STL.ControllerManager.initializeController({
            type:'PostDetails',
            id:'postDetails',
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'postDetailsModel'
            })
        });

        postDetails.addEventListener('onSectionLoaded', onSectionLoaded);
        postDetails.addEventListener('onDataStartedLoading', onDataStartedLoading);

        // Initializing the experiments controller, view and model
        tag = STL.ControllerManager.initializeController({
            type:'Tags',
            id:'tag',
            view: STL.Lookup.getView({type:'Tags', id: 'tag'}),
            model: STL.Lookup.getModel({
                type:'Posts',
                id:'tagsModel'
            })
        });

        tag.addEventListener('onSectionLoaded', onSectionLoaded);
        tag.addEventListener('onDataStartedLoading', onDataStartedLoading);

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

            //If this is the same section then don't do anything
            if (currentSection === section) {
                return;
            }

            currentSection = section;

            for (i = 0; i < len; i++) {

                if(sections[i].name === section){

                    this.dispatchEvent({type:'onChangeSectionDispatched'});
                    sections[i].object.show();

                } else {

                    sections[i].object.hide();

                }

            }

            postDetails.hide();
            tag.hide();

        } else {

            if (state) {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/' + state.path]);

                if(state.pathSegments[0] === 'tag') {

                    section = state.pathSegments[state.pathSegments.length - 2];
                    tagId = state.pathSegments[state.pathSegments.length - 1];

                    //If this is the same section then don't do anything
                    if (currentSection === section) {
                        return;
                    }

                    currentSection = section;

                    // if we don't have a path segment with category at its first position
                    for (i = 0; i < len; i++) {
                        sections[i].object.hide();
                    }

                    this.dispatchEvent({type:'onChangeSectionDispatched'});
                    postDetails.hide();

                    tag.loadData(tagId);


                } else {

                    section = state.pathSegments[state.pathSegments.length - 1];

                    //If this is the same section then don't do anything
                    if (currentSection === section) {
                        return;
                    }

                    currentSection = section;

                    // if we don't have a path segment with category at its first position
                    for (i = 0; i < len; i++) {
                        sections[i].object.hide();
                    }

                    this.dispatchEvent({type:'onChangeSectionDispatched'});
                    postDetails.load(section);
                }


            } else {

                // Trackk ajax calls with google analytics
                _gaq.push(['_trackPageview', '/']);

                section = 'blog';

                //If this is the same section then don't do anything
                if (currentSection === section) {
                    return;
                }

                currentSection = section;

                postDetails.hide();

                for (i = 0; i < len; i++) {

                    if(sections[i].name !== 'blog'){
                        sections[i].object.hide();
                    }

                }

                this.dispatchEvent({type:'onChangeSectionDispatched'});
                blog.show();

            }

        }

    };

    /**
     * Triggered when a section dispatches a onSectionLoaded event
     *
     * @private
     * @param {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onSectionLoaded = function(event){
        me.dispatchEvent({type:'onSectionLoaded'});
        me.getView().hidePreloader();
    };

    /**
     * Triggered when a section dispatches a onDataStartedLoading event
     *
     * @private
     * @param {Object} event The event
     * @author Thodoris Tsiridis
     */
    var onDataStartedLoading = function (event){
        me.getView().showPreloader();
    };

};

STL.Controller.SectionsManager.prototype = new STL.Controller.Base();
/**
 * Portfolio Controller
 *
 * @module 72lions
 * @class Portfolio
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Portfolio = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Portfolio
     */
    var me = this;

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

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.loadData();
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
    this.loadData = function() {
        if(typeof(this.getModel().get('Portfolio')) === 'undefined'){
            this.dispatchEvent({type:'onDataStartedLoading'});
            this.getModel().getPosts(7, 0, 80, onDataLoaded, this);
        } else {
             onDataLoaded.call(this, this.getModel().get('Portfolio'));
        }
    };

    /**
     * Callback function that is triggered when the model posts are loaded
     *
     * @param  {Object} result The result that came back from the model
     * @author Thodoris Tsiridis
     */
    var onDataLoaded = function(result) {
        var i;
        if(typeof(this.getModel().get('Portfolio')) === 'undefined'){

            this.getModel().set('Portfolio', result);

            for (i = 0; i < result.length; i++) {
                portfolioItems.push(
                    STL.ControllerManager.initializeController({
                        type:'ThumbnailItem',
                        id:'ThumbnailItem' + result[i].Id,
                        model: STL.Lookup.getModel({
                            data:result[i]
                        })
                    })
                );

                portfolioItems[i].getView().render();
                this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
            }

            this.getView().render();
        }

        this.getView().show();
        this.dispatchEvent({type:'onSectionLoaded'});

    };

};

STL.Controller.Portfolio.prototype = new STL.Controller.Base();
/**
 * Grid Controller
 *
 * @module 72lions
 * @class Grid
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Grid = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Blog
     */
    var me = this;

    /**
     * An array with all the portfolio items
     *
     * @private
     * @type Array
     * @default []
     */
    var portfolioItems = [];

    /**
     * The id of the blog category
     *
     * @private
     * @type Number
     * @default 3
     */
    var categoryId = 3;

    /**
     * The name of the data from the model
     *
     * @private
     * @type String
     * @default 'Blog'
     */
    var modelName = 'Blog';

    /**
     * This function is executed right after the initialized function is called
     *
     * @param {Object} options The options to use when initialing the controller
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(options){

        if(options){
            modelName = options.modelName || modelName;
            categoryId = options.categoryId || categoryId;
        }

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){

        this.loadData();

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
    this.loadData = function() {
        if(typeof(this.getModel().get(modelName)) === 'undefined'){
            this.dispatchEvent({type:'onDataStartedLoading'});
            this.getModel().getPosts(categoryId, 0, 80, onDataLoaded, this);
        } else {
             onDataLoaded.call(this, this.getModel().get(modelName));
        }

    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onDataLoaded = function(result) {
        var i;

        if(typeof(this.getModel().get(modelName)) === 'undefined'){

            this.getModel().set(modelName, result);

            for (i = 0; i < result.length; i++) {

                portfolioItems.push(
                    STL.ControllerManager.initializeController({
                        type:'ThumbnailItem',
                        id:modelName + 'ThumbnailItem' + result[i].Id,
                        model: STL.Lookup.getModel({
                            data:result[i]
                        })
                     })
                );


                portfolioItems[i].getView().render();
                portfolioItems[i].getView().showDescription();
                this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
            }

            this.getView().render();
        }

        this.dispatchEvent({type:'onSectionLoaded'});
        this.getView().show();

    };

};

STL.Controller.Grid.prototype = new STL.Controller.Base();
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
/**
 * Contact Controller
 *
 * @module 72lions
 * @class Contact
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Contact = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Contact
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

STL.Controller.Contact.prototype = new STL.Controller.Base();
/**
 * ThumbnailItem Controller
 *
 * @module 72lions
 * @class ThumbnailItem
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.ThumbnailItem = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.ThumbnailItem
     */
    var me = this;

    /**
     * This function is executed right after the initialized function is called
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(){

    };

};

STL.Controller.ThumbnailItem.prototype = new STL.Controller.Base();
/**
 * PostDetails Controller
 *
 * @module 72lions
 * @class PostDetails
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.PostDetails = function() {
    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.PostDetails
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
                this.dispatchEvent({type:'onDataStartedLoading'});
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
        this.dispatchEvent({type:'onSectionLoaded'});
        this.show();
    };

};

STL.Controller.PostDetails.prototype = new STL.Controller.Base();
/**
 * Footer Controller
 *
 * @module 72lions
 * @class Footer
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Footer = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Footer
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
        this.loadFlickrPhotos();

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
     * Loads the Flickr photos
     */
    this.loadFlickrPhotos = function() {
        this.getModel().getFlickr(onFlickrLoaded, this);
    };

    /**
     * Callback function for when we get all the data from the Twitter ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onTweetsLoaded = function(result) {
        this.getView().showTweets();
    };

    /**
     * Callback function for when we get all the data from the Flickr ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onFlickrLoaded = function(result) {
        this.getView().showFlickrPhotos();
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
        Router.push(null, event.title + ' - ' + STL.Model.Locale.getPageTitle(), event.path);

    };

};

STL.Controller.Footer.prototype = new STL.Controller.Base();
/**
 * Tags Controller
 *
 * @module 72lions
 * @class Tags
 * @namespace STL.Controller
 * @extends STL.Controller.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Controller.Tags = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.Controller.Blog
     */
    var me = this;

    /**
     * An array with all the portfolio items
     *
     * @private
     * @type Array
     * @default []
     */
    var portfolioItems = [];

    /**
     * The name of the data from the model
     *
     * @private
     * @type String
     * @default 'Tag'
     */
    var modelName = 'Tag';

    /**
     * The id of the tag
     *
     * @public
     * @type Number
     * @default 0
     */
    this.tagId = 0;

    /**
     * This function is executed right after the initialized function is called
     *
     * @param {Object} options The options to use when initialing the controller
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(options){

        if(options){
            modelName = options.modelName || modelName;
        }

    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){

        this.loadData();

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
     *@param {NUmber} tagId The id of the tag that we need to load
     * @author Thodoris Tsiridis
     */
    this.loadData = function(tagId) {

        this.tagId = tagId;

        if(typeof(this.getModel().get(modelName+tagId)) === 'undefined'){
            this.dispatchEvent({type:'onDataStartedLoading'});
            this.getModel().getTags(tagId, 0, 80, onDataLoaded, this);
        } else {
             onDataLoaded.call(this, this.getModel().get(modelName+tagId));
        }

    };

    /**
     * Callback function for when we get all the data from the ajax call
     *
     * @private
     * @param  {Object} result The result object
     * @author Thodoris Tsiridis
     */
    var onDataLoaded = function(result) {
        var i;

        for (i = 0; i < result.length; i++) {

            portfolioItems.push(
                STL.ControllerManager.initializeController({
                    type:'ThumbnailItem',
                    id:modelName + 'ThumbnailItem' + result[i].Id,
                    model: STL.Lookup.getModel({
                        data:result[i]
                    })
                 })
            );

            portfolioItems[i].getView().setAsFeatured(false);
            portfolioItems[i].getView().render();
            portfolioItems[i].getView().showDescription();
            this.getView().addPortfolioItem(portfolioItems[i].getView().domElement);
        }

        this.getView().render();

        this.dispatchEvent({type:'onSectionLoaded'});
        this.getView().show();

    };

};

STL.Controller.Tags.prototype = new STL.Controller.Base();
/**
 * Categories Model
 *
 * @module 72lions
 * @class Categories
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Categories = function(){

    /**
     * The response object that came from the ajax call
     *
     * @private
     * @property response
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The object that holds the data
     *
     * @private
     * @type Object
     */
    var data = {};

    /**
     * The api url for the categories
     *
     * @private
     * @type String
     * @default '/api/get.php'
     */
    var CATEGORIES_URL = '/api/get.php';

    /**
     * The start offset for the categories
     *
     * @private
     * @type Number
     * @default 0
     */
    var DEFAULT_START = 0;

    /**
     * The total number of items to retrieve from the api
     *
     * @private
     * @type Number
     * @default 10
     */
    var DEFAULT_NUMBER_OF_ITEMS = 10;

    /**
     * Gets an array of categories by doing an Ajax call
     *
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.get = function(start, total, callback, ctx) {
        var dataString, me;

        me = this;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 'categories&s=' + start + '&t=' + total;

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

STL.Model.Categories.prototype = new STL.Model.Base();
/**
 * Posts Model
 *
 * @module 72lions
 * @class Posts
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Posts = function(){

    /**
     * The api url for the posts
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php'
     */
    var POSTS_URL = '/api/get.php';

    /**
     * The api url for the tags
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php'
     */
    var TAGS_URL = '/api/get.php';

    /**
     * The api url for the posts details
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php'
     */
    var POST_DETAILS_URL = '/api/get.php';

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
     * @property req
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The ajax request for the details call as returned from jQuery.ajax()
     *
     * @private
     * @property reqDetails
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
     * Gets an array of posts by doing an Ajax Call
     *
     * @param {Number} categoryId The category of the posts that we want to load
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.getPosts = function(categoryid, start, total, callback, ctx) {
        var dataString, me;

        me = this;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 'posts&s=' + start + '&t=' + total;

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
     * Gets an array of posts based on the tag id by doing an Ajax Call
     *
     * @param {Number} tagId The category of the posts that we want to load
     * @param {Number} start The start offset
     * @param {Number} total The total number of items that we want to get
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.getTags = function(tagId, start, total, callback, ctx) {
        var dataString, me;

        me = this;

        start = start || DEFAULT_START;
        total = total || DEFAULT_NUMBER_OF_ITEMS;

        dataString = 'tag&s=' + start + '&t=' + total;

        if(tagId !== null){
            dataString += '&tid=' + tagId;
        }

        if(req !== undefined){
            req.abort();
        }

        req = $.ajax({
            url: TAGS_URL,
            dataType: 'json',
            data: dataString,
            success: function(res){
                me.set('Tag' + tagId, res.Results);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('Tag' + tagId)]);
                    req = undefined;
                }
            }
        });
    };

    /**
     *  Gets the details of an article
     *
     * @param {String} slug The slug of the page
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
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
            data: 'postdetails&id=' + slug,
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

STL.Model.Posts.prototype = new STL.Model.Base();
/**
 * Footer Model
 *
 * @module 72lions
 * @class Footer
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Footer = function(){

    /**
     * The api url for the tweets
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php'
     */
    var TWITTER_URL = '/api/get.php';

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
     * The api url for the flickr photos
     *
     * @private
     * @final
     * @type String
     * @default '/api/get.php?flickr'
     */
    var FLICKR_URL = '/api/get.php?flickr';

    /**
     * The ajax request as returned from jQuery.ajax()
     *
     * @private
     * @property req
     * @type jqXHR
     * @default undefined
     */
    var req;

    /**
     * The ajax request as returned from jQuery.ajax() for the Flickr call
     *
     * @private
     * @property reqFlickr
     * @type jqXHR
     * @default undefined
     */
    var reqFlickr;

    /**
     * The object that holds the data
     *
     * @private
     * @type String
     */
    var data = {};

    /**
     *  Gets an array of tweets by doing an Ajax Call
     *
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.getTweets = function(callback, ctx) {
        var dataString, me;
        me = this;

        dataString = 'tweets&t=' + TOTAL_TWEETS;

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

    /**
     *  Gets an array of Flickr images by doing an Ajax Call
     *
     * @param {Function} callback The callback function that will be executed
     * @param {Function} ctx The context
     * @author Thodoris Tsiridis
     */
    this.getFlickr = function(callback, ctx) {
        var dataString, me;
        me = this;

        if(reqFlickr !== undefined){
            reqFlickr.abort();
        }

        reqFlickr = $.ajax({
            url: FLICKR_URL,
            dataType: 'json',
            success: function(res){
                me.set('flickr', res.items);
                if(typeof(callback) !== 'undefined' && typeof(callback) !== 'null'){
                    callback.apply(ctx, [me.get('flickr')]);
                    reqFlickr = undefined;
                }
            },

            error: function() {

            }
        });

    };

};

STL.Model.Footer.prototype = new STL.Model.Base();
/**
 * Main View
 *
 * @module 72lions
 * @class Main
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Main = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
	this.domElement = $('#wrapper');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //STL.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
    };
};

STL.View.Main.prototype = new STL.View.Base();
/**
 * Navigation View
 *
 * @module 72lions
 * @class Navigation
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Navigation = function() {

    /**
     * The links DOM Elements
     *
     * @type Array
     * @property $links
     * @default undefined
     */
    var $links;

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Navigation
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
        //STL.Console.log('Initializing view with name ' + this.name);
        $links = this.domElement.find('a');
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
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

STL.View.Navigation.prototype = new STL.View.Base();
/**
 * Sections Manager View
 *
 * @module 72lions
 * @class SectionsManager
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.SectionsManager = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.SectionsManager
     */
    var me = this;

    /**
     * The HTML Element
     *
     * @type Object
     */
	this.domElement = $('#sections-wrapper');

    /**
     * This is the preloader for each section
     *
     * @private
     * @type Object
     */
    var preloader = this.domElement.find('.preloader');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
    };

    /**
     * Shows the preloader
     *
     * @author Thodoris Tsiridis
     */
    this.showPreloader = function(){
        preloader.addClass('active');
        setTimeout(function(){
            preloader.css('opacity', 1);
        }, 10);
    };

    /**
     * Hides the preloader
     *
     * @author Thodoris Tsiridis
     */
    this.hidePreloader = function (){
        preloader.removeClass('active').css('opacity', 0);
    };

};

STL.View.SectionsManager.prototype = new STL.View.Base();
/**
 * Portfolio View
 *
 * @module 72lions
 * @class Portfolio
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Portfolio = function() {

    /**
     * The DOM Element
     *
     * @type Object
     */
    this.domElement = $('.portfolio');

    /**
     * The section title
     * @type String
     */
    this.title = 'Blog';

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Portfolio
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
     * The markup that will be rendered on the page
     *
     * @private
     * @type Object
     * @default ''
     */
    var markup = $('<div>');

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
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

        document.title = this.title + ' - ' + STL.Model.Locale.getPageTitle();

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
        markup.append(item);
    };


    /**
     * Renders the html markup on the page
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        itemsContainer.html(markup);
    };

};

STL.View.Portfolio.prototype = new STL.View.Base();
/**
 * Grid View
 *
 * @module 72lions
 * @class Grid
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Grid = function() {

    /**
     * The DOM Element
     *
     * @property {Object} domElement The DOM element
     */
   this.domElement = $('.blog');

    /**
     * The section title
     *
     * @property {String} title The section title
     */
    this.title = 'Blog';

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Blog
     */
    var me = this;

    /**
     * The items container DOM Element
     *
     * @private
     * @property {Object} itemsContainer The items container DOM Element
     * @type Object
     */
    var itemsContainer;

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
     * The markup that will be rendered on the page
     *
     * @private
     * @type Object
     * @default ''
     */
    var markup = $('<div>');

    /**
     * Initializes the view
     *
     * @param {Object} options The options to use when initializing the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(options){
        //STL.Console.log('Initializing view with name ' + this.name);
        if(options){
            this.domElement = options.domElement || this.domElement;
            this.title = options.title || this.title;
        }

        itemsContainer = this.domElement.find('.centered');

    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //STL.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
        $(window).bind("resize", onWindowResize);
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        //STL.Console.log('Show view with name ' + this.name);
        var that = this;

        document.title = this.title + ' - ' + STL.Model.Locale.getPageTitle();

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
        //STL.Console.log('Hide view with name ' + this.name);
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     *
     * @param {Object} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        markup.append(item);
    };


    /**
     * Renders the html markup on the page
     *
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        itemsContainer.append(markup);
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
            if(!Modernizr.mq('all and (max-width: 600px)')) {

                $(this).css({
                    left: target_x + "px",
                    top: target_y + COLUMN_MARGIN + "px"
                });

            }

            itemBottom = parseInt(target_y + COLUMN_MARGIN,0) + $(this).innerHeight();

            if(maxHeight < itemBottom){
                maxHeight = itemBottom;
            }

            _8 = (_8 < _b) ? _b : _8;

        });

        if(!Modernizr.mq('all and (max-width: 600px)')) {
            if (maxHeight > 0 ){
                itemsContainer.attr('style', 'height: ' + maxHeight + 'px');
            }
        } else {
            itemsContainer.css('height', 'auto !important');
        }

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

STL.View.Grid.prototype = new STL.View.Base();
/**
 * About View
 *
 * @module 72lions
 * @class About
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.About = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.About
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
        //STL.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
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

STL.View.About.prototype = new STL.View.Base();
/**
 * Contact View
 *
 * @module 72lions
 * @class Contact
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Contact = function() {

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Contact
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
        //STL.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
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

STL.View.Contact.prototype = new STL.View.Base();
/**
 * ThumbnailItem View
 *
 * @module 72lions
 * @class ThumbnailItem
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.ThumbnailItem = function() {

    /**
     * If the thumbnail item is of type featured then this value is set to true
     *
     * @type Boolean
     * @default false
     */
    this.isFeatured = false;

    /**
     * If the thumbnail item shouldn't explicity not be featured this would be true
     *
     * @type Boolean
     * @default false
     */
    this.explicityNotFeatured = false;

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
     * @type STL.View.ThumbnailItem
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
     * @default ''
     */
    var tmpl = '<div class="photo">'+
                    '<a href="${github}" target="_blank" class="github-ribbon"><img src="/assets/images/github-ribbon.png" border="0" alt="Fork me on github" /></a>'+
                    '<a href="${fwa}" target="_blank" class="fwasotd-ribbon"><img src="/assets/images/fwa_sotd.png" border="0" alt="FWA Site of the day" /></a>'+
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
        //STL.Console.log('Initializing view with name ' + this.name + ', ' + this.id);
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
        //STL.Console.log('Post draw view with name ' + this.name);
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
            this.explicityNotFeatured = true;
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
        if(meta && meta.showcase !== undefined && !this.explicityNotFeatured){
            this.setAsFeatured(true);
        }

        //Firefox doesn't like dates with / in the constructor
        pDate = new Date(model.get('PublishDate').replace(/-/g ,'/'));
        body = body.replace(/\${publishdate}/g, STL.Model.Locale.getDayName(pDate.getDay()) + ', ' +  STL.Model.Locale.getMonthName(pDate.getMonth()) + ' ' + pDate.getDate() +  ' ' + pDate.getFullYear());

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

            thumbnailFile += thumbnail.Data.sizes.medium.file;

            if(this.isFeatured){
                imgWidth = parseInt(thumbnail.Data.sizes.medium.width, 0) + 6;
                imgHeight = parseInt(thumbnail.Data.sizes.medium.height, 0) + 6;

            } else {
                imgWidth = parseInt(thumbnail.Data.sizes.thumbnail.width, 0) + 6;
                imgHeight = parseInt(thumbnail.Data.sizes.thumbnail.height, 0) + 6;
                //thumbnailFile += thumbnail.Data.sizes.thumbnail.file;
            }

            body = body.replace(/\${image}/g, IMAGES_PATH + thumbnailFile);
            // Plus 6 for the border
            body = body.replace(/\${imagewidth}/g, imgWidth);
            body = body.replace(/\${imageheight}/g, imgHeight);

        }
        //STL.Console.log('Drawing view with name ' + this.name);
        if(meta && meta.github !== undefined){
            body = body.replace(/\${github}/g, meta.github);
        }

        if(meta && meta.fwa_sotd !== undefined){
            body = body.replace(/\${fwa}/g, meta.fwa_sotd);
        }

        this.domElement.html(body);

        if(meta.github !== undefined){
          this.domElement.find('.github-ribbon').css('display', 'block');
        } else {
            this.domElement.find('.github-ribbon').remove();
        }

        if(meta.fwa_sotd !== undefined){
            this.domElement.find('.fwasotd-ribbon').css('display', 'block');
        } else {
            this.domElement.find('.fwasotd-ribbon').remove();
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

STL.View.ThumbnailItem.prototype = new STL.View.Base();
/**
 * PostDetails View
 *
 * @module 72lions
 * @class PostDetails
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.PostDetails = function() {

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
     * @type STL.View.PostDetails
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
     * @private
     * @type Object
     */
    var contentDomElement = this.domElement.find('.content');

    /**
     * The subtitle DOM Element
     *
     * @private
     * @type Object
     */
    var subtitleDomElement = this.domElement.find('.sidebar h2');

    /**
     * The aside DOM Element
     *
     * @private
     * @type Object
     */
    var asideDomElement = this.domElement.find('aside');

    /**
     * The title DOM Element
     *
     * @private
     * @type Object
     */
    var titleDomElement = contentDomElement.find('h1.title');

    /**
     * The categories DOM Element
     *
     * @private
     * @type Object
     */
    var categoriesDomElement = contentDomElement.find('.categories');

    /**
     * The text DOM Element
     *
     * @private
     * @type Object
     */
    var textDomElement = contentDomElement.find('.text');

    /**
     * The time DOM Element
     *
     * @private
     * @type Object
     */
    var timeDomElement = contentDomElement.find('time');

    /**
     * The github ribbon DOM Element
     *
     * @private
     * @type Object
     */
    var githublinkDomElement = contentDomElement.find('.github-link');

    /**
     * The download link DOM Element
     *
     * @private
     * @type Object
     */
    var downloadlinkDomElement = contentDomElement.find('.download-link');

    /**
     * The demo link DOM Element
     *
     * @private
     * @type Object
     */
    var demolinkDomElement = contentDomElement.find('.demo-link');

    /**
     * The visit website link DOM Element
     *
     * @private
     * @type Object
     */
    var visitWebsiteinkDomElement = contentDomElement.find('.website-link');

    /**
     * The comments DOM Element
     *
     * @private
     * @type Object
     */
    var commentsDomElement = this.domElement.find('.comments');


    /**
     * The tags DOM Element
     *
     * @private
     * @type Object
     */
    var tagsDomElement = this.domElement.find('.tags');


    /**
     * The tags template
     *
     * @private
     * @type String
     */
    var tagsTmpl = '<li><a href="${taglink}">${tag}</a></li>';

    /**
     * The back button DOM Element
     *
     * @private
     * @type Object
     */
    var backDomElement = this.domElement.find('.back');

    /**
     * Holds the total number of tries to load the disquss plugin
     *
     * @private
     * @final
     * @type {Number}
     */
    var TOTAL_DISQUS_TRIES = 10;

    /**
     * Holds the current number of tries to load the disquss plugin
     *
     * @private
     * @type {Number}
     */
    var disqusCurrentLoadTries = 0;
    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        backDomElement.bind('click', onBackClick);
        //STL.Console.log('Post draw view with name ' + this.name);
    };

   /**
     * Renders the view
     *
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        var asideHTML, categoriesStr, tagsStr, tags, categories, tagTmpl, pDate, slug, url, i;

        asideHTML = categoriesStr = '';

        details = this.getModel().get('PostDetails'+this.currentId);

        textDomElement.html(details.Content);

        // Create categories string
        categories = details.Categories;

        for (i = 0; i < categories.length; i++) {

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

        // Create the tags string
        tags = details.Tags;
        tagsStr = '';

        for (i = 0; i < tags.length; i++) {
            tagTmpl = tagsTmpl;
            tag = '';
            tag = tagTmpl.replace(/\${tag}/g, tags[i].name);
            tag = tag.replace(/\${taglink}/g, '/tag/'+tags[i].slug+'/' + tags[i].id);
            tagsStr += tag;
        }

        if(tagsStr !== '') {
            tagsDomElement.html(tagsStr);
            tagsDomElement.css('display','block');
        } else {
            tagsDomElement.css('display','none');
        }

        //STL.Console.log('Drawing view with name ' + this.name);
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

        if(typeof(details.Meta.visit_link) !== 'undefined') {
            visitWebsiteinkDomElement.attr('href', details.Meta.visit_link);
            visitWebsiteinkDomElement.addClass('visible');
        } else {
            visitWebsiteinkDomElement.removeClass('visible');
        }

        //Firefox doesn't like dates with / in the constructor
        pDate = new Date(details.PublishDate.replace(/-/g ,'/'));
        timeDomElement.html(STL.Model.Locale.getDayName(pDate.getDay()) + ', ' +  STL.Model.Locale.getMonthName(pDate.getMonth()) + ' ' + pDate.getDate() +  ' ' + pDate.getFullYear());
        titleDomElement.html(details.Title);
        asideDomElement.html(asideHTML);

        slug = details.Slug;
        month = (pDate.getMonth() + 1).toString();
        month = month.length === 1 ? "0" + month : month;
        url = '/' + pDate.getFullYear() + '/' + month + '/' + slug;


        disqusCurrentLoadTries = TOTAL_DISQUS_TRIES;

        if(details.Meta.dsq_thread_id) {
            tryToLoadDisqus(details.Meta.dsq_thread_id, url);
        } else {
            commentsDomElement.css('display', 'none');
        }

        if(details.Description !== '') {
            subtitleDomElement.html(details.Description);
            subtitleDomElement.css('display', 'block');
        } else {
            subtitleDomElement.css('display', 'none');
        }



        document.title = details.Title + ' - ' + STL.Model.Locale.getPageTitle();
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

    /**
     * Tries to load the Disqus plugin. If it is not loaded then it tries again after one second. It will do that for 10 times
     *
     * @private
     * @param  {String} threadId The disqus thread id
     * @param  {String} url The url of the article
     * @author Thodoris Tsiridis
     */
    var tryToLoadDisqus = function(threadId, url){
        // If the disqus plugin is loaded
        if(window.isDisqusLoaded) {

            // Show the comments Dom Element
            commentsDomElement.css('display', 'block');

            // Load the corrent comment thread
            DISQUS.reset({
              reload: true,
              config: function () {
                this.page.identifier = threadId;
                this.page.url = "http://72lions.com" + url;
              }
            });

        } else {
            // Try again only if we haven't tried 10 times before
            if(disqusCurrentLoadTries >= 0){
                setTimeout(function(){tryToLoadDisqus(threadId, url);}, 1000);
            }

            disqusCurrentLoadTries--;
        }

    };

};

STL.View.PostDetails.prototype = new STL.View.Base();
/**
 * Footer View
 *
 * @module 72lions
 * @class Footer
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Footer = function() {

    /**
     * The total number of flickr photos to show
     *
     * final
     * @type Number
     * @default 4
     */
    var TOTAL_FLICKR_PHOTOS = 14;

    /**
     * The links DOM Elements
     *
     * @type Array
     * @property $links
     * @default undefined
     */
    var $links;

    /**
     * A reference to this class
     *
     * @
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
     * @default ''
     */
    var tweetTmpl = '<p>${text}</p>';

    /**
     * The HTML template for the flickr thumbnail
     *
     * @private
     * @type String
     * @default ''
     */
    var flickrTmpl = '<a href="${link}" title="${title}" target="_blank"><img src="${src}" alt="${title}" /></a>';


    /**
     * The Dom Element for the tweets container
     *
     * private
     * @type Object
     * @property $tweetsContainerDomElement
     * @default undefined
     */
    var $tweetsContainerDomElement;

    /**
     * The Dom Element for the flickr photos container
     *
     * private
     * @type Object
     * @property $flickrContainerDomElement
     * @default undefined
     */
    var $flickrContainerDomElement;

    /**
     * Initializes the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){
        //STL.Console.log('Initializing view with name ' + this.name);
        $links = this.domElement.find('.menu a');
        $tweetsContainerDomElement = this.domElement.find('.latest-tweets article');
        $flickrContainerDomElement = this.domElement.find('.flickr-photos nav');
    };

    /**
     * Draws the specific view
     * @author Thodoris Tsiridis
     */
	this.draw = function() {
		//STL.Console.log('Drawing view with name ' + this.name);
	};

   /**
     * Executed after the drawing of the view
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
        addEventListeners();
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        this.domElement.addClass('active');
    };

    /**
     * Hides the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        this.domElement.removeClass('active');
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

            body = tweetTmpl;
            body = body.replace(/\${text}/g, twitterify(tweets[i].text));
            markup += body;

        }

        $tweetsContainerDomElement.append(markup);

    };

    /**
     * Renders the Flickr photos
     *
     * @author Thodoris Tsiridis
     */
    this.showFlickrPhotos = function() {
        var photos, i, body, markup;

        // Get the data from the model
        photos = tweets = this.getModel().get('flickr');
        markup = '';

        if(photos.length < TOTAL_FLICKR_PHOTOS){
            TOTAL_FLICKR_PHOTOS = photos.length;
        }

        // Loop through the photos objects
        for (i = 0; i < TOTAL_FLICKR_PHOTOS; i++) {

            body = flickrTmpl;
            body = body.replace(/\${link}/g, photos[i].link);
            body = body.replace(/\${title}/g, photos[i].title);
            body = body.replace(/\${src}/g, photos[i].media.m);
            markup += body;

        }

        $flickrContainerDomElement.append(markup);

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

STL.View.Footer.prototype = new STL.View.Base();
/**
 * Tags View
 *
 * @module 72lions
 * @class Tags
 * @namespace STL.View
 * @extends STL.View.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.View.Tags = function() {

    /**
     * The DOM Element
     *
     * @property {Object} domElement The DOM element
     */
   this.domElement = $('.tag');

    /**
     * The section title
     * @type String
     */
    this.title = 'Tag';

    /**
     * A reference to this class
     *
     * @private
     * @type STL.View.Blog
     */
    var me = this;

    /**
     * The items container DOM Element
     *
     * @private
     * @property {Object} itemsContainer The items container DOM Element
     * @type Object
     */
    var itemsContainer;

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
     * The markup that will be rendered on the page
     *
     * @private
     * @type Object
     * @default ''
     */
    var markup = $('<div>');

    /**
     * Initializes the view
     *
     * @param {Object} options The options to use when initializing the view
     * @author Thodoris Tsiridis
     */
    this.initialize =  function(){

        itemsContainer = this.domElement.find('.centered');

    };

    /**
     * Draws the specific view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function() {
        //STL.Console.log('Drawing view with name ' + this.name);
    };

   /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw =  function(){
        //STL.Console.log('Post draw view with name ' + this.name);
        $(window).bind("resize", onWindowResize);
    };

    /**
     * Shows the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function(){
        //STL.Console.log('Show view with name ' + this.name);
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
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function(){
        //STL.Console.log('Hide view with name ' + this.name);
        this.domElement.removeClass('active').css('opacity', 0);
    };

    /**
     * Adds a portfolio item to the view
     *
     * @param {Object} item The dom element that we want to append to the portfolio page
     * @author Thodoris Tsiridis
     */
    this.addPortfolioItem = function(item){
        markup.append(item);
    };


    /**
     * Renders the html markup on the page
     *
     * @author Thodoris Tsiridis
     */
    this.render = function() {
        itemsContainer.html('');
        itemsContainer.append(markup);
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
            if(!Modernizr.mq('all and (max-width: 600px)')) {

                $(this).css({
                    left: target_x + "px",
                    top: target_y + COLUMN_MARGIN + "px"
                });

            }

            itemBottom = parseInt(target_y + COLUMN_MARGIN,0) + $(this).innerHeight();

            if(maxHeight < itemBottom){
                maxHeight = itemBottom;
            }

            _8 = (_8 < _b) ? _b : _8;

        });

        if(!Modernizr.mq('all and (max-width: 600px)')) {
            if (maxHeight > 0 ){
                itemsContainer.attr('style', 'height: ' + maxHeight + 'px');
            }
        } else {
            itemsContainer.css('height', 'auto !important');
        }

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

STL.View.Tags.prototype = new STL.View.Base();
/**
 * Responsible for managing the background canvas fx
 *
 * @module 72lions
 * @class CanvasBackground
 * @author Thodoris Tsiridis
 * @version 1.0
 */
var CanvasBackground = function() {

    var canvas;
    var context;
    var stage;
    var boxes = [];

    var WINDOW_WIDTH = 0;
    var WINDOW_HEIGHT = 0;
    var COLUMNS = 10;
    var ROWS = 10;
    var MAX_BOX_SIZE = 100;
    var MAX_DISTANCE = 300;

    var mouseX = 0;
    var mouseY = 0;

    var self = this;

    /**
     * Draws the boxes
     * @author Thodoris Tsiridis
     */
    var boxDraw = function () {

        var xs = 0;
        var ys = 0;

        xs = mouseX - (this.x + this.extra.width * 0.5);
        xs = xs * xs;
        ys = mouseY - (this.y + this.extra.height * 0.5);
        ys = ys * ys;

        this.extra.distance =Math.sqrt(xs + ys);
        this.extra.alpha = 1 - (1 / (MAX_DISTANCE / this.extra.distance)) ;
        //this.rotation = Math.sin(this.extra.alpha) + 180;
        context.fillStyle = 'rgba(0, 0, 0, '+this.extra.alpha * 0.03+')';
        context.fillRect(0, 0, this.extra.width - 1, this.extra.height - 1);
        context.fill();

    };

    /**
     * Initializes the plugin
     * @author Thodoris Tsiridis
     */
    this.init = function() {

        //Create the canvas & the context
        canvas = document.getElementById('background');
        context = canvas.getContext('2d');

        stage = new CanvasDisplayObject();
        stage.name = 'Stage';
        stage.x = 0;
        stage.y = 0;

        //Add event listeners
        this.addEventListeners();

        // Run the resize function the first time
        this.resize();

        // Create the boxes
        this.createBoxes();

        //Start drawing
        window.requestAnimationFrame(this.draw);

    };

    /**
     * Registers all the event listeners
     * @author Thodoris Tsiridis
     */
    this.addEventListeners = function() {
        $(window).bind("resize", this.resize);
        $(window).bind("mousemove", this.onMouseMove);
    };

    /**
     * Creates all the boxes
     * @author Thodoris Tsiridis
     */
    this.createBoxes = function() {

        boxes = [];

        // Calculate how many boxes per row
        var boxWidth = Math.ceil(WINDOW_WIDTH / COLUMNS);
        var boxHeight = Math.ceil(WINDOW_HEIGHT / ROWS);

        if (boxWidth > boxHeight) {
            boxHeight = boxWidth;
        } else if (boxHeight > boxWidth) {
            boxWidth = boxHeight;
        }

        for (var z = 0; z < ROWS; z++) {

            for (var i = 0; i < COLUMNS; i++) {

                var box = new CanvasDisplayObject();

                box.x = i * boxWidth;
                box.y = z * boxHeight;

                box.extra.width = boxWidth;
                box.extra.height = boxHeight;

                box.draw = boxDraw;
                stage.addChild(box);
                boxes.push(box);
            }

        }

    };

    /**
     * Triggered when the mouse is moving
     * @param  {Object} event The event
     * @author Thodoris Tsiridis
     */
    this.onMouseMove = function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    };

    /**
     * Triggered whent the window is resized
     * @author Thodoris Tsiridis
     */
    this.resize = function() {
        canvas.width = WINDOW_WIDTH = window.innerWidth;
        canvas.height = WINDOW_HEIGHT = window.innerHeight;

        this.createBoxes();
    };

    /**
     * Responsible for drawing on the canvas
     * @author Thodoris Tsiridis
     */
    this.draw = function() {

        //Clear the canvas
        context.clearRect(0,0,window.innerWidth, window.innerHeight);

        // Update the stage
        stage.update(context);
        //Loop
        window.requestAnimationFrame(self.draw);

    };


};
STL.ControllerManager.initializeController({
    type:'Main',
    id:'main',
    model: STL.Lookup.getModel({})
});
