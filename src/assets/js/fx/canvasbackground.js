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
