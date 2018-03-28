///<reference path="./Buffer3D.ts"/>
///<reference path="./Texture.ts"/>
///<reference path="./Program3D.ts"/>
namespace rf {
	export let context3D: Context3D;

	export class Context3DCompareMode {
		static ALWAYS: string = 'always';
		static EQUAL: string = 'equal';
		static GREATER: string = 'greater';
		static GREATER_EQUAL: string = 'greaterEqual';
		static LESS: string = 'less';
		static LESS_EQUAL: string = 'lessEqual';
		static NEVER: string = 'never';
		static NOT_EQUAL: string = 'notEqual';
	}

	export class Context3DTextureFormat {
		static BGRA: string = 'bgra';
	}

	export class Context3DBlendFactor {
		static ONE: number;
		static ZERO: number;

		static SOURCE_COLOR: number;
		static DESTINATION_COLOR: number;

		static SOURCE_ALPHA: number;
		static DESTINATION_ALPHA: number;

		static ONE_MINUS_SOURCE_COLOR: number;
		static ONE_MINUS_DESTINATION_COLOR: number;

		static ONE_MINUS_SOURCE_ALPHA: number;
		static ONE_MINUS_DESTINATION_ALPHA: number;

		static init(): void {
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

			//CONSTANT_COLOR
			//ONE_MINUS_CONSTANT_COLOR
			//ONE_MINUS_CONSTANT_ALPHA
		}
	}

	export class Context3DVertexBufferFormat {
		static BYTES_4: number = 4;
		static FLOAT_1: number = 1;
		static FLOAT_2: number = 2;
		static FLOAT_3: number = 3;
		static FLOAT_4: number = 4;
	}

	export class Context3DTriangleFace {
		static BACK: string = 'back'; //CCW
		static FRONT: string = 'front'; //CW
		static FRONT_AND_BACK: string = 'frontAndBack';
		static NONE: string = 'none';
	}

	export class Context3D {
		//todo:enableErrorChecking https://www.khronos.org/webgl/wiki/Debugging
		private _clearBit: number;
		private _bendDisabled: boolean = true;
		private _depthDisabled: boolean = true;
		constructor() {
			Context3DBlendFactor.init();
		}

		public configureBackBuffer(
			width: number,
			height: number,
			antiAlias: number,
			enableDepthAndStencil: boolean = true
		): void {
			GL.viewport(0, 0, width, height);
			GL.canvas.width = width;
			GL.canvas.height = height;
			this._depthDisabled = enableDepthAndStencil;
			//TODO: antiAlias , Stencil
			if (enableDepthAndStencil) {
				this._clearBit = GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT;
				GL.enable(GL.DEPTH_TEST);
				GL.enable(GL.STENCIL_TEST);
			} else {
				this._clearBit = GL.COLOR_BUFFER_BIT;
				GL.disable(GL.DEPTH_TEST);
				GL.disable(GL.STENCIL_TEST);
			}
		}

		public createVertexBuffer(numVertices: number, data32PerVertex: number): VertexBuffer3D {
			let buffer: VertexBuffer3D = recyclable(VertexBuffer3D);
			buffer.numVertices = numVertices;
			buffer.data32PerVertex = data32PerVertex;
			return buffer;
		}

		public createIndexBuffer(numIndices: number): IndexBuffer3D {
			return new IndexBuffer3D(numIndices);
		}

		/**
        * @format only support Context3DTextureFormat.BGRA
        * @optimizeForRenderToTexture not implement
        */
		public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels: number = 0): Texture {
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
				this._clearBit = GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT;
				GL.enable(GL.DEPTH_TEST);
				GL.enable(GL.STENCIL_TEST);
			} else {
				this._clearBit = GL.COLOR_BUFFER_BIT;
				GL.disable(GL.DEPTH_TEST);
				GL.disable(GL.STENCIL_TEST);
			}

			//TODO: antiAlias surfaceSelector colorOutputIndex
			if (!this._rttFramebuffer) {
				this._rttFramebuffer = GL.createFramebuffer();
				GL.bindFramebuffer(GL.FRAMEBUFFER, this._rttFramebuffer);

				var renderbuffer: WebGLRenderbuffer = GL.createRenderbuffer();
				GL.bindRenderbuffer(GL.RENDERBUFFER, renderbuffer);
				GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, 512, 512); //force 512

				GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, renderbuffer);
				GL.framebufferTexture2D(
					GL.FRAMEBUFFER,
					GL.COLOR_ATTACHMENT0,
					GL.TEXTURE_2D,
					texture.__getGLTexture(),
					0
				);
			}
			GL.bindFramebuffer(GL.FRAMEBUFFER, this._rttFramebuffer);
		}

		public setRenderToBackBuffer(): void {
			GL.bindFramebuffer(GL.FRAMEBUFFER, null);
		}

		public createProgram(): Program3D {
			return new Program3D();
		}

		/**
        *  @variable must predefined in glsl
        */
		public setVertexBufferAt(variable: string, buffer: VertexBuffer3D, bufferOffset: number = 0, format: number = 4): void {
			if (format <= 0 || format > 4) {
				ThrowError(`VertexBufferFormat[1-4]:${format}?`);
				return;
			}

			if(undefined == this._linkedProgram){
				throw new Error("mast set Program first");
			}

			var location: number = GL.getAttribLocation(this._linkedProgram.glProgram, variable);
			if (location < 0) {
				throw new Error('Fail to get the storage location of' + variable);
			}

			GL.bindBuffer(GL.ARRAY_BUFFER,buffer.buffer); // Bind the buffer object to a target
			GL.vertexAttribPointer(location,format, GL.FLOAT, false, buffer.data32PerVertex * 4, bufferOffset * 4);
			GL.enableVertexAttribArray(location);
		}

		/**
        *  @variable must predefined in glsl
        */
		public setProgramConstantsFromVector(variable: string, data: number[] /* Vector.<Number> */): void {
			if (data.length > 4) throw new Error('data length > 4');

			this._vcCache[variable] = data;
			if (this._linkedProgram) this.enableVC(variable);
		}

		/**
        *  @variable must predefined in glsl
        */
		public setProgramConstantsFromMatrix(
			variable: string,
			matrix: Matrix3D,
			transposedMatrix: boolean = false
		): void {
			if (transposedMatrix) matrix.transpose();

			this._vcMCache[variable] = matrix.rawData;
			if (this._linkedProgram) this.enableVCM(variable);
		}

		public setTextureAt(sampler: string, texture: Texture): void {
			this._texCache[sampler] = texture;

			if (this._linkedProgram) this.enableTex(sampler);
		}

		private _linkedProgram: Program3D = null;
		public setProgram(program: Program3D): void {
			if (program == null || program == this._linkedProgram) return;

			this._linkedProgram = program;

			GL.useProgram(program.glProgram);

			var k: string;
			for (k in this._vaCache) this.enableVA(k);

			for (k in this._vcCache) this.enableVC(k);

			for (k in this._vcMCache) this.enableVCM(k);

			for (k in this._texCache) this.enableTex(k);
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
			GL.clearColor(red, green, blue, alpha);
			GL.clearDepth(depth); // TODO:dont need to call this every time
			GL.clearStencil(stencil); //stencil buffer

			GL.clear(this._clearBit);
		}

		public setCulling(triangleFaceToCull: string): void {
			GL.frontFace(GL.CW);
			switch (triangleFaceToCull) {
				case Context3DTriangleFace.NONE:
					GL.disable(GL.CULL_FACE);
					break;
				case Context3DTriangleFace.BACK:
					GL.enable(GL.CULL_FACE);
					GL.cullFace(GL.BACK);
					break;
				case Context3DTriangleFace.FRONT:
					GL.enable(GL.CULL_FACE);
					GL.cullFace(GL.FRONT);
					break;
				case Context3DTriangleFace.FRONT_AND_BACK:
					GL.enable(GL.CULL_FACE);
					GL.cullFace(GL.FRONT_AND_BACK);
					break;
			}
		}

		public setDepthTest(depthMask: boolean, passCompareMode: string): void {
			if (this._depthDisabled) {
				GL.enable(GL.DEPTH_TEST);
				this._depthDisabled = false;
			}

			GL.depthMask(depthMask);

			switch (passCompareMode) {
				case Context3DCompareMode.LESS:
					GL.depthFunc(GL.LESS); //default
					break;
				case Context3DCompareMode.NEVER:
					GL.depthFunc(GL.NEVER);
					break;
				case Context3DCompareMode.EQUAL:
					GL.depthFunc(GL.EQUAL);
					break;
				case Context3DCompareMode.GREATER:
					GL.depthFunc(GL.GREATER);
					break;
				case Context3DCompareMode.NOT_EQUAL:
					GL.depthFunc(GL.NOTEQUAL);
					break;
				case Context3DCompareMode.ALWAYS:
					GL.depthFunc(GL.ALWAYS);
					break;
				case Context3DCompareMode.LESS_EQUAL:
					GL.depthFunc(GL.LEQUAL);
					break;
				case Context3DCompareMode.GREATER_EQUAL:
					GL.depthFunc(GL.GEQUAL);
					break;
			}
		}

		public setBlendFactors(sourceFactor: number, destinationFactor: number): void {
			if (this._bendDisabled) {
				GL.enable(GL.BLEND); //stage3d cant disable blend?
				this._bendDisabled = false;
			}
			GL.blendFunc(sourceFactor, destinationFactor);
		}

		public drawTriangles(
			indexBuffer: IndexBuffer3D,
			firstIndex: number = 0,
			numTriangles: number = -1
		): void {
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
			GL.drawElements(
				GL.TRIANGLES,
				numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3,
				GL.UNSIGNED_SHORT,
				firstIndex * 2
			);
		}

		/*
         *  [Webgl only]
         *   For instance indices = [1,3,0,4,1,2]; will draw 3 lines :
         *   from vertex number 1 to vertex number 3, from vertex number 0 to vertex number 4, from vertex number 1 to vertex number 2
         */
		public drawLines(
			indexBuffer: IndexBuffer3D,
			firstIndex: number = 0,
			numLines: number = -1
		): void {
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
			GL.drawElements(
				GL.LINES,
				numLines < 0 ? indexBuffer.numIndices : numLines * 2,
				GL.UNSIGNED_SHORT,
				firstIndex * 2
			);
		}

		/*
         * [Webgl only]
         *  For instance indices = [1,2,3] ; will only render vertices number 1, number 2, and number 3 
         */
		public drawPoints(
			indexBuffer: IndexBuffer3D,
			firstIndex: number = 0,
			numPoints: number = -1
		): void {
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
			GL.drawElements(
				GL.POINTS,
				numPoints < 0 ? indexBuffer.numIndices : numPoints,
				GL.UNSIGNED_SHORT,
				firstIndex * 2
			);
		}

		/**
         * [Webgl only]
         * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
         */
		public drawLineLoop(
			indexBuffer: IndexBuffer3D,
			firstIndex: number = 0,
			numPoints: number = -1
		): void {
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
			GL.drawElements(
				GL.LINE_LOOP,
				numPoints < 0 ? indexBuffer.numIndices : numPoints,
				GL.UNSIGNED_SHORT,
				firstIndex * 2
			);
		}

		/**
         * [Webgl only]
         * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
         */
		public drawLineStrip(
			indexBuffer: IndexBuffer3D,
			firstIndex: number = 0,
			numPoints: number = -1
		): void {
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
			GL.drawElements(
				GL.LINE_STRIP,
				numPoints < 0 ? indexBuffer.numIndices : numPoints,
				GL.UNSIGNED_SHORT,
				firstIndex * 2
			);
		}

		/**
        * [Webgl only]
        *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        */
		public drawTriangleStrip(indexBuffer: IndexBuffer3D): void {
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
			GL.drawElements(GL.TRIANGLE_STRIP, indexBuffer.numIndices, GL.UNSIGNED_SHORT, 0);
		}

		/**
         * [Webgl only]
         * creates triangles in a similar way to drawTriangleStrip(). 
         * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
         * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
         */
		public drawTriangleFan(indexBuffer: IndexBuffer3D): void {
			GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
			GL.drawElements(GL.TRIANGLE_FAN, indexBuffer.numIndices, GL.UNSIGNED_SHORT, 0);
		}

		/**
        *   In webgl we dont need to call present , browser will do this for us.
        */
		public present(): void { }

		private _vaCache: {} = {};
		private enableVA(keyInCache: string): void {
			var location: number = GL.getAttribLocation(this._linkedProgram.glProgram, keyInCache);
			if (location < 0) {
				throw new Error('Fail to get the storage location of' + keyInCache);
			}
			var va: { size: number; buffer: WebGLBuffer; stride: number; offset: number } = this._vaCache[keyInCache];

			GL.bindBuffer(GL.ARRAY_BUFFER, va.buffer); // Bind the buffer object to a target
			GL.vertexAttribPointer(location, va.size, GL.FLOAT, false, va.stride, va.offset);
			GL.enableVertexAttribArray(location);
			// GL.bindBuffer(GL.ARRAY_BUFFER, null);
		}

		private _vcCache: {} = {}; // {variable:array}
		private enableVC(keyInCache: string): void {
			var index: WebGLUniformLocation = GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
			if (!index) throw new Error('Fail to get uniform ' + keyInCache);

			var vc: number[] = this._vcCache[keyInCache];
			GL['uniform' + vc.length + 'fv'](index, vc);
		}

		private _vcMCache: {} = {};
		private enableVCM(keyInCache: string): void {
			var index: WebGLUniformLocation = GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
			if (!index) throw new Error('Fail to get uniform ' + keyInCache);

			GL.uniformMatrix4fv(index, false, this._vcMCache[keyInCache]); // bug:the second parameter must be false
		}

		private _texCache: {} = {}; //{sampler:Texture}
		private enableTex(keyInCache): void {
			var tex: Texture = this._texCache[keyInCache];
			GL.activeTexture(GL['TEXTURE' + tex.textureUnit]);
			var l: WebGLUniformLocation = GL.getUniformLocation(this._linkedProgram.glProgram, keyInCache);
			GL.uniform1i(l, tex.textureUnit); // TODO:multiple textures
		}
	}
}
