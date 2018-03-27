///<reference path="../core/Config.ts"/>
module rf
{
    export class VertexBuffer3D
    {
        private _numVertices: number; // int
        private _data32PerVertex: number; //int
        private _glBuffer: WebGLBuffer;

        private _data: number[];

        constructor(numVertices: number, data32PerVertex: number)
        {

            this._numVertices = numVertices;
            this._data32PerVertex = data32PerVertex;

            this._glBuffer = GL.createBuffer();
            if (!this._glBuffer)
                throw new Error("Failed to create buffer");

           // GL.bindBuffer(GL.ARRAY_BUFFER, this._glBuffer);

        }

        get glBuffer(): WebGLBuffer
        {
            return this._glBuffer;
        }

        get data32PerVertex(): number
        {
            return this._data32PerVertex
        }

        public uploadFromVector(data: number[], startVertex: number/* int */, numVertices: number/* int */): void
        {
            this._data = data;

            if (startVertex != 0 || numVertices != this._numVertices) {
                data = data.slice(startVertex * this._data32PerVertex, (numVertices * this._data32PerVertex));
            }

            GL.bindBuffer(GL.ARRAY_BUFFER, this._glBuffer);
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);
            GL.bindBuffer(GL.ARRAY_BUFFER, null);
        }

        public dispose(): void
        {
            GL.deleteBuffer(this._glBuffer);
            this._glBuffer = null;
            this._data.length = 0;
            this._numVertices = 0;
            this._data32PerVertex = 0;
        }
    } 


    export class IndexBuffer3D
    {
        public numIndices: number;
       // public buffer: WebGLBuffer;
        private _data: number[];
        private _glBuffer: WebGLBuffer;

        constructor(numIndices: number /* int */)
        {
            this.numIndices = numIndices;
            this._glBuffer = GL.createBuffer();
            //GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
        }

        get glBuffer(): WebGLBuffer
        {
            return this._glBuffer;
        }

        public uploadFromVector(data: number[] /* Vector.<uint> */, startOffset: number /* int */, count: number /* int */): void
        {

            this._data = data;


            if (startOffset != 0 || count != this.numIndices) {
                data = data.slice(startOffset, startOffset + count);
            }
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this._glBuffer);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), GL.STATIC_DRAW);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        }

        public dispose(): void
        {
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

