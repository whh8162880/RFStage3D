///<reference path="../core/Config.ts"/>
///<reference path="three/Geometry.ts"/>
module rf {
    export enum VA {
        pos = "pos",
        normal = "normal",
        tangent = "tangent",
        color = "color",
        uv = "uv"
    }

    export enum FS{
        diff = "diff"
    }

    export enum VC{
        mv = "mv",
        invm ="invm",
        p = "p",
        mvp = "mvp",
        ui = "ui",
        lightDirection = "lightDirection",
        vc_diff = "vc_diff",
        vc_emissive = "vc_emissive"

    }

    export class Buffer3D implements IRecyclable {
        preusetime: number = 0;
        readly: boolean = false;
        constructor() { }
        awaken(): void { };
        sleep(): void { };
        onRecycle(): void {
            this.readly = false;
            this.preusetime = 0;
        }
    }
    export class Program3D extends Buffer3D {
        public program: WebGLProgram;

        private vShader: WebGLShader;

        private fShader: WebGLShader

        public vertexCode: string;
        public fragmentCode: string;

        uniforms:Object = {};
        attribs:Object = {};


        constructor() {
            super();
        }

        awaken(): boolean {
            if (undefined != this.program) {
                return true;
            }

            if (!this.vertexCode || !this.fragmentCode) {
                ThrowError("vertexCode or fragmentCode is empty")
                return false;
            }
            let g = gl;

            //创建 vertexShader
            this.vShader = this.createShader(this.vertexCode, g.VERTEX_SHADER);
            this.fShader = this.createShader(this.fragmentCode, g.FRAGMENT_SHADER);
            this.program = g.createProgram();

            g.attachShader(this.program, this.vShader);
            g.attachShader(this.program, this.fShader);
            g.linkProgram(this.program);
            if (!g.getProgramParameter(this.program, gl.LINK_STATUS)) {
                this.dispose();
                ThrowError(`create program error:${g.getProgramInfoLog(this.program)}`);
                return false;
            }
            
            //加入资源管理
            context3D.bufferLink.add(this);
            return true;
        }


        dispose(): void {
            let g = gl;
            if (this.vShader) {
                g.detachShader(this.program, this.vShader);
                g.deleteShader(this.vShader);
                this.vShader = null;
            }

            if (this.fShader) {
                g.detachShader(this.program, this.fShader);
                g.deleteShader(this.fShader);
                this.fShader = null;
            }

            if (this.program) {
                g.deleteProgram(this.program);
                this.program = null;
            }
        }

        onRecycle(): void {
            this.dispose();
            this.vertexCode = undefined;
            this.fragmentCode = undefined;
            this.preusetime = 0;
            this.readly = false;
        }
        /*
         * load shader from html file by document.getElementById
         */
        private createShader(code: string, type: number): WebGLShader {
            let g = gl;
            var shader: WebGLShader = g.createShader(type);
            g.shaderSource(shader, code);
            g.compileShader(shader);
            // Check the result of compilation
            if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) {
                let error: string = g.getShaderInfoLog(shader);
                g.deleteShader(shader);
                throw new Error(error);
            }
            return shader;
        }
    }


    export class VertexBuffer3D extends Buffer3D {
        
        // private varibles: { [key: string]: { size: number, offset: number } } = undefined;
        public numVertices: number = 0;
        public data32PerVertex: number = 0;
        public data: VertexInfo;

        buffer: WebGLBuffer = null;
        constructor() {
            super();
        }
        onRecycle(): void {
            if (this.buffer) {
                gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.numVertices = 0;
            this.data32PerVertex = 0;
            this.data = null;
        }
        awaken(): boolean {
            if (!this.data || !this.data32PerVertex || !this.numVertices) {
                this.readly = false;
                ThrowError("vertexBuffer3D unavailable");
                return false;
            }
            let g = gl;
            if (undefined == this.buffer) {
                this.buffer = g.createBuffer();
            }
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            g.bufferData(g.ARRAY_BUFFER, this.data.vertex, g.STATIC_DRAW);
            g.bindBuffer(g.ARRAY_BUFFER, null);
            this.readly = true;
            //加入资源管理
            context3D.bufferLink.add(this);
            return true;
        }

        public uploadFromVector(data: number[]|Float32Array|VertexInfo, startVertex: number = 0, numVertices: number = -1): void {

            if(data instanceof VertexInfo){
                this.data = data;
                this.numVertices = data.numVertices;
                return;
            }

            if (0 > startVertex) {
                startVertex = 0;
            }
            var nd: Float32Array;
            let data32PerVertex = this.data32PerVertex;
            if (numVertices != -1) {
                this.numVertices = data.length / data32PerVertex;
                if (this.numVertices - startVertex < numVertices) {
                    ThrowError("numVertices out of range");
                    return;
                }

                if (this.numVertices != numVertices && startVertex == 0) {
                    this.numVertices = numVertices;
                    nd = new Float32Array(data32PerVertex * numVertices);
                    nd.set(data.slice(startVertex * data32PerVertex, numVertices * data32PerVertex));
                    data = nd;
                }
            }

            if (0 < startVertex) {
                if (numVertices == -1) {
                    numVertices = data.length / data32PerVertex - startVertex;
                }
                nd = new Float32Array(data32PerVertex * numVertices);
                nd.set(data.slice(startVertex * data32PerVertex, numVertices * data32PerVertex));
                data = nd;
                this.numVertices = numVertices;
            } else {
                if (false == (data instanceof Float32Array)) {
                    data = new Float32Array(data);
                }
                this.numVertices = data.length / data32PerVertex;
            }
            this.data = new VertexInfo(<Float32Array>data,data32PerVertex);
        }


        // public regVariable(variable: string, offset: number, size: number): void {
        //     if (undefined == this.varibles) {
        //         this.varibles = {};
        //     }
        //     this.varibles[variable] = { size: size, offset: offset * 4 };
        // }

        attribarray:object = {};

        public uploadContext(program: Program3D): void {
            if (false == this.readly) {
                if (false == this.awaken()) {
                    throw new Error("create VertexBuffer error!");
                }
            }
            let loc = -1;
            let g = gl;
            let attribs = program.attribs;
            let p = program.program;
            let attribarray = this.attribarray;
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            let variables = this.data.variables
            for (let variable in variables) {
                if(true == (variable in attribs)){
                    loc = attribs[variable];
                }else{
                    loc = g.getAttribLocation(p, variable);
                    attribs[variable] = loc;
                }
                if (loc < 0) {
                    continue;
                }
                let o = variables[variable];
                g.vertexAttribPointer(loc, o.size, g.FLOAT, false, this.data32PerVertex * 4, o.offset * 4);
                if(true != attribarray[loc]){
                    g.enableVertexAttribArray(loc);
                    attribarray[loc] = true;
                }
            }
            this.preusetime = engineNow;
        }
    }

    export class IndexBuffer3D extends Buffer3D {
        numIndices: number;
        data: Uint16Array;
        buffer: WebGLBuffer;
        public quadid:number = -1;
        constructor() {
            super();
        }
        onRecycle(): void {
            if (this.buffer) {
                gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.numIndices = 0;
            this.data = null;
        }
        awaken(): boolean {
            if (true == this.readly) {
                if (DEBUG) {
                    if (undefined == this.buffer) {
                        ThrowError("indexBuffer readly is true but buffer is null");
                        return false;
                    }
                }
                return true;
            }
            if (!this.data) {
                this.readly = false;
                ThrowError("indexData unavailable");
                return false;
            }
            let g = gl;
            if(undefined == this.buffer){
                this.buffer = g.createBuffer();
            }
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.buffer);
            g.bufferData(g.ELEMENT_ARRAY_BUFFER, this.data, g.STATIC_DRAW);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);
            //加入资源管理
            this.readly = true;
            context3D.bufferLink.add(this);
        }
        public uploadFromVector(data: number[] | Uint16Array, startOffset: number = 0, count: number = -1): void {

            if (0 > startOffset) {
                startOffset = 0;
            }

            if (count != -1) {
                if (this.numIndices - startOffset < count) {
                    ThrowError("VectorData out of range");
                    return;
                }
            }

            if (0 < startOffset) {
                if (-1 == count) {
                    count = data.length - startOffset;
                }
                let nd = new Uint16Array(count);
                nd.set(data.slice(startOffset, startOffset + count));
                data = nd;
            } else {
                if (false == (data instanceof Uint16Array)) {
                    data = new Uint16Array(data);
                }
            }

            this.numIndices = data.length;
            this.data = <Uint16Array>data;
        }
    }


    //TODO:cube texture

    export class Texture extends Buffer3D {
        public key:number|string = undefined;
        public texture: WebGLTexture = undefined;
        public mipmap: boolean = false;
        public width: number = 0;
        public height: number = 0;
        public pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | BitmapData = undefined;
        constructor() {
            super();
        }

        awaken(): boolean {
            
            let tex = this.texture;
            let g = gl;
            let data = this.pixels;

            if(undefined == data){
                this.readly = false;
                return false;
            }

            if(data instanceof BitmapData){
                data = data.canvas;
            }

            if(undefined == tex){
                this.texture = tex = g.createTexture();
            }
            
            g.bindTexture(g.TEXTURE_2D, tex);

            //设置纹理参数 https://blog.csdn.net/a23366192007/article/details/51264454
            /**
             * void texParameteri(GLenum target, GLenum pname, GLint param) ;
                @pname:是纹理的参数：只能是下列四个
                    GL_TEXTURE_MIN_FILTER：指定纹理图片缩小时用到的算法
                    GL_TEXTURE_MAG_FILTER：指定纹理图片放大时用到的算法 
                    GL_TEXTURE_WRAP_S ：纹理包装算法，在s(u)方向 
                    GL_TEXTURE_WRAP_T ：纹理包装算法，在t(v)方向
                @param:是第二个参数的值（value）
                    放大和缩小所用的算法只有两个 NEAREST和LINEAR,
                    （即第三个参数param的值是webgl.NEAREST或webgl.LINEAR）分别是最近点采样和线性采样，
                    前者效率高单效果不好，后者效率不高单效果比较好。
             */

            /**
             *  Mag Modes
             *      gl.NEAREST
             *      gl.LINEAR
             */
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
             /**  Min Modes
             *      gl.NEAREST
             *      gl.LINEAR
                    gl.NEAREST_MIPMAP_NEAREST;      limit:power of two   
                    gl.NEAREST_MIPMAP_LINEAR;       limit:power of two
                    gl.LINEAR_MIPMAP_LINEAR         limit:power of two
                    gl.LINEAR_MIPMAP_NEAREST        limit:power of two
             * */
            //如果我们的贴图长宽不满足2的幂条件。那么MIN_FILTER 和 MAG_FILTER, 只能是 NEAREST或者LINEAR
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
            
           

            //如果我们的贴图长宽不满足2的幂条件。那么wrap_s 和 wrap_t 必须是 clap_to_edge
            //Wrapping Modes 
            //g.REPEAT                  limit:power of two   
            //g.MIRRORED_REPEAT         limit:power of two   
            //g.CLAMP_TO_EDGE
            
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);   //U方向上设置
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);   //v方向上设置



            /**
                ====format=====
                g.ALPHA
                g.RGB
                g.RGBA
                g.LUMINANCE
                g.LUMINANCE_ALPHA
                g.DEPTH_COMPONENT
                g.DEPTH_STENCIL
             */

            /**
                ===type====
                g.UNSIGNED_BYTE
                g.BYTE
                g.SHORT
                g.INT
                g.FLOAT
                g.UNSIGNED_BYTE;
                g.UNSIGNED_INT
                g.UNSIGNED_SHORT
                g.UNSIGNED_SHORT_4_4_4_4;
                g.UNSIGNED_SHORT_5_5_5_1;
                g.UNSIGNED_SHORT_5_6_5;
                //halfFloat
                g.getExtension('OES_texture_half_float').HALF_FLOAT_OES
                g.getExtension('WEBGL_depth_texture').UNSIGNED_INT_24_8_WEBGL
             */
            
            g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE,data);  
            // g.generateMipmap() createmipmap  limit:power of two
            g.bindTexture(g.TEXTURE_2D, null);

            this.readly = true;

            //加入资源管理
            context3D.bufferLink.add(this);

            return true;
        }

        public uploadContext(program: Program3D,index:number,variable:string): void {
            if (false == this.readly) {
                this.awaken();
            }

			let uniforms = program.uniforms;
			let g = gl;
            var index_tex;
            
            g.activeTexture(gl["TEXTURE"+index]);
            g.bindTexture(g.TEXTURE_2D, this.texture);
			if(true == uniforms.hasOwnProperty(variable)){
				index_tex = uniforms[variable];
			}else{
				index_tex = g.getUniformLocation(program.program, variable);
				uniforms[variable] = index_tex;
			}
            
            // var index_tex = gl.getUniformLocation(program.program, variable);
            if(undefined != index_tex){
                g.uniform1i(index_tex, index);
            }


            this.preusetime = engineNow;
            
        }

        onRecycle():void{
            if(this.texture){
                gl.deleteTexture(this.texture);
                this.texture = null;
                this.mipmap = false;
            }
            if(this.pixels){
                this.pixels = null;
            }
            this.width = 0;
            this.height = 0;
        }
    }


    export class RttTexture extends Texture{
        public create(width: number, height: number):void{
            this.width = width;
            this.height = height;
        }
    }
}

