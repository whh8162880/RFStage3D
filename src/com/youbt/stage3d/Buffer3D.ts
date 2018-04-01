///<reference path="../core/Config.ts"/>
///<reference path="geo/Geometry.ts"/>
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
        p = "p",
        mvp = "mvp",
        ui = "ui"
    }

    class Buffer3D implements IRecyclable {
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

            //创建 vertexShader
            this.vShader = this.createShader(this.vertexCode, gl.VERTEX_SHADER);
            this.fShader = this.createShader(this.fragmentCode, gl.FRAGMENT_SHADER);
            this.program = gl.createProgram();

            gl.attachShader(this.program, this.vShader);
            gl.attachShader(this.program, this.fShader);
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                this.dispose();
                ThrowError(`create program error:${gl.getProgramInfoLog(this.program)}`);
                return false;
            }

            return true;
        }


        dispose(): void {
            if (this.vShader) {
                gl.detachShader(this.program, this.vShader);
                gl.deleteShader(this.vShader);
                this.vShader = null;
            }

            if (this.fShader) {
                gl.detachShader(this.program, this.fShader);
                gl.deleteShader(this.fShader);
                this.fShader = null;
            }

            if (this.program) {
                gl.deleteProgram(this.program);
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
            // var script: HTMLObjectElement = <HTMLObjectElement>document.getElementById(elementId);
            // if (!script)
            // throw new Error("cant find elementId: " + elementId);
            var shader: WebGLShader = gl.createShader(type);
            gl.shaderSource(shader, code);
            gl.compileShader(shader);
            // Check the result of compilation
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                let error: string = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
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
            if (undefined == this.buffer) {
                this.buffer = gl.createBuffer();
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.data.vertex.array, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.readly = true;
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
            if (numVertices != -1) {
                this.numVertices = data.length / this.data32PerVertex;
                if (this.numVertices - startVertex < numVertices) {
                    ThrowError("numVertices out of range");
                    return;
                }

                if (this.numVertices != numVertices && startVertex == 0) {
                    this.numVertices = numVertices;
                    nd = new Float32Array(this.data32PerVertex * numVertices);
                    nd.set(data.slice(startVertex * this.data32PerVertex, numVertices * this.data32PerVertex));
                    data = nd;
                }
            }

            if (0 < startVertex) {
                if (numVertices == -1) {
                    numVertices = data.length / this.data32PerVertex - startVertex;
                }
                nd = new Float32Array(this.data32PerVertex * numVertices);
                nd.set(data.slice(startVertex * this.data32PerVertex, numVertices * this.data32PerVertex));
                data = nd;
                this.numVertices = numVertices;
            } else {
                if (false == (data instanceof Float32Array)) {
                    data = new Float32Array(data);
                }
                this.numVertices = data.length / this.data32PerVertex;
            }
            this.data = new VertexInfo(<Float32Array>data,this.data32PerVertex);
        }


        // public regVariable(variable: string, offset: number, size: number): void {
        //     if (undefined == this.varibles) {
        //         this.varibles = {};
        //     }
        //     this.varibles[variable] = { size: size, offset: offset * 4 };
        // }


        public uploadContext(program: Program3D): void {
            if (false == this.readly) {
                if (false == this.awaken()) {
                    throw new Error("create VertexBuffer error!");
                }
            }
            var location: number = -1;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            let variables = this.data.variables
            for (let variable in variables) {
                location = gl.getAttribLocation(program.program, variable);
                if (location < 0) {
                    continue;
                }
                let o = variables[variable];
                gl.vertexAttribPointer(location, o.size, gl.FLOAT, false, this.data32PerVertex * 4, o.offset * 4);
                gl.enableVertexAttribArray(location);
            }
        }
    }

    export class IndexBuffer3D extends Buffer3D {
        public numIndices: number;
        public data: Uint16Array;
        public buffer: WebGLBuffer;

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
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

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

        public texture: WebGLTexture;
        public mipmap: number;
        public width: number;
        public height: number;
        public format: number;
        private _forRTT: boolean;

        public pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement

        constructor(width: number, height: number, format: number, optimizeForRenderToTexture: boolean, mipmap: number) {
            super();
            this.mipmap = mipmap;
            this.width = width;
            this.height = height;
            this.format = format;
            this._forRTT = optimizeForRenderToTexture;
        }


        awaken(): boolean {
            if (undefined != this.texture){
                return true
            }

            var tex:WebGLTexture;

            this.texture = tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels);  
            gl.bindTexture(gl.TEXTURE_2D, null);
            return true;
        }

        public uploadContext(program: Program3D,index:number,variable:string): void {
            if (false == this.readly) {
                this.awaken();
            }
            gl.activeTexture(gl["TEXTURE"+index]);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            var index_tex = gl.getUniformLocation(program.program, variable);
            gl.uniform1i(index_tex, index);
        }

        // public uploadFromImage(source: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, miplevel: number /* uint */ = 0): void {
        //     //GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, 1); //uv原点在左下角，v朝上时时才需翻转
        //     //GL.pixelStorei(GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

        //     this.pixels = source;

        //     // gl.activeTexture(gl["TEXTURE" + this.textureUnit]);
        //     gl.bindTexture(gl.TEXTURE_2D, this.texture);

        //     //TODO: set filter mode API
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //GL.NEAREST
        //     if (this.mipmap == 0) {
        //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);// GL.NEAREST
        //     } else {
        //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); //linnear生成mipmap,缩放也linear
        //         gl.generateMipmap(gl.TEXTURE_2D);
        //     }

        //     gl.texImage2D(gl.TEXTURE_2D, miplevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

        //     if (!gl.isTexture(this.texture)) {
        //         throw new Error("Error:Texture is invalid");
        //     }
        //     //bind null 会不显示贴图 why?
        //     //GL.bindTexture(GL.TEXTURE_2D, null);
        // }


        onRecycle():void{
            if(this.texture){
                gl.deleteTexture(this.texture);
                this.texture = null;
                this.mipmap = 0;
            }
            if(this.pixels){
                this.pixels = null;
            }

            this.width = 0;
            this.height = 0;
            
        }
    }
}

