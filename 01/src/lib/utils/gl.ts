export function create_shader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    // Check for compilation errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader), source);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export function create_buffer(gl: WebGL2RenderingContext) {
    const glbuffer = gl.createBuffer();
    if (!glbuffer) {
        console.error("Failed to create the buffer object");
        throw Error("Failed to create the buffer object");
    }
    return glbuffer;
}

export function set_vertices_data(gl: WebGL2RenderingContext, buffer: WebGLBuffer, data: Float32Array) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}

export function set_face_data(gl: WebGL2RenderingContext, buffer: WebGLBuffer, data: Uint16Array) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
}
