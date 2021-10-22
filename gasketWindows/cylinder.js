"use strict";
var canvas;
var gl;

var NumVertices  = 0;
var count = 2;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

//globalizing vertices and colors for use within functions
var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ), //0
    vec4( -0.5,  0.5,  0.5, 1.0 ), //1
    vec4(  0.5,  0.5,  0.5, 1.0 ), //2
    vec4(  0.5, -0.5,  0.5, 1.0 ), //3
    vec4( -0.5, -0.5, -0.5, 1.0 ), //4
    vec4( -0.5,  0.5, -0.5, 1.0 ), //5
    vec4(  0.5,  0.5, -0.5, 1.0 ), //6
    vec4(  0.5, -0.5, -0.5, 1.0 )  //7
];

var vertexColors = [
    [ 1.0, 0.0, 0.0, 1.0 ],  // black 0
    [ 0.0, 0.0, 1.0, 1.0 ],  // red 1 [ 1.0, 0.0, 0.0, 1.0 ] back
    [ 1.0, 0.0, 0.0, 1.0 ],  // yellow 2 right
    [ 0.0, 1.0, 0.0, 1.0 ],  // green bottom 3
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue 4 [ 0.0, 0.0, 1.0, 1.0 ] front
    [ 1.0, 0.0, 0.0, 1.0 ],  // magenta 5 left 
    [ 0.0, 1.0, 1.0, 1.0 ],  // cyan top 6
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //colorCube();
    callCylinder();
    NumVertices = points.length;

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    window.onkeydown = function(event){
        var key = String.fromCharCode(event.keyCode);
        switch(key){
            case 'F':
                theta[xAxis] += 2.0;
                break;
            case 'J': 
                theta[yAxis] += 2.0;
                break;
            case 'K': 
                theta[zAxis] += 2.0;
                break;
        }
    }
    
    
        
    render();
}

/*function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}*/

function quad(a, b, c, d) 
{
    var vertexColors = [
        [ 1.0, 0.0, 0.0, 1.0 ],  // black 0
        [ 0.0, 0.0, 1.0, 1.0 ],  // red 1 [ 1.0, 0.0, 0.0, 1.0 ] back
        [ 1.0, 0.0, 0.0, 1.0 ],  // yellow 2 right
        [ 0.0, 1.0, 0.0, 1.0 ],  // green bottom 3
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue 4 [ 0.0, 0.0, 1.0, 1.0 ] front
        [ 1.0, 0.0, 0.0, 1.0 ],  // magenta 5 left 
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan top 6
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(vertexColors[a]);
        
    }
}


function callCylinder()
{
    divide_quad(vertices[1], vertices[0], vertices [3], vertices[2], count, 3);
    divide_quad(vertices[2], vertices[3], vertices [7], vertices[6], count, 1);
    divide_quad(vertices[4], vertices[5], vertices [6], vertices[7], count, 3);
    divide_quad(vertices[5], vertices[4], vertices [0], vertices[1], count, 1);
}

function normalize(vector)
{
    var x, y, z, d, xn, zn, coeff, normVec;
    d = .5 * Math.sqrt(2);
    x = vector[0];
    y = vector[1];
    z = vector[2];
    coeff = d / Math.sqrt(x*x + z*z);
    xn = x * coeff;
    zn = z * coeff;

    normVec = vec4(xn, y, zn, 1.0);
    
    return normVec;
}

function divide_quad(a, b, c, d, num, rgb)
{
    if(num > 0){
        var mid1 = vec4((c[0] + b[0]) / 2, b[1], (c[2] + b[2]) / 2, 1.0);
        var mid2 = vec4((d[0] + a[0]) / 2, a[1], (d[2] + a[2]) / 2, 1.0);

        mid1 = normalize(mid1);
        mid2 = normalize(mid2);

        vertices.push(mid1);
        vertices.push(mid2);

        divide_quad(a, b, mid1, mid2, num - 1, 1);
        divide_quad(mid2, mid1, c, d, num - 1, 1);

    } else{ 
        //this will mimic a call to quad, but to handle a different 'a', we will have to adjust
        var indices = [ a, b, c, a, c, d ];

        for ( var i = 0; i < indices.length; ++i ) {
            points.push( vertices[indices[i]] );
            //colors.push( vertexColors[indices[i]] );
    
            // for solid colored faces use 
            colors.push(vertexColors[rgb]);
        
        }
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
