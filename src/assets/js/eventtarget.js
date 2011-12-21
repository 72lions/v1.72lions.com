/**
 * Event target is used as a mixin so that the classes can support dispatch events and add events commands
 *
 * @module 72lions
 * @class EventTarget
 * @author Thodoris Tsiridis
 * @version 1.0
 */
var EventTarget = function () {

    var listeners = {};

    /**
     * Registers an event
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
