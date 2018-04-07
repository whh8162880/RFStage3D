uniform highp mat4 modelMatrix;
uniform highp mat4 mv;
uniform highp mat4 mvp;
uniform highp mat4 viewMatrix;
uniform highp mat3 normalMatrix;
uniform highp vec3 cameraPosition;
attribute highp vec3 pos;
attribute highp vec3 normal;
attribute highp vec2 uv;
attribute highp vec3 color;
varying highp vec3 vColor;
void main(){
    (gl_Position = vec4(0.0, 0.0, 0.0, 0.0));
    (vColor = vec3(0.0, 0.0, 0.0));
    (vColor.xyz = color.xyz);
    highp vec3 position = vec3(pos);
    highp vec4 webgl_2da0b224f75ae402 = (mv * vec4(position, 1.0));
    (gl_Position = (mvp * webgl_2da0b224f75ae402));
}