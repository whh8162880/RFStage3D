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

        awaken(): void {

            if (!this.data || !this.data32PerVertex || !this.numVertices) {
                this.readly = false;
                ThrowError("vertexBuffer3D unavailable");
                return;
            }

            if (undefined == this.buffer) {
                this.buffer = GL.createBuffer();
            }

            GL.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
            GL.bufferData(GL.ARRAY_BUFFER, this.data, GL.STATIC_DRAW);
            GL.bindBuffer(GL.ARRAY_BUFFER, null);

            this.readly = true;
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


    export class IndexBuffer3D {
        public numIndices: number;
        // public buffer: WebGLBuffer;
        private _data: number[];
        private _glBuffer: WebGLBuffer;

        constructor(numIndices: number /* int */) {
            this.numIndices = numIndices;
            this._glBuffer = GL.createBuffer();
            //GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
        }

        get glBuffer(): WebGLBuffer {
            return this._glBuffer;
        }

        public uploadFromVector(data: number[] /* Vector.<uint> */, startOffset: number /* int */, count: number /* int */): void {

            this._data = data;


            if (startOffset != 0 || count != this.numIndices) {
                data = data.slice(startOffset, startOffset + count);
            }
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), GL.STATIC_DRAW);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        }

        public dispose(): void {
            GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this.numIndices = 0;
            this._data.length = 0;
        }
        //        public uploadFromArray(data: number[] /* Vector.<uint> */, startOffset: number /* int */, count: number /* int */): void
        //      {
        //        this.uploadFromVector
        //  }
    }
}

