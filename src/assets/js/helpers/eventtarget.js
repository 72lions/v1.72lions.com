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
