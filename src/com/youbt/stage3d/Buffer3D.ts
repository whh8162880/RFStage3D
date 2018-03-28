///<reference path="../core/Config.ts"/>
module rf {
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


    export class VertexBuffer3D extends Buffer3D {
        public numVertices: number = 0;
        public data32PerVertex: number = 0;
        public data: Float32Array;
        buffer: WebGLBuffer = null;
        constructor() {
            super();
        }

        onRecycle(): void {
            if (this.buffer) {
                GL.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.numVertices = 0;
            this.data32PerVertex = 0;
            this.data = null;
        }

        awaken(): boolean {

            if(undefined != this.buffer){
                return true;
            }

            if (!this.data || !this.data32PerVertex || !this.numVertices) {
                this.readly = false;
                ThrowError("vertexBuffer3D unavailable");
                return false;
            }

            if (undefined == this.buffer) {
                this.buffer = GL.createBuffer();
            }

            GL.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
            GL.bufferData(GL.ARRAY_BUFFER, this.data, GL.STATIC_DRAW);
            GL.bindBuffer(GL.ARRAY_BUFFER, null);

            this.readly = true;
            return true;
        }

        public uploadFromVector(data: number[] | Float32Array, startVertex: number = 0, numVertices: number = -1): void {
            if (0 > startVertex) {
                startVertex = 0;
            }
            if (numVertices != -1) {
                if (this.numVertices - startVertex < numVertices) {
                    ThrowError("numVertices out of range");
                    return;
                }
            }

            if (0 < startVertex) {
                let nd = new Float32Array(this.data32PerVertex * numVertices);
                nd.set(data.slice(startVertex * this.data32PerVertex, numVertices * this.data32PerVertex));
                data = nd;
            } else {
                data = new Float32Array(data);
            }
            this.data = data;
        }
    }

    


    export class IndexBuffer3D extends Buffer3D{

        public numIndices: number;
        // public buffer: WebGLBuffer;
        public data:Uint16Array;
        public buffer: WebGLBuffer;

        constructor() {
            super();
        }

        onRecycle(): void {
            if (this.buffer) {
                GL.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.numIndices = 0;
            this.data = null;
        }

        awaken():boolean{
            if(true == this.readly){
                if(DEBUG){
                    if(undefined == this.buffer){
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

            this.buffer = GL.createBuffer();
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.data, GL.STATIC_DRAW);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

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
                let nd = new Uint16Array(count);
                nd.set(data.slice(startOffset, startOffset + count));
                data = nd;
            } else {
                data = new Uint16Array(data);
            }
            this.data = data;
        }
    }
}

