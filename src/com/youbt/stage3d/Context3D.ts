///<reference path="./Buffer3D.ts"/>
namespace rf {
	export let context3D: Context3D;

	// export enum Context3DCompareMode {
	// 	ALWAYS = 'always',
	// 	EQUAL = 'equal',
	// 	GREATER = 'greater',
	// 	GREATER_EQUAL = 'greaterEqual',
	// 	LESS = 'less',
	// 	LESS_EQUAL = 'lessEqual',
	// 	NEVER = 'never',
	// 	NOT_EQUAL = 'notEqual'
	// }

	export enum Context3DTextureFormat {
		BGRA = 'bgra'
	}

	// export class Context3DBlendFactor {
	// 	static ONE: number;
	// 	static ZERO: number;

	// 	static SOURCE_COLOR: number;
	// 	static DESTINATION_COLOR: number;

	// 	static SOURCE_ALPHA: number;
	// 	static DESTINATION_ALPHA: number;

	// 	static ONE_MINUS_SOURCE_COLOR: number;
	// 	static ONE_MINUS_DESTINATION_COLOR: number;

	// 	static ONE_MINUS_SOURCE_ALPHA: number;
	// 	static ONE_MINUS_DESTINATION_ALPHA: number;

	// 	static init(): void {
	// 		Context3DBlendFactor.ONE = GL.ONE;
	// 		Context3DBlendFactor.ZERO = GL.ZERO;
	// 		Context3DBlendFactor.SOURCE_COLOR = GL.SRC_COLOR;
	// 		Context3DBlendFactor.DESTINATION_COLOR = GL.DST_COLOR;
	// 		Context3DBlendFactor.SOURCE_ALPHA = GL.SRC_ALPHA;
	// 		Context3DBlendFactor.DESTINATION_ALPHA = GL.DST_ALPHA;
	// 		Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR = GL.ONE_MINUS_SRC_COLOR;
	// 		Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR = GL.ONE_MINUS_DST_COLOR;
	// 		Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA = GL.ONE_MINUS_SRC_ALPHA;
	// 		Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA = GL.ONE_MINUS_DST_ALPHA;
	// 		//CONSTANT_COLOR
	// 		//ONE_MINUS_CONSTANT_COLOR
	// 		//ONE_MINUS_CONSTANT_ALPHA
	// 	}
	// }

	export enum Context3DVertexBufferFormat {
		BYTES_4 = 4,
		FLOAT_1 = 1,
		FLOAT_2 = 2,
		FLOAT_3 = 3,
		FLOAT_4 = 4
	}

	export enum Context3DTriangleFace {
		BACK	= 'back', //CCW
		FRONT	= 'front', //CW
		FRONT_AND_BACK = 'frontAndBack',
		NONE = 'none'
	}

	export class Context3D {
		//todo:enableErrorChecking https://www.khronos.org/webgl/wiki/Debugging
		private _clearBit: number;
		private _bendDisabled: boolean = true;
		private _depthDisabled: boolean = true;
		constructor() {
		}

		public configureBackBuffer(
			width: number,
			height: number,
			antiAlias: number,
			enableDepthAndStencil: boolean = true
		): void {
			gl.viewport(0, 0, width, height);
			gl.canvas.width = width;
			gl.canvas.height = height;
			this._depthDisabled = enableDepthAndStencil;
			//TODO: antiAlias , Stencil
			if (enableDepthAndStencil) {
				this._clearBit = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;
				gl.enable(gl.DEPTH_TEST);
				gl.enable(gl.STENCIL_TEST);
			} else {
				this._clearBit = gl.COLOR_BUFFER_BIT;
				gl.disable(gl.DEPTH_TEST);
				gl.disable(gl.STENCIL_TEST);
			}
		}

		public createVertexBuffer(data: number[]|Float32Array|VertexInfo,data32PerVertex: number,startVertex: number = 0, numVertices: number = -1): VertexBuffer3D {
			let buffer: VertexBuffer3D = recyclable(VertexBuffer3D);
			buffer.data32PerVertex = data32PerVertex;
			buffer.uploadFromVector(data,startVertex,numVertices);			
			return buffer;
		}

		private indexs:{[key:number]:IndexBuffer3D};
		private indexByte:Uint16Array = undefined;
		private initIndexByQuadCount(count:number):void{
			let byte = this.indexByte = new Uint16Array(count * 6);
			count *= 4;
			let j = 0;
			for(var i:number =0;i<count;i+=4){
				byte[j++] = i;
				byte[j++] = i + 1;
				byte[j++] = i + 3;
				byte[j++] = i + 1;
				byte[j++] = i + 2;
				byte[j++] = i + 3;
			}
		}

		public getIndexByQuad(quadCount:number):IndexBuffer3D{
			if(quadCount > 2000){
				ThrowError("你要这么多四边形干嘛？");
				return null;
			}

			if(undefined == this.indexs){
				this.indexs = {};
			}
			let buffer = this.indexs[quadCount];
			let length = quadCount * 6;
			if(undefined == buffer){
				
				let array = new Uint16Array(length)
				if(undefined == this.indexByte){
					this.initIndexByQuadCount(2000);
				}
				array.set(this.indexByte.slice(0,length));

				this.indexs[quadCount] = buffer = this.createIndexBuffer(array);
			}
			return buffer;
		}

		public createIndexBuffer(data:number[] | Uint16Array): IndexBuffer3D {
			let buffer = recyclable(IndexBuffer3D);
			buffer.uploadFromVector(data);
			return buffer
		}

		/**
        * @format only support Context3DTextureFormat.BGRA
        * @optimizeForRenderToTexture not implement
        */
		public createTexture(width: number, height: number, format:number, optimizeForRenderToTexture: boolean, streamingLevels: number = 0): Texture {
			return new Texture(width, height, format, optimizeForRenderToTexture, streamingLevels);
		}

		private _rttFramebuffer: WebGLFramebuffer;
		public setRenderToTexture(
			texture: Texture,
			enableDepthAndStencil: boolean = false,
			antiAlias: number = 0,
			surfaceSelector: number /*int*/ = 0,
			colorOutputIndex: number /*int*/ = 0
		): void {
			if (enableDepthAndStencil) {
				this._clearBit = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;
				gl.enable(gl.DEPTH_TEST);
				gl.enable(gl.STENCIL_TEST);
			} else {
				this._clearBit = gl.COLOR_BUFFER_BIT;
				gl.disable(gl.DEPTH_TEST);
				gl.disable(gl.STENCIL_TEST);
			}

			//TODO: antiAlias surfaceSelector colorOutputIndex
			if (!this._rttFramebuffer) {
				this._rttFramebuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, this._rttFramebuffer);

				var renderbuffer: WebGLRenderbuffer = gl.createRenderbuffer();
				gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
				gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512); //force 512

				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
				gl.framebufferTexture2D(gl.FRAMEBUFFER,	gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,	texture.texture,	0);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._rttFramebuffer);
		}

		public setRenderToBackBuffer(): void {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}

		public programs:{[key:string]:Recyclable<Program3D>} = {};

		public createProgram(vertexCode:string,fragmentCode:string,key?:string): Recyclable<Program3D> {
			var program:Recyclable<Program3D>
			if(undefined != key){
				program = this.programs[key];
				if(undefined == program){
					this.programs[key] = program = recyclable(Program3D);
				}
			}else{
				program = recyclable(Program3D);
			}
			program.vertexCode = vertexCode;
			program.fragmentCode = fragmentCode;
			return program;
		}

		/**
		 * 
		 * @param variable 
		 * @param data 
		 * @param format FLOAT_1 2 3 4
		 */
		public setProgramConstantsFromVector(variable: string, data: number[] | Float32Array,format:number): void {
			var index: WebGLUniformLocation = gl.getUniformLocation(this._linkedProgram.program, variable);
			if(index){
				gl['uniform' + format + 'fv'](index, data);;
			}
			
		}

		/**
        *  @variable must predefined in glsl
        */
		public setProgramConstantsFromMatrix(variable: string,matrix: Matrix3D): void {
			var index: WebGLUniformLocation = gl.getUniformLocation(this._linkedProgram.program, variable);
			if(index){
				gl.uniformMatrix4fv(index,false,matrix.rawData);
			}
		}

		private _linkedProgram: Program3D = undefined;
		public setProgram(program: Program3D): void {
			if (program == null || program == this._linkedProgram) return;

			if(false == program.readly){
				if(false == program.awaken()){
					ThrowError("program create error!");
					return;
				}
			}

			this._linkedProgram = program;
			gl.useProgram(program.program);
		}

		public clear(
			red: number = 0.0,
			green: number = 0.0,
			blue: number = 0.0,
			alpha: number = 1.0,
			depth: number = 1.0,
			stencil: number /*uint*/ = 0,
			mask: number /* uint */ = 0xffffffff
		): void {
			gl.clearColor(red, green, blue, alpha);
			gl.clearDepth(depth); // TODO:dont need to call this every time
			gl.clearStencil(stencil); //stencil buffer

			gl.clear(this._clearBit);
		}

		public setCulling(triangleFaceToCull: string): void {
			gl.frontFace(gl.CW);
			switch (triangleFaceToCull) {
				case Context3DTriangleFace.NONE:
					gl.disable(gl.CULL_FACE);
					break;
				case Context3DTriangleFace.BACK:
					gl.enable(gl.CULL_FACE);
					gl.cullFace(gl.BACK);
					break;
				case Context3DTriangleFace.FRONT:
					gl.enable(gl.CULL_FACE);
					gl.cullFace(gl.FRONT);
					break;
				case Context3DTriangleFace.FRONT_AND_BACK:
					gl.enable(gl.CULL_FACE);
					gl.cullFace(gl.FRONT_AND_BACK);
					break;
			}
		}

		/**
		 * 
		 * @param depthMask 
		 * @param passCompareMode 
		 * 
		 * Context3DCompareMode.LESS			GL.LESS
		 * Context3DCompareMode.NEVER			GL.NEVER
		 * Context3DCompareMode.EQUAL			GL.EQUAL
		 * Context3DCompareMode.GREATER			GL.GREATER
		 * Context3DCompareMode.NOT_EQUAL		GL.NOTEQUAL
		 * Context3DCompareMode.ALWAYS			GL.ALWAYS
		 * Context3DCompareMode.LESS_EQUAL		GL.LEQUAL
		 * Context3DCompareMode.GREATER_EQUAL	GL.GEQUAL
		 */
		public setDepthTest(depthMask: boolean, passCompareMode: number): void {
			if (this._depthDisabled) {
				gl.enable(gl.DEPTH_TEST);
				this._depthDisabled = false;
			}

			gl.depthMask(depthMask);
			gl.depthFunc(passCompareMode);
		}


		/**
		  	Context3DBlendFactor.ONE = GL.ONE;
			Context3DBlendFactor.ZERO = GL.ZERO;
			Context3DBlendFactor.SOURCE_COLOR = GL.SRC_COLOR;
			Context3DBlendFactor.DESTINATION_COLOR = GL.DST_COLOR;
			Context3DBlendFactor.SOURCE_ALPHA = GL.SRC_ALPHA;
			Context3DBlendFactor.DESTINATION_ALPHA = GL.DST_ALPHA;
			Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR = GL.ONE_MINUS_SRC_COLOR;
			Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR = GL.ONE_MINUS_DST_COLOR;
			Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA = GL.ONE_MINUS_SRC_ALPHA;
			Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA = GL.ONE_MINUS_DST_ALPHA;
		 */

		public setBlendFactors(sourceFactor: number, destinationFactor: number): void {
			if (this._bendDisabled) {
				gl.enable(gl.BLEND); //stage3d cant disable blend?
				this._bendDisabled = false;
			}
			gl.blendFunc(sourceFactor, destinationFactor);
		}

		public drawTriangles(indexBuffer: IndexBuffer3D,firstIndex: number = 0,numTriangles: number = -1): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			gl.drawElements(gl.TRIANGLES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, gl.UNSIGNED_SHORT, firstIndex * 2);
		}


		/*
         *  [Webgl only]
         *   For instance indices = [1,3,0,4,1,2]; will draw 3 lines :
         *   from vertex number 1 to vertex number 3, from vertex number 0 to vertex number 4, from vertex number 1 to vertex number 2
         */
		public drawLines(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numLines: number = -1): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			gl.drawElements(gl.LINES, numLines < 0 ? indexBuffer.numIndices : numLines * 2, gl.UNSIGNED_SHORT, firstIndex * 2);
		}

		/*
         * [Webgl only]
         *  For instance indices = [1,2,3] ; will only render vertices number 1, number 2, and number 3 
         */
		public drawPoints(indexBuffer: IndexBuffer3D,firstIndex: number = 0,numPoints: number = -1): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			gl.drawElements(gl.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
		}

		/**
         * [Webgl only]
         * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
         */
		public drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			gl.drawElements(gl.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
		}

		/**
         * [Webgl only]
         * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
         */
		public drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			gl.drawElements(
				gl.LINE_STRIP,
				numPoints < 0 ? indexBuffer.numIndices : numPoints,
				gl.UNSIGNED_SHORT,
				firstIndex * 2
			);
		}

		/**
        * [Webgl only]
        *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        */
		public drawTriangleStrip(indexBuffer: IndexBuffer3D): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
		}

		/**
         * [Webgl only]
         * creates triangles in a similar way to drawTriangleStrip(). 
         * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
         * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
         */
		public drawTriangleFan(indexBuffer: IndexBuffer3D): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			gl.drawElements(gl.TRIANGLE_FAN, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
		}

		/**
        *   In webgl we dont need to call present , browser will do this for us.
        */
		public present(): void { }

		// private enableTex(keyInCache): void {
		// 	var tex: Texture = this._texCache[keyInCache];
		// 	gl.activeTexture(gl['TEXTURE' + tex.textureUnit]);

		// 	gl.TEXTURE31\
		// 	var l: WebGLUniformLocation = gl.getUniformLocation(this._linkedProgram.program, keyInCache);
		// 	gl.uniform1i(l, tex.textureUnit); // TODO:multiple textures
		// }
	}


	/**
	 * todo
	 */
	export function webGLSimpleReport():Object{
		//http://webglreport.com/

		// Vertex Shader
		// Max Vertex Attributes:
		// Max Vertex Uniform Vectors:
		// Max Vertex Texture Image Units:
		// Max Varying Vectors:

		gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
		gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
		gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
		gl.getParameter(gl.MAX_VARYING_VECTORS);
		gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);



		// Fragment Shader
		// Max Fragment Uniform Vectors:
		// Max Texture Image Units:
		// float/int precision:highp/highp



		return {};
	}
}
