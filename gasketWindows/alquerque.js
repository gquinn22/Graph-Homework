/* Author: Griffin Quinn
 * Date: 9/15/21
 * Assignment: Assignment 1
 * Title: spiral.js
 * */
var gl;
var points = [];
var positions = [];
var squares = [];
var squareColor = [];
var numSquares = 25;
var clickToggle = false;
var playerToggle = 1;
var curPlayer = 0;
var colors = [
    vec4(0.0, 1.0, 0.0, 1.0), //green
    vec4(0.0, 0.0, 1.0, 1.0),  //blue
    vec4(1.0, 0.0, 0.0, 1.0)
];
var vColorLoc;

var canvas;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Calling Gameboard to initialize gameboard
    //
    gameboard();


    //Call functions to set up pieces
    posInit(); //initializes the center positions of each location
    showSquares(); //shows squares and initializes them to have correct values
    
   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
   
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    /*var posBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, posBuff );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW );
*/
    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    vColorLoc = gl.getUniformLocation( program, "vColor")

    canvas.addEventListener("click", mouseResponse);
    //showSquares();
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
    //vColorLoc = gl.getUniformLocation( program, "vColor");
    gl.uniform4fv(vColorLoc, colors[2]);
    gl.drawArrays( gl.LINES, 0, 32 );

    var tableSquare;
    var tablePos;

    for(var i = 0; i < 25; i++){
        tableSquare = squares[i];
        tablePos = tableSquare.position;
        if(tableSquare.isShown == 1){
            gl.uniform4fv(vColorLoc, colors[tableSquare.color]);
            gl.drawArrays(gl.TRIANGLES, (32) + i*6, 6);
        }
    }
    window.requestAnimFrame(render);
}

function square(position, isShown, color) {
    this.position = position;
    this.isShown = isShown;
    this.color = color; //0 for green 1 for blue
}

function modSquare(pnum, position, isShown, color) {
    var p = new square(position, isShown, color);
    squares[pnum] = p;
}

function posInit(){
    var curPos = 0;
    for(y = -.8; y < 1; y += .4){
        for(x = -.8; x < 1; x += .4){
            var p = new square(vec2(x, y), 1, 0);
            if(x == 0 && y == 0){
                p.isShown = 0;
            }
            if(x <= -.2){
                p.color = 0;
            } else if( x >= .2){
                p.color = 1;
            } else{
                if(y > 0){
                    p.color = 0;
                } else{
                    p.color = 1;
                }
            }
            //console.log(p.position);
            squares.push(p);
        }
    }
}

function showSquares(){
    var topLeft = vec2(-.02, .02);
    //console.log(topLeft);
    var botLeft = vec2(-.02, -.02);
    var botRight = vec2(.02, -.02);
    var topRight = vec2(.02, .02);
    var tableSquare = new square(vec2(1,1), 1, 'green');
    var tablePos = vec2(1,1);
    var xCenter;
    var yCenter;
    for(i = 0; i < 25; i++){
        tableSquare = squares[i];
        tablePos = tableSquare.position;
        xCenter = tablePos[0];
        yCenter = tablePos[1];
        points.push(vec2(xCenter - .02, yCenter - .02));
        points.push(vec2(xCenter - .02, yCenter + .02));
        points.push(vec2(xCenter + .02, yCenter - .02));
        points.push(vec2(xCenter + .02, yCenter - .02));
        points.push(vec2(xCenter + .02, yCenter + .02));
        points.push(vec2(xCenter - .02, yCenter + .02));
        squareColor.push(colors[tableSquare.color]);
    }
}

function mouseResponse(event){

    var t = vec2(2*event.clientX/canvas.width-1, 2*(canvas.height - event.clientY)/canvas.height-1);
    //console.log(t);

    t[0] = t[0] - .03125;
    t[1] = t[1] + .03125;

    console.log(t);

    var xMax;
    var yMax;
    var xMin;
    var yMin;
    var tablePos;
    var tableSquare;
    var destSquare;
    var destPos;

    for(var i = 0; i < 25; i++){
        tableSquare = squares[i];
        tablePos = tableSquare.position;
        xMax = tablePos[0] + .02;
        yMax = tablePos[1] + .02;
        xMin = tablePos[0] - .02;
        yMin = tablePos[1] - .02;

        if(t[0] <= xMax && t[0] >= xMin && t[1] <= yMax && t[1] >= yMin){
            console.log("Location " + (i+1) + " selected.");
            /*if(curPlayer == 0){
            tableSquare.isShown = (tableSquare.isShown == 0) ? 1 : 0;
            curPlayer = tableSquare.color;
            squares[i] = tableSquare;
            } else {
                if(tableSquare.isShown == 1){
                    curPlayer = tableSquare.color;
                }else {
                    tableSquare.isShown = 1;
                    tableSquare.color = curPlayer;
                }
                squares[i] = tableSquare;
            }*/
            if(curPlayer == 0){
                if(!clickToggle){
                    tableSquare.isShown = (tableSquare.isShown == 0) ? 1 : 0;
                    //curPlayer = tableSquare.color;
                    squares[i] = tableSquare;
                    clickToggle = !clickToggle;
                } else {
                    if(tableSquare.isShown == 0){
                        tableSquare.isShown = 1;
                        tableSquare.color = curPlayer;
                        curPlayer = (curPlayer == 0) ? 1 : 0;
                    }
                    squares[i] = tableSquare;
                    clickToggle = !clickToggle;
                }
            } else{
                if(!clickToggle){
                    tableSquare.isShown = (tableSquare.isShown == 0) ? 1 : 0;
                    //curPlayer = tableSquare.color;
                    squares[i] = tableSquare;
                    clickToggle = !clickToggle;
                } else {
                    if(tableSquare.isShown == 0){
                        tableSquare.isShown = 1;
                        tableSquare.color = curPlayer;
                        curPlayer = (curPlayer == 1) ? 0 : 1;
                    }
                    squares[i] = tableSquare;
                    clickToggle = !clickToggle;
                }
            }
        }
    }
    curPlayer = (curPlayer == 0) ? 1 : 0;
}


