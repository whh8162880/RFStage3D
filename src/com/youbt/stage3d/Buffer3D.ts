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
            g.bufferData(g.ARRAY_BUFFER, this.data.vertex.array, g.STATIC_DRAW);
            g.bindBuffer(g.ARRAY_BUFFER, null);
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


        public uploadContext(program: Program3D): void {
            if (false == this.readly) {
                if (false == this.awaken()) {
                    throw new Error("create VertexBuffer error!");
                }
            }
            let loc = -1;
            let g = gl;
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            let variables = this.data.variables
            for (let variable in variables) {
                loc = g.getAttribLocation(program.program, variable);
                if (loc < 0) {
                    continue;
                }
                let o = variables[variable];
                g.vertexAttribPointer(loc, o.size, g.FLOAT, false, this.data32PerVertex * 4, o.offset * 4);
                g.enableVertexAttribArray(loc);
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
            let g = gl;
            if(undefined == this.buffer){
                this.buffer = g.createBuffer();
            }
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.buffer);
            g.bufferData(g.ELEMENT_ARRAY_BUFFER, this.data, g.STATIC_DRAW);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);

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

            //UV读取方式
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
            gl.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
            gl.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
            gl.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);

            g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE,data);  
            g.bindTexture(g.TEXTURE_2D, null);
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

