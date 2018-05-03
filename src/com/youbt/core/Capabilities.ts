
namespace rf {
    export interface ICapabilities {
        /** 浏览器的平台 */
        readonly platform: string;
        /** 用户代理信息 */
        readonly userAgent: string;

        /** 是否支持 WebGL */
        readonly supportWebGL: boolean;

        /** GL 的版本 */
        readonly glVersion: string;
        /** GLSL 语言版本 */
        readonly shadingLanguageVersion: string;
        /** 供应商 */
        readonly vendor: string;
        /** 渲染器 */
        readonly renderer: string;
        /** 实际上渲染时使用的供应商 */
        readonly unMaskedVendor: string;
        /** 实际上渲染时使用的渲染器 */
        readonly unMaskedRenderer: string;
        /** 是否抗锯齿 */
        readonly antialias: boolean;
        /** 是否使用了 ANGLE 技术来使 Direct X 支持 WebGL 的接口, 文档地址: https://baike.baidu.com/item/angle/3988?fr=aladdin */
        readonly ANGLE: string;

        // ----- Vertex Shader Begin -----
        /** 顶点着色器中最多可以定义的属性数量 */
        readonly maxVertexAttributes: number;
        /** 一个顶点着色器上可以使用纹理单元的最大数量 */
        readonly maxVertexTextureImageUnits: number;
        /** 一个顶点着色器上可以使用的 uniform 向量的最大数量 */
        readonly maxVertexUniformVectors: number;
        /** 一个顶点着色器上可以使用的 varying 向量的最大数量 */
        readonly maxVaryingVectors: number;
        // ----- Vertex Shader  End  -----

        // ----- Rasterizer Begin -----
        /** 带锯齿直线宽度的范围  */
        readonly aliasedLineWidthRange: Float32Array[];
        /** 带锯齿点的尺寸范围 */
        readonly aliasedPointSizeRange: Float32Array[];
        // ----- Rasterizer  End  -----

        // ----- Fragment Shader Begin -----
        /** 一个片段着色器上可以使用的 uniform 向量的最大数量 */
        readonly maxFragmentUniformVectors: number;
        /** 一个片段着色器上可以使用纹理单元的最大数量 */
        readonly maxTextureImageUnits: number;
        // ----- Fragment Shader  End  -----

        // ----- Textures Begin -----
        /** 纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸 */
        readonly maxTextureSize: number;
        /** 立方图纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸 */
        readonly maxCubeMapTextureSize: number;
        /** 所有片段着色器总共能访问的纹理单元数 */
        readonly maxCombinedTextureImageUnits: number;
        /** 最大同向异性过滤值, 文档: https://blog.csdn.net/dcrmg/article/details/53470174 */
        readonly maxAnisotropy: number;
        // ----- Textures  End  -----

        // ----- Framebuffer Begin -----
        /**  */
        readonly maxColorBuffers: number;
        /** 颜色缓存中红色的位数 */
        readonly redBits: number;
        /** 颜色缓存中绿色的位数 */
        readonly greenBits: number;
        /** 颜色缓存中蓝色的位数 */
        readonly blueBits: number;
        /** 颜色缓存中透明度的位数 */
        readonly alphaBits: number;
        /** 深度缓存中每个像素的位数 */
        readonly depthBits: number;
        /** 模板缓存中每个像素的位数 */
        readonly stencilBits: number;
        /** 最大的渲染缓冲尺寸 */
        readonly maxRenderBufferSize: number;
        /** 视口最大尺寸 */
        readonly maxViewportDimensions: Int32Array[];
        // ----- Framebuffer  End  -----

        readonly isMobile:boolean;

        init(): void;
    }

    

    class C implements ICapabilities {
        platform: string;
        userAgent: string;
        supportWebGL: boolean;
        glVersion: string;
        shadingLanguageVersion: string;
        vendor: string;
        renderer: string;
        unMaskedVendor: string;
        unMaskedRenderer: string;
        antialias: boolean;
        ANGLE: string;

        maxVertexAttributes: number;
        maxVertexTextureImageUnits: number;
        maxVertexUniformVectors: number;
        maxVaryingVectors: number;

        aliasedLineWidthRange: Float32Array[];
        aliasedPointSizeRange: Float32Array[];

        maxFragmentUniformVectors: number;
        maxTextureImageUnits: number;

        maxTextureSize: number;
        maxCubeMapTextureSize: number;
        maxCombinedTextureImageUnits: number;
        maxAnisotropy: number;

        maxColorBuffers: number;
        redBits: number;
        greenBits: number;
        blueBits: number;
        alphaBits: number;
        depthBits: number;
        stencilBits: number;
        maxRenderBufferSize: number;
        maxViewportDimensions: Int32Array[];

        isMobile:boolean;

        init(): void {

            this.platform = navigator.platform;
            this.userAgent = navigator.userAgent;

            let g = gl;

            this.supportWebGL = undefined != g;
            if (!this.supportWebGL) {
                return;
            }

            this.glVersion = g.getParameter(g.VERSION);
            this.shadingLanguageVersion = g.getParameter(g.SHADING_LANGUAGE_VERSION);
            this.vendor = g.getParameter(g.VENDOR);
            this.renderer = g.getParameter(g.RENDERER);

            let dbgRenderInfo = g.getExtension("WEBGL_debug_renderer_info");
            if (dbgRenderInfo != undefined) {
                this.unMaskedVendor = g.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
                this.unMaskedRenderer = g.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
            }

            this.antialias = !!g.getContextAttributes().antialias;
            this.ANGLE = this.getAngle(g);

            this.maxVertexAttributes = g.getParameter(g.MAX_VERTEX_ATTRIBS);
            this.maxVertexTextureImageUnits = g.getParameter(g.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            this.maxVertexUniformVectors = g.getParameter(g.MAX_VERTEX_UNIFORM_VECTORS);
            this.maxVaryingVectors = g.getParameter(g.MAX_VARYING_VECTORS);

            this.aliasedLineWidthRange = g.getParameter(g.ALIASED_LINE_WIDTH_RANGE);
            this.aliasedPointSizeRange = g.getParameter(g.ALIASED_POINT_SIZE_RANGE);

            this.maxFragmentUniformVectors = g.getParameter(g.MAX_FRAGMENT_UNIFORM_VECTORS);
            this.maxTextureImageUnits = g.getParameter(g.MAX_TEXTURE_IMAGE_UNITS);

            this.maxTextureSize = g.getParameter(g.MAX_TEXTURE_SIZE);
            this.maxCubeMapTextureSize = g.getParameter(g.MAX_CUBE_MAP_TEXTURE_SIZE);
            this.maxCombinedTextureImageUnits = g.getParameter(g.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            this.maxAnisotropy = this.getMaxAnisotropy(g);

            this.maxColorBuffers = this.getMaxColorBuffers(g);
            this.redBits = g.getParameter(g.RED_BITS);
            this.greenBits = g.getParameter(g.GREEN_BITS);
            this.blueBits = g.getParameter(g.BLUE_BITS);
            this.alphaBits = g.getParameter(g.ALPHA_BITS);
            this.depthBits = g.getParameter(g.DEPTH_BITS);
            this.stencilBits = g.getParameter(g.STENCIL_BITS);
            this.maxRenderBufferSize = g.getParameter(g.MAX_RENDERBUFFER_SIZE);
            this.maxViewportDimensions = g.getParameter(g.MAX_VIEWPORT_DIMS);

            this.isMobile = this.IsPC() == false;
        
        }

        IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
               "SymbianOS", "Windows Phone",
               "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
               if (userAgentInfo.indexOf(Agents[v]) > 0) {
                  flag = false;
                  break;
               }
            }
            return flag;
         }
        

        private describeRange(value: any[]): string {
            return '[' + value[0] + ', ' + value[1] + ']';
        }

        private getAngle(g: WebGLRenderingContext): string {
            var lineWidthRange = this.describeRange(g.getParameter(g.ALIASED_LINE_WIDTH_RANGE));

            // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
            var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
                (g.getParameter(g.RENDERER) !== 'Internet Explorer') &&
                (g.getParameter(g.RENDERER) !== 'Microsoft Edge') &&
                (lineWidthRange === this.describeRange([1, 1]));

            if (angle) {
                // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
                // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
                //
                // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
                // due to driver bugs, etc.
                if (isPowerOfTwo(g.getParameter(g.MAX_VERTEX_UNIFORM_VECTORS)) && isPowerOfTwo(g.getParameter(g.MAX_FRAGMENT_UNIFORM_VECTORS))) {
                    return 'Yes, D3D11';
                } else {
                    return 'Yes, D3D9';
                }
            }

            return 'No';
        }

        private getMaxAnisotropy(g: WebGLRenderingContext): number {
            let e = g.getExtension('EXT_texture_filter_anisotropic')
                    || g.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                    || g.getExtension('MOZ_EXT_texture_filter_anisotropic');
            if (e) {
                let max = g.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                if (max === 0) {
                    max = 2;
                }
                return max;
            }
            return NaN;
        }

        private getMaxColorBuffers(g: WebGLRenderingContext): number {
            let maxColorBuffers = 1;
            let ext = g.getExtension("WEBGL_draw_buffers");
            if (ext != null) {
                maxColorBuffers = g.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL);
            }
            return maxColorBuffers;
        }
    }

    /**
     * 提供当前浏览器的功能描述
     */
    export const Capabilities: ICapabilities = new C();
}