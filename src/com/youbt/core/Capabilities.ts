
namespace rf {
    /**
     * 提供当前浏览器的功能描述
     */
    export namespace Capabilities {

        /** 浏览器的平台 */
        export function platform() {
            return navigator.platform;
        }

        /** 用户代理 */
        export function userAgent() {
            return navigator.userAgent;
        }

        /** 是否支持 WebGL */
        export function supportWebGL() {
            return c.supportWebGL;
        }

        /** 是否为 WebGL2 */
        export function isWebGL2() {
            return c.isWebGL2;
        }

        /** 获取 Context 时的名称 */
        export function contextName() {
            return c.contextName;
        }

        /** 获取 WEBGL 的详细描述 */
        export function glAttributeMap() {
            return c.glAttributeMap;
        }

        class C {

            // ----- WebGL -----
            supportWebGL: boolean = false;
            isWebGL2: boolean = false;
            contextName: string;
            glAttributeMap = {};

            constructor() {
                this.checkWebGL();
            }
            
            private checkWebGL() {
                let gl;
                let canvas = document.createElement("canvas");
                ['webgl2', 'experimental-webgl2', 'webgl', 'experimental-webgl'].forEach(v => {
                    if (gl) return;
                    gl = canvas.getContext(v);
                    this.contextName = v;
                });
                if (!gl) {
                    return;
                }

                this.supportWebGL = true;
                this.isWebGL2 = this.contextName.indexOf("2") != -1;

                function describeRange(value) {
                    return '[' + value[0] + ', ' + value[1] + ']';
                }
            
                function getMaxAnisotropy() {
                    var e = gl.getExtension('EXT_texture_filter_anisotropic')
                            || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                            || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
            
                    if (e) {
                        var max = gl.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                        // See Canary bug: https://code.google.com/p/chromium/issues/detail?id=117450
                        if (max === 0) {
                            max = 2;
                        }
                        return max;
                    }
                    return 'n/a';
                }
            
                function formatPower(exponent, verbose) {
                    if (verbose) {
                        return '' + Math.pow(2, exponent);
                    } else {
                        return '2<sup>' + exponent + '</sup>';
                    }
                }
            
                function getPrecisionDescription(precision, verbose) {
                    var verbosePart = verbose ? ' bit mantissa' : '';
                    return '[-' + formatPower(precision.rangeMin, verbose) + ', ' + formatPower(precision.rangeMax, verbose) + '] (' + precision.precision + verbosePart + ')'
                }
            
                function getBestFloatPrecision(shaderType) {
                    var high = gl.getShaderPrecisionFormat(shaderType, gl.HIGH_FLOAT);
                    var medium = gl.getShaderPrecisionFormat(shaderType, gl.MEDIUM_FLOAT);
                    var low = gl.getShaderPrecisionFormat(shaderType, gl.LOW_FLOAT);
            
                    var best = high;
                    if (high.precision === 0) {
                        best = medium;
                    }
            
                    return '<span title="High: ' + getPrecisionDescription(high, true) + '\n\nMedium: ' + getPrecisionDescription(medium, true) + '\n\nLow: ' + getPrecisionDescription(low, true) + '">' +
                        getPrecisionDescription(best, false) + '</span>';
                }
            
                function getFloatIntPrecision(gl) {
                    var high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
                    var s = (high.precision !== 0) ? 'highp/' : 'mediump/';
            
                    high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT);
                    s += (high.rangeMax !== 0) ? 'highp' : 'lowp';
            
                    return s;
                }
            
                function isPowerOfTwo(n) {
                    return (n !== 0) && ((n & (n - 1)) === 0);
                }
            
                function getAngle(gl) {
                    var lineWidthRange = describeRange(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE));
            
                    // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
                    var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
                        (gl.getParameter(gl.RENDERER) !== 'Internet Explorer') &&
                        (gl.getParameter(gl.RENDERER) !== 'Microsoft Edge') &&
                        (lineWidthRange === describeRange([1,1]));
            
                    if (angle) {
                        // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
                        // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
                        //
                        // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
                        // due to driver bugs, etc.
                        if (isPowerOfTwo(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)) && isPowerOfTwo(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS))) {
                            return 'Yes, D3D11';
                        } else {
                            return 'Yes, D3D9';
                        }
                    }
            
                    return 'No';
                }
            
                function getMajorPerformanceCaveat(contextName) {
                    // Does context creation fail to do a major performance caveat?
                    var canvas = document.createElement("canvas");
                    var gl = canvas.getContext(contextName, { failIfMajorPerformanceCaveat : true });
            
                    if (!gl) {
                        // Our original context creation passed.  This did not.
                        return 'Yes';
                    }
            
                    if (typeof gl["getContextAttributes"]().failIfMajorPerformanceCaveat === 'undefined') {
                        // If getContextAttributes() doesn't include the failIfMajorPerformanceCaveat
                        // property, assume the browser doesn't implement it yet.
                        return 'Not implemented';
                    }
            
                    return 'No';
                }
            
                function getDraftExtensionsInstructions() {
                    if (navigator.userAgent.indexOf('Chrome') !== -1) {
                        return 'To see draft extensions in Chrome, browse to about:flags, enable the "Enable WebGL Draft Extensions" option, and relaunch.';
                    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
                        return 'To see draft extensions in Firefox, browse to about:config and set webgl.enable-draft-extensions to true.';
                    }
            
                    return '';
                }
            
                function getMaxColorBuffers(gl) {
                    var maxColorBuffers = 1;
                    var ext = gl.getExtension("WEBGL_draw_buffers");
                    if (ext != null) 
                        maxColorBuffers = gl.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL);
                    
                    return maxColorBuffers;
                }
            
                function getUnmaskedInfo(gl) {
                    var unMaskedInfo = {
                        renderer: '',
                        vendor: ''
                    };
                    
                    var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
                    if (dbgRenderInfo != null) {
                        unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
                        unMaskedInfo.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
                    }
                    
                    return unMaskedInfo;
                }
            
                function showNull(v) {
                    return (v === null) ? 'n/a' : v;
                }
                
                var webglToEsNames = {
                    'getInternalformatParameter' : 'getInternalformativ',
                    'uniform1ui' : 'uniform',
                    'uniform2ui' : 'uniform',
                    'uniform3ui' : 'uniform',
                    'uniform4ui' : 'uniform',
                    'uniform1uiv' : 'uniform',
                    'uniform2uiv' : 'uniform',
                    'uniform3uiv' : 'uniform',
                    'uniform4uiv' : 'uniform',
                    'uniformMatrix2x3fv' : 'uniform',
                    'uniformMatrix3x2fv' : 'uniform',
                    'uniformMatrix2x4fv' : 'uniform',
                    'uniformMatrix4x2fv' : 'uniform',
                    'uniformMatrix3x4fv' : 'uniform',
                    'uniformMatrix4x3fv' : 'uniform',
                    'vertexAttribI4i' : 'vertexAttrib',
                    'vertexAttribI4iv' : 'vertexAttrib',
                    'vertexAttribI4ui' : 'vertexAttrib',
                    'vertexAttribI4uiv' : 'vertexAttrib',
                    'vertexAttribIPointer' : 'vertexAttribPointer',
                    'vertexAttribDivisor' : 'vertexAttribDivisor',
                    'createQuery' : 'genQueries',
                    'deleteQuery' : 'deleteQueries',
                    'endQuery' : 'beginQuery',
                    'getQuery' : 'getQueryiv',
                    'getQueryParameter' : 'getQueryObjectuiv',
                    'samplerParameteri' : 'samplerParameter',
                    'samplerParameterf' : 'samplerParameter',
                    'clearBufferiv' : 'clearBuffer',
                    'clearBufferuiv' : 'clearBuffer',
                    'clearBufferfv' : 'clearBuffer',
                    'clearBufferfi' : 'clearBuffer',
                    'createSampler' : 'genSamplers',
                    'deleteSampler' : 'deleteSamplers',
                    'getSyncParameter' : 'getSynciv',
                    'createTransformFeedback' : 'genTransformFeedbacks',
                    'deleteTransformFeedback' : 'deleteTransformFeedbacks',
                    'endTransformFeedback' : 'beginTransformFeedback',
                    'getIndexedParameter' : 'get',
                    'getActiveUniforms' : 'getActiveUniformsiv',
                    'getActiveUniformBlockParameter' : 'getActiveUniformBlockiv',
                    'createVertexArray' : 'genVertexArrays',
                    'deleteVertexArray' : 'deleteVertexArrays'
                };
            
                function getWebGL2ExtensionUrl(name) {
                    if (name === 'getBufferSubData') {
                        return 'http://www.opengl.org/sdk/docs/man/docbook4/xhtml/glGetBufferSubData.xml';
                    }
            
                    if (webglToEsNames[name]) {
                        name = webglToEsNames[name];
                    }
            
                    var filename = 'gl' + name[0].toUpperCase() + name.substring(1) + '.xhtml';
                    return 'http://www.khronos.org/opengles/sdk/docs/man3/html/' + filename;
                }
            
                function getWebGL2Status(gl, contextName) {
                    var webgl2Names = [
                        'copyBufferSubData',
                        'getBufferSubData',
                        'blitFramebuffer',
                        'framebufferTextureLayer',
                        'getInternalformatParameter',
                        'invalidateFramebuffer',
                        'invalidateSubFramebuffer',
                        'readBuffer',
                        'renderbufferStorageMultisample',
                        'texStorage2D',
                        'texStorage3D',
                        'texImage3D',
                        'texSubImage3D',
                        'copyTexSubImage3D',
                        'compressedTexImage3D',
                        'compressedTexSubImage3D',
                        'getFragDataLocation',
                        'uniform1ui',
                        'uniform2ui',
                        'uniform3ui',
                        'uniform4ui',
                        'uniform1uiv',
                        'uniform2uiv',
                        'uniform3uiv',
                        'uniform4uiv',
                        'uniformMatrix2x3fv',
                        'uniformMatrix3x2fv',
                        'uniformMatrix2x4fv',
                        'uniformMatrix4x2fv',
                        'uniformMatrix3x4fv',
                        'uniformMatrix4x3fv',
                        'vertexAttribI4i',
                        'vertexAttribI4iv',
                        'vertexAttribI4ui',
                        'vertexAttribI4uiv',
                        'vertexAttribIPointer',
                        'vertexAttribDivisor',
                        'drawArraysInstanced',
                        'drawElementsInstanced',
                        'drawRangeElements',
                        'drawBuffers',
                        'clearBufferiv',
                        'clearBufferuiv',
                        'clearBufferfv',
                        'clearBufferfi',
                        'createQuery',
                        'deleteQuery',
                        'isQuery',
                        'beginQuery',
                        'endQuery',
                        'getQuery',
                        'getQueryParameter',
                        'createSampler',
                        'deleteSampler',
                        'isSampler',
                        'bindSampler',
                        'samplerParameteri',
                        'samplerParameterf',
                        'getSamplerParameter',
                        'fenceSync',
                        'isSync',
                        'deleteSync',
                        'clientWaitSync',
                        'waitSync',
                        'getSyncParameter',
                        'createTransformFeedback',
                        'deleteTransformFeedback',
                        'isTransformFeedback',
                        'bindTransformFeedback',
                        'beginTransformFeedback',
                        'endTransformFeedback',
                        'transformFeedbackVaryings',
                        'getTransformFeedbackVarying',
                        'pauseTransformFeedback',
                        'resumeTransformFeedback',
                        'bindBufferBase',
                        'bindBufferRange',
                        'getIndexedParameter',
                        'getUniformIndices',
                        'getActiveUniforms',
                        'getUniformBlockIndex',
                        'getActiveUniformBlockParameter',
                        'getActiveUniformBlockName',
                        'uniformBlockBinding',
                        'createVertexArray',
                        'deleteVertexArray',
                        'isVertexArray',
                        'bindVertexArray'
                    ];
            
                    var webgl2 = this.isWebGL2;
            
                    var functions = [];
                    var totalImplemented = 0;
                    var length = webgl2Names.length;
            
                    if (webgl2) {
                        for (var i = 0; i < length; ++i) {
                            var name = webgl2Names[i];
                            var className = 'extension';
                            if (webgl2 && gl[name]) {
                                ++totalImplemented;
                            } else {
                                className += ' unsupported';
                            }
                            functions.push({ name: name, className: className });
                        }
                    }
            
                    return {
                        status : webgl2 ? (totalImplemented + ' of ' + length + ' new functions implemented.') :
                            'webgl2 and experimental-webgl2 contexts not available.',
                        functions : functions
                    };
                }

                var webgl2Status = getWebGL2Status(gl, contextName);

                let a1 = {
                    glVersion: gl.getParameter(gl.VERSION),
                    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                    vendor: gl.getParameter(gl.VENDOR),
                    renderer: gl.getParameter(gl.RENDERER),
                    unMaskedVendor: getUnmaskedInfo(gl).vendor,
                    unMaskedRenderer: getUnmaskedInfo(gl).renderer,
                    antialias:  gl.getContextAttributes().antialias ? 'Available' : 'Not available',
                    angle: getAngle(gl),
                    majorPerformanceCaveat: getMajorPerformanceCaveat(contextName),
                    maxColorBuffers: getMaxColorBuffers(gl),
                    redBits: gl.getParameter(gl.RED_BITS),
                    greenBits: gl.getParameter(gl.GREEN_BITS),
                    blueBits: gl.getParameter(gl.BLUE_BITS),
                    alphaBits: gl.getParameter(gl.ALPHA_BITS),
                    depthBits: gl.getParameter(gl.DEPTH_BITS),
                    stencilBits: gl.getParameter(gl.STENCIL_BITS),
                    maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
                    maxCombinedTextureImageUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
                    maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
                    maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
                    maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
                    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                    maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
                    maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
                    maxVertexTextureImageUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
                    maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
                    aliasedLineWidthRange: describeRange(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)),
                    aliasedPointSizeRange: describeRange(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)),
                    maxViewportDimensions: describeRange(gl.getParameter(gl.MAX_VIEWPORT_DIMS)),
                    maxAnisotropy: getMaxAnisotropy(),
                    vertexShaderBestPrecision: getBestFloatPrecision(gl.VERTEX_SHADER),
                    fragmentShaderBestPrecision: getBestFloatPrecision(gl.FRAGMENT_SHADER),
                    fragmentShaderFloatIntPrecision: getFloatIntPrecision(gl),
            
                    extensions: gl.getSupportedExtensions(),
                    draftExtensionsInstructions: getDraftExtensionsInstructions(),
            
                    webgl2Status : webgl2Status.status,
                    webgl2Functions : webgl2Status.functions
                };

                this.copy(this.glAttributeMap, a1);

                if (this.isWebGL2) {
                    let a2 = {
                        maxVertexUniformComponents: showNull(gl.getParameter(gl.MAX_VERTEX_UNIFORM_COMPONENTS)),
                        maxVertexUniformBlocks: showNull(gl.getParameter(gl.MAX_VERTEX_UNIFORM_BLOCKS)),
                        maxVertexOutputComponents: showNull(gl.getParameter(gl.MAX_VERTEX_OUTPUT_COMPONENTS)),
                        maxVaryingComponents: showNull(gl.getParameter(gl.MAX_VARYING_COMPONENTS)),
                        maxFragmentUniformComponents: showNull(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_COMPONENTS)),
                        maxFragmentUniformBlocks: showNull(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_BLOCKS)),
                        maxFragmentInputComponents: showNull(gl.getParameter(gl.MAX_FRAGMENT_INPUT_COMPONENTS)),
                        minProgramTexelOffset: showNull(gl.getParameter(gl.MIN_PROGRAM_TEXEL_OFFSET)),
                        maxProgramTexelOffset: showNull(gl.getParameter(gl.MAX_PROGRAM_TEXEL_OFFSET)),
                        maxDrawBuffers: showNull(gl.getParameter(gl.MAX_DRAW_BUFFERS)),
                        maxColorAttachments: showNull(gl.getParameter(gl.MAX_COLOR_ATTACHMENTS)),
                        maxSamples: showNull(gl.getParameter(gl.MAX_SAMPLES)),
                        max3dTextureSize: showNull(gl.getParameter(gl.MAX_3D_TEXTURE_SIZE)),
                        maxArrayTextureLayers: showNull(gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS)),
                        maxTextureLodBias: showNull(gl.getParameter(gl.MAX_TEXTURE_LOD_BIAS)),
                        maxUniformBufferBindings: showNull(gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)),
                        maxUniformBlockSize: showNull(gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE)),
                        uniformBufferOffsetAlignment: showNull(gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT)),
                        maxCombinedUniformBlocks: showNull(gl.getParameter(gl.MAX_COMBINED_UNIFORM_BLOCKS)),
                        maxCombinedVertexUniformComponents: showNull(gl.getParameter(gl.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS)),
                        maxCombinedFragmentUniformComponents: showNull(gl.getParameter(gl.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS)),
                        maxTransformFeedbackInterleavedComponents: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS)),
                        maxTransformFeedbackSeparateAttribs: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)),
                        maxTransformFeedbackSeparateComponents: showNull(gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS)),
                        maxElementIndex: showNull(gl.getParameter(gl.MAX_ELEMENT_INDEX)),
                        maxServerWaitTimeout: showNull(gl.getParameter(gl.MAX_SERVER_WAIT_TIMEOUT))
                    };

                    this.copy(this.glAttributeMap, a2);
                }
            }

            private copy(o: any, t: any) {
                for (let key in t) {
                    o[key] = t[key];
                }
            }
        }

        let c = new C();
    }
}