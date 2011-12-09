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
