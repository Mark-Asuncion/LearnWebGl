"use strict";

async function getShaderSource(path) {
    const res =  await fetch(path);
    const t = await res.text();
    return t;
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    // Check for compilation errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

var rotation = new Float32Array([0, 0, 0]);
var obj_pos = new Float32Array([0, 0, -5]);

document.addEventListener("DOMContentLoaded", async function () {
    /** @type {WebGLRenderingContext} */
    const gl = document.querySelector("#gl").getContext("webgl");
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const program = gl.createProgram();

    const vertex_shader_source = await getShaderSource("/lib/shaders/vertex01.vert");
    const frag_shader_source = await getShaderSource("/lib/shaders/fragment01.frag");
    const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_source);
    const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, frag_shader_source);
    const projection = new Perspective(gl.canvas.width, gl.canvas.height, 90, 0.1, 100);

    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);

    // Check for linking errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertex_data = new Float32Array([
         0,  1, 0,  1, 0, 0, 1,
         1, -1, 0,  0, 1, 0, 1,
        -1, -1, 0,  0, 0, 1, 1
    ]);

    const triangle_buffer = createBuffer(gl, vertex_data);
    const objctx = {};
    /** 
     * @param {WebGLRenderingContext} gl
     * @param {Float32Array} transform
     * */
    objctx.delete = function (gl, buffer) {
        gl.deleteBuffer(buffer);
    }

    /** 
     * @param {WebGLRenderingContext} gl
     * @param {Float32Array} transform
     * */
    objctx.render = function (gl, delta) {
        // rotation = new Float32Array(rotation.map((i) => i*delta));

        let u_transform = gl.getUniformLocation(program, 'u_transform');
        let u_rotation = gl.getUniformLocation(program, 'u_rotation');
        let u_position = gl.getUniformLocation(program, 'u_position');
        let a_vertex = gl.getAttribLocation(program, 'a_vertex');
        let a_color = gl.getAttribLocation(program, 'a_color');

        // Set the transform for all the triangle vertices
        gl.uniformMatrix4fv(u_transform, false, projection.matrix);

        gl.uniform3f(u_rotation, rotation[0], rotation[1], rotation[2]);

        gl.uniform3f(u_position, obj_pos[0], obj_pos[1], obj_pos[2]);

        // Activate the model's vertex Buffer Object
        gl.bindBuffer(gl.ARRAY_BUFFER, triangle_buffer);

        // Bind the vertices Buffer Object to the 'a_Vertex' shader variable
        // dynamic hence attrib
        const el_size = Float32Array.BYTES_PER_ELEMENT;
        const stride = 7*el_size;
        gl.vertexAttribPointer(a_vertex, 3, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, stride, 3*el_size);
        gl.enableVertexAttribArray(a_vertex);
        gl.enableVertexAttribArray(a_color);

        // Draw all of the triangles
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Draw a line_loop around each of the triangles
        gl.drawArrays(gl.LINE_LOOP, 0, 3);
    };

    let now = Date.now();
    function loop() {
        let delta = 1/(Date.now()-now);
        now = Date.now();
        gl.clearColor(0.3, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        objctx.render(gl, delta);
        requestAnimationFrame(loop);
    }
    setTimeout(() => requestAnimationFrame(loop), 10);
});



/**
 * @param {WebGLRenderingContext} gl
 * @param {Float32Array} data
 * */
function createBuffer(gl, data) {
    let buffer_id = gl.createBuffer();
    if (!buffer_id) {
        out.displayError('Failed to create the buffer object for ' + model_name);
        return null;
    }

    // Make the buffer object the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);

    // Upload the data for the current active buffer set by bindBuffer
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer_id;
}
