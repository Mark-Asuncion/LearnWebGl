uniform mat4 u_transform;
uniform vec3 u_position;
uniform vec3 u_rotation;

attribute vec3 a_vertex;
attribute vec4 a_color;

varying vec4 v_color;

void main() {
    mat4 translation = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        u_position.x,
        u_position.y,
        u_position.z,
        1.0
    );

    vec4 rotation_radians = vec4(radians(u_rotation), 1);
    mat4 x_rotation = mat4(
        1, 0, 0, 0,
        0, cos(rotation_radians.x), sin(rotation_radians.x), 0,
        0, -sin(rotation_radians.x), cos(rotation_radians.x), 0,
        0, 0, 0, 1
    );

    mat4 y_rotation = mat4(
        cos(rotation_radians.y), 0, -sin(rotation_radians.y), 0,
        0, 1, 0, 0,
        -sin(rotation_radians.y), 0, cos(rotation_radians.y), 0,
        0, 0, 0, 1
    );

    mat4 z_rotation = mat4(
        cos(rotation_radians.z), sin(rotation_radians.z), 0, 0,
        -sin(rotation_radians.z), cos(rotation_radians.z), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    translation = translation * x_rotation * y_rotation * z_rotation;
    gl_Position = u_transform * translation * vec4(a_vertex, 1.0);
    v_color = a_color;
}
