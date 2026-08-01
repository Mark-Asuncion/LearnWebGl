#version 300 es
uniform mat4 u_transform;
uniform vec3 u_position;
uniform vec3 u_rotation;
uniform vec3 u_scale;

in vec3 a_vertex;
in vec4 a_color;

out vec4 v_color;

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
        cos(rotation_radians.y), 0, sin(rotation_radians.y), 0,
        0, 1, 0, 0,
        -sin(rotation_radians.y), 0, cos(rotation_radians.y), 0,
        0, 0, 0, 1
    );

    mat4 z_rotation = mat4(
        cos(rotation_radians.z), -sin(rotation_radians.z), 0, 0,
        sin(rotation_radians.z), cos(rotation_radians.z), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    translation = translation * x_rotation * y_rotation * z_rotation;
    mat4 scale = mat4(
        u_scale.x, 0, 0, 0,
        0, u_scale.y, 0, 0,
        0, 0, u_scale.z, 0,
        0, 0, 0, 1
    );
    gl_Position = u_transform * translation * scale * vec4(a_vertex, 1);
    v_color = a_color;
}
