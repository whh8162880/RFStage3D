interface GL_Interface{
    // 测试一下
    /**
     * 激活指定的纹理单元
     * @param texture 需要激活的纹理单元。其值是 gl.TEXTUREI ，其中的 I 在 0 到 gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1 范围内
     */
    activeTexture(texture: number): void;
    
    /**
     *  负责往 WebGLProgram 添加一个GLSL着色器。
     * @param program 一个 WebGLProgram 对象
     * @param shader 一个类型为片段或者顶点的 WebGLShader
     */
    attachShader(program: WebGLProgram | null, shader: WebGLShader | null): void;
    
    /**
     * 通用顶点索引绑定到属性变量
     * @param program 要绑定的WebGLProgram 对象
     * @param index 指定要绑定的通用顶点的索引
     * @param name 指定要绑定到通用顶点索引的变量的名称。 该名称不能以“webgl_”或“_webgl_”开头，因为这些名称将保留供WebGL使用
     */
    bindAttribLocation(program: WebGLProgram | null, index: number, name: string): void;

    /**
     * 将给定的WebGLBuffer绑定到目标  
     * @param target 指定数据类型。可能的值有：gl.ARRAY_BUFFER、gl.ELEMENT_ARRAY_BUFFER
     *  gl.ARRAY_BUFFER: 包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据。
     *  gl.ELEMENT_ARRAY_BUFFER: 用于元素索引的Buffer。
     * @param buffer 要绑定的 WebGLBuffer
     */
    bindBuffer(target: number, buffer: WebGLBuffer | null): void;
    bindFramebuffer(target: number, framebuffer: WebGLFramebuffer | null): void;
    bindRenderbuffer(target: number, renderbuffer: WebGLRenderbuffer | null): void;
    bindTexture(target: number, texture: WebGLTexture | null): void;
    blendColor(red: number, green: number, blue: number, alpha: number): void;
    blendEquation(mode: number): void;
    blendEquationSeparate(modeRGB: number, modeAlpha: number): void;
    blendFunc(sfactor: number, dfactor: number): void;
    blendFuncSeparate(srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number): void;

    /**
     * 将定点数据传入到WebGLBuffer对象中
     * @param target 指定数据类型。 可能的值有：gl.ARRAY_BUFFER、gl.ELEMENT_ARRAY_BUFFER
     *  gl.ARRAY_BUFFER: 包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据。
     *  gl.ELEMENT_ARRAY_BUFFER: 用于元素索引的Buffer。
     * @param size 缓冲区大小
     * @param usage 缓冲类型。有这么几种可以供我们选择 GL_STREAM_DRAW , GL_STATIC_DRAW ,GL_DYNAMIC_DRAW
     *  gl.GL_STREAM_DRAW:缓冲区的数据偶尔变动
     *  gl.GL_STATIC_DRAW:缓冲区的数据不变
     *  gl.GL_DYNAMIC_DRAW:缓冲区数据经常变动
     */
    bufferData(target: number, size: number | ArrayBufferView | ArrayBuffer, usage: number): void;
    bufferSubData(target: number, offset: number, data: ArrayBufferView | ArrayBuffer): void;
    checkFramebufferStatus(target: number): number;

    /**
     * 使用预设值来清空缓冲，预设值可以使用 clearColor() 、 clearDepth() 或 clearStencil() 设置。裁剪、抖动处理和缓冲写入遮罩会影响 clear() 方法
     * @param mask 一个用于指定需要清除的缓冲区的 GLbitfield 。可能的值有：gl.COLOR_BUFFER_BIT、 gl.DEPTH_BUFFER_BIT、 gl.STENCIL_BUFFER_BIT
     */
    clear(mask: number): void;
    
    /**
     * 设置清空颜色缓冲时的颜色值
     * @param red 指定清除缓冲时的红色值。默认值：0。
     * @param green 指定清除缓冲时的绿色值。默认值：0。
     * @param blue 指定清除缓冲时的蓝色值。默认值：0。
     * @param alpha 指定清除缓冲时的不透明度。默认值：0。 
     */
    clearColor(red: number, green: number, blue: number, alpha: number): void;

    /**
     * 用于设置深度缓冲区的深度清除值
     * @param depth 
     * 深度值的设定，是当清除深度缓冲区的时候使用。默认值为1
     */
    clearDepth(depth: number): void;
    clearStencil(s: number): void;
    colorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;

    /**
     * 编译一个GLSL着色器，使其成为为二进制数据，然后就可以被WebGLProgram对象所使用
     *  @param shader 一个片元或顶点着色器 （WebGLShader）
     */
    compileShader(shader: WebGLShader | null): void;
    compressedTexImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, data: ArrayBufferView): void;
    compressedTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, data: ArrayBufferView): void;
    copyTexImage2D(target: number, level: number, internalformat: number, x: number, y: number, width: number, height: number, border: number): void;
    copyTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, x: number, y: number, width: number, height: number): void;
    
    /**
     * 创建并初始化一个用于储存顶点数据或着色数据的WebGLBuffer对象
     */
    createBuffer(): WebGLBuffer | null;
    createFramebuffer(): WebGLFramebuffer | null;

    /**
     * 创建和初始化一个 WebGLProgram 对象 
     */
    createProgram(): WebGLProgram | null;
    createRenderbuffer(): WebGLRenderbuffer | null;
    

    /**
     * 创建一个 WebGLShader 着色器对象,可以使用shaderSource()和compileShader()方法配置着色器代码.
     * @param type 
     *  gl.VERTEX_SHADER - 顶点着色器
     *  gl.FRAGMENT_SHADER -片元着色器
     */
    createShader(type: number): WebGLShader | null;

    createTexture(): WebGLTexture | null;
    cullFace(mode: number): void;
    deleteBuffer(buffer: WebGLBuffer | null): void;
    deleteFramebuffer(framebuffer: WebGLFramebuffer | null): void;
    deleteProgram(program: WebGLProgram | null): void;
    deleteRenderbuffer(renderbuffer: WebGLRenderbuffer | null): void;
    deleteShader(shader: WebGLShader | null): void;
    deleteTexture(texture: WebGLTexture | null): void;
    depthFunc(func: number): void;
    depthMask(flag: boolean): void;
    depthRange(zNear: number, zFar: number): void;
    detachShader(program: WebGLProgram | null, shader: WebGLShader | null): void;
    disable(cap: number): void;
    disableVertexAttribArray(index: number): void;

    /**
     * 从数组中绘制图元
     * @param mode 绘制图元的方式。可能的值：gl.POINTS、gl.LINE_STRIP、gl.LINE_LOOP、gl.LINES、gl.TRIANGLE_STRIP、gl.TRIANGLE_FAN、gl.TRIANGLES
     *  gl.POINTS： 绘制一系列点
     *  gl.LINE_STRIP：绘制一个线条。即，绘制一系列线段，上一点连接下一点。
     *  gl.LINE_LOOP：绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
     *  gl.LINES：绘制一系列单独线段。每两个点作为端点，线段之间不连接。
     *  gl.TRIANGLE_STRIP：绘制一个三角带。
     *  gl.TRIANGLE_FAN：绘制一个三角扇。
     *  gl.TRIANGLES：绘制一系列三角形。每三个点作为顶点。
     * @param first 指定从哪个点开始绘制
     * @param count 指定绘制需要使用到多少个点
     */
    drawArrays(mode: number, first: number, count: number): void;
    drawElements(mode: number, count: number, type: number, offset: number): void;
    enable(cap: number): void;
    enableVertexAttribArray(index: number): void;
    finish(): void;
    flush(): void;
    framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number, renderbuffer: WebGLRenderbuffer | null): void;
    framebufferTexture2D(target: number, attachment: number, textarget: number, texture: WebGLTexture | null, level: number): void;
    frontFace(mode: number): void;
    generateMipmap(target: number): void;
    getActiveAttrib(program: WebGLProgram | null, index: number): WebGLActiveInfo | null;
    getActiveUniform(program: WebGLProgram | null, index: number): WebGLActiveInfo | null;
    getAttachedShaders(program: WebGLProgram | null): WebGLShader[] | null;

    /**
     * 返回了给定WebGLProgram对象中某属性的下标指向位置
     * @param program 一个包含了属性参数的WebGLProgram 对象
     * @param name 需要获取下标指向位置的 参数名
     */
    getAttribLocation(program: WebGLProgram | null, name: string): number;
    getBufferParameter(target: number, pname: number): any;
    getContextAttributes(): WebGLContextAttributes;
    getError(): number;
    getExtension(extensionName: "EXT_blend_minmax"): EXT_blend_minmax | null;
    getExtension(extensionName: "EXT_texture_filter_anisotropic"): EXT_texture_filter_anisotropic | null;
    getExtension(extensionName: "EXT_frag_depth"): EXT_frag_depth | null;
    getExtension(extensionName: "EXT_shader_texture_lod"): EXT_shader_texture_lod | null;
    getExtension(extensionName: "EXT_sRGB"): EXT_sRGB | null;
    getExtension(extensionName: "OES_vertex_array_object"): OES_vertex_array_object | null;
    getExtension(extensionName: "WEBGL_color_buffer_float"): WEBGL_color_buffer_float | null;
    getExtension(extensionName: "WEBGL_compressed_texture_astc"): WEBGL_compressed_texture_astc | null;
    getExtension(extensionName: "WEBGL_compressed_texture_s3tc_srgb"): WEBGL_compressed_texture_s3tc_srgb | null;
    getExtension(extensionName: "WEBGL_debug_shaders"): WEBGL_debug_shaders | null;
    getExtension(extensionName: "WEBGL_draw_buffers"): WEBGL_draw_buffers | null;
    getExtension(extensionName: "WEBGL_lose_context"): WEBGL_lose_context | null;
    getExtension(extensionName: "WEBGL_depth_texture"): WEBGL_depth_texture | null;
    getExtension(extensionName: "WEBGL_debug_renderer_info"): WEBGL_debug_renderer_info | null;
    getExtension(extensionName: "WEBGL_compressed_texture_s3tc"): WEBGL_compressed_texture_s3tc | null;
    getExtension(extensionName: "OES_texture_half_float_linear"): OES_texture_half_float_linear | null;
    getExtension(extensionName: "OES_texture_half_float"): OES_texture_half_float | null;
    getExtension(extensionName: "OES_texture_float_linear"): OES_texture_float_linear | null;
    getExtension(extensionName: "OES_texture_float"): OES_texture_float | null;
    getExtension(extensionName: "OES_standard_derivatives"): OES_standard_derivatives | null;
    getExtension(extensionName: "OES_element_index_uint"): OES_element_index_uint | null;
    getExtension(extensionName: "ANGLE_instanced_arrays"): ANGLE_instanced_arrays | null;
    getExtension(extensionName: string): any;
    getFramebufferAttachmentParameter(target: number, attachment: number, pname: number): any;
    getParameter(pname: number): any;
    getProgramInfoLog(program: WebGLProgram | null): string | null;
    getProgramParameter(program: WebGLProgram | null, pname: number): any;
    getRenderbufferParameter(target: number, pname: number): any;
    getShaderInfoLog(shader: WebGLShader | null): string | null;
    getShaderParameter(shader: WebGLShader | null, pname: number): any;
    getShaderPrecisionFormat(shadertype: number, precisiontype: number): WebGLShaderPrecisionFormat | null;
    getShaderSource(shader: WebGLShader | null): string | null;
    getSupportedExtensions(): string[] | null;
    getTexParameter(target: number, pname: number): any;
    getUniform(program: WebGLProgram | null, location: WebGLUniformLocation | null): any;
    getUniformLocation(program: WebGLProgram | null, name: string): WebGLUniformLocation | null;
    getVertexAttrib(index: number, pname: number): any;
    getVertexAttribOffset(index: number, pname: number): number;
    hint(target: number, mode: number): void;
    isBuffer(buffer: WebGLBuffer | null): boolean;
    isContextLost(): boolean;
    isEnabled(cap: number): boolean;
    isFramebuffer(framebuffer: WebGLFramebuffer | null): boolean;
    isProgram(program: WebGLProgram | null): boolean;
    isRenderbuffer(renderbuffer: WebGLRenderbuffer | null): boolean;
    isShader(shader: WebGLShader | null): boolean;
    isTexture(texture: WebGLTexture | null): boolean;
    lineWidth(width: number): void;

    /**
     *  关联一个给定的WebGLProgram 到已附着的顶点着色器和片段着色器
     * @param program 一个用于链接的 WebGLProgram
     */
    linkProgram(program: WebGLProgram | null): void;
    pixelStorei(pname: number, param: number | boolean): void;
    polygonOffset(factor: number, units: number): void;
    readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView | null): void;
    renderbufferStorage(target: number, internalformat: number, width: number, height: number): void;
    sampleCoverage(value: number, invert: boolean): void;
    scissor(x: number, y: number, width: number, height: number): void;
    
    /**
     * 设置 WebGLShader 着色器（顶点着色器及片元着色器）的GLSL程序代码    
     * @param shader 用于设置程序代码的 WebGLShader （着色器对象）。
     * @param source 包含GLSL程序代码的字符串。
     */
    shaderSource(shader: WebGLShader | null, source: string): void;
    stencilFunc(func: number, ref: number, mask: number): void;
    stencilFuncSeparate(face: number, func: number, ref: number, mask: number): void;
    stencilMask(mask: number): void;
    stencilMaskSeparate(face: number, mask: number): void;
    stencilOp(fail: number, zfail: number, zpass: number): void;
    stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): void;
    texImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, format: number, type: number, pixels: ArrayBufferView | null): void;
    texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): void;
    texParameterf(target: number, pname: number, param: number): void;
    texParameteri(target: number, pname: number, param: number): void;
    texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView | null): void;
    texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): void;
    uniform1f(location: WebGLUniformLocation | null, x: number): void;
    uniform1fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
    uniform1i(location: WebGLUniformLocation | null, x: number): void;
    uniform1iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
    uniform2f(location: WebGLUniformLocation | null, x: number, y: number): void;
    uniform2fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
    uniform2i(location: WebGLUniformLocation | null, x: number, y: number): void;
    uniform2iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
    uniform3f(location: WebGLUniformLocation | null, x: number, y: number, z: number): void;
    uniform3fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
    uniform3i(location: WebGLUniformLocation | null, x: number, y: number, z: number): void;
    uniform3iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
    uniform4f(location: WebGLUniformLocation | null, x: number, y: number, z: number, w: number): void;
    uniform4fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
    uniform4i(location: WebGLUniformLocation | null, x: number, y: number, z: number, w: number): void;
    uniform4iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
    uniformMatrix2fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array | number[]): void;
    uniformMatrix3fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array | number[]): void;
    uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array | number[]): void;

    /**
     * 将定义好的WebGLProgram 对象添加到当前的渲染状态中（告诉CPU要用这个WebGLProgram）
     * @param program 需要添加的WebGLProgram对象
     */
    useProgram(program: WebGLProgram | null): void;
    validateProgram(program: WebGLProgram | null): void;
    vertexAttrib1f(indx: number, x: number): void;
    vertexAttrib1fv(indx: number, values: Float32Array | number[]): void;
    vertexAttrib2f(indx: number, x: number, y: number): void;
    vertexAttrib2fv(indx: number, values: Float32Array | number[]): void;
    vertexAttrib3f(indx: number, x: number, y: number, z: number): void;
    vertexAttrib3fv(indx: number, values: Float32Array | number[]): void;
    vertexAttrib4f(indx: number, x: number, y: number, z: number, w: number): void;
    vertexAttrib4fv(indx: number, values: Float32Array | number[]): void;
    
    /**
     * 告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据
     * @param index 指定要修改的顶点属性的索引 
     * @param size 修改的顶点属性的纬度，必须是1，2，3或4
     * @param type 参数类型，指定一个数据占多少个字节，可能的值：gl.BYTE、gl.SHORT、gl.UNSIGNED_BYTE、gl.UNSIGNED_SHORT、gl.FLOAT
     * @param normalized 是否标准化（化为0-1范围）
     * @param stride 步长，每个顶点数据所占的字节数，
     *                例：如[1,1,1,1,1,1]定点，这里步长 stride=6*4，stride=6*4的意思是每个步长24个字节读取一个v3Position数据（前三个数据传给v3Position）
     * @param offset 绑定的缓冲区偏移offset个字节
     */
    vertexAttribPointer(index: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
    viewport(x: number, y: number, width: number, height: number): void;
}