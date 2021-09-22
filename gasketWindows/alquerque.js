/* Author: Griffin Quinn
 * Date: 9/15/21
 * Assignment: Assignment 1
 * Title: spiral.js
 * */
var gl;
var points = [];
var squares = [];
var numSquares = 24;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Calling Gameboard to initialize gameboard
    //
    gameboard();

    /*for (i = 0; i < numSquares; i++) {
        squares[i] = new square(vec2(, 1, green);
    }*/

    //TODO: FIGURE THIS OUT, IT'S NOT HARD
    
   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function gameboard() {
    var x = -.8;
    var y = -.8;
    var xdist = .4;
    var boardheight = 1.6;
    for (i = 0; i < 5; i++) {
        points.push(vec2(i * xdist + x, y));
        points.push(vec2(i * xdist + x, y + boardheight));
    }
    for(i = 0; i < 5; i++) {
        points.push(vec2(x, i*xdist + y));
        points.push(vec2(x+boardheight, i*xdist + y));
    }
    /*
     * Now push points to draw diagonals
    */ 
    points.push(vec2(-.8, 0));
    points.push(vec2(0, -.8));

    points.push(vec2(-.8, .8));
    points.push(vec2(.8, -.8));

    points.push(vec2(0, .8));
    points.push(vec2(.8, -0));

    points.push(vec2(0, .8));
    points.push(vec2(-.8, 0));

    points.push(vec2(.8, .8));
    points.push(vec2(-.8, -.8));

    points.push(vec2(.8, 0));
    points.push(vec2(0, -.8));

} 



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
}

function square(position, isShown, color) {
    this.position = position;
    this.isShown = isShown;
    this.color = color;
}

function modSquare(pnum,position, isShown, color) {
    var p = new square(position, isShown, color);
    squares[pnum] = p;
}