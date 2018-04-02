#WEBGL_debug_shaders 可以把编译完成的shader转换成glsl
```ts
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, 'void main() { gl_FragColor = vec4(gl_FragCoord.x, 0.0, 0.0, 1.0); }');
    gl.compileShader(shader);
    var src = gl.getExtension('WEBGL_debug_shaders').getTranslatedShaderSource(shader);
    console.log(src);
    // "void main(){
    // (gl_FragColor = vec4(gl_FragCoord.x, 0.0, 0.0, 1.0));
    // }"
```

#WEBGL_lose_context 