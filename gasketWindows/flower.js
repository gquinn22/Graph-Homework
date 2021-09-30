/* Author: Griffin Quinn
 * Date: 9/15/21
 * Assignment: Assignment 1
 * Title: spiral.js
 * */
var canvas;
var gl;
var vBuffer;
var triColor;
var vColorLoc;
var vertices = [];
//var modelView; // variable modelView inherited from HTML

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    triColor = vec4(1.0, 0.0, 0.0, 1.0);
    square();
    
    // Load the data into the GPU

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    vColorLoc = gl.getUniformLocation(program, "vColor");
    modelView = gl.getUniformLocation(program, "modelView");
    console.log("We made it");

    render();
};

function square() {
    var x = -.1;
    var y = -.1;
    var side = .2;

    vertices.push(vec2(x, y));
	vertices.push(vec2(x+side, y));
	vertices.push(vec2(x+side, y+side));
	vertices.push(vec2(x, y+side));
} //end spiral



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform4fv(vColorLoc, triColor);
    var mvMatrix = [];

    mvMatrix = translate(0.0, 0.5, 0.0);
    mvMatrix = mult(mvMatrix, scalem(0.5, 2.0, 1.0));
    mvMatrix = mult(mvMatrix, rotate(-45.0, 0.0, 0.0, 1.0));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.drawArrays( gl.LINE_LOOP, 0, 4);
    mvMatrix = mult(mvMatrix, translate(0.0, 0.1, 0.0));

    for(var i = 1; i < 12; i++) {
        //mvMatrix = rotate(-90.0, 0.0, 0.0, 1.0);
        mvMatrix = mult(mvMatrix, translate(0.0, -0.5, 0.0));
        //mvMatrix = mult(mvMatrix, rotate(-90.0, 0.0, 0.0, 1.0));
        //mvMatrix = mult(mvMatrix, scalem(.5, 2.0, 1.0));
        mvMatrix = mult(mvMatrix, rotate(-30*i, 0.0, 0.0, 1.0));
        gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
        gl.drawArrays( gl.LINE_LOOP, 0, 4);
    }
    window.requestAnimFrame(render);
}
