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