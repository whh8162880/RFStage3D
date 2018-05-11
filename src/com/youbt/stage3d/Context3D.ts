///<reference path="./Buffer3D.ts"/>
namespace rf {
	export let context3D: Context3D;

	// export const enum Context3DCompareMode {
	// 	ALWAYS = 'always',
	// 	EQUAL = 'equal',
	// 	GREATER = 'greater',
	// 	GREATER_EQUAL = 'greaterEqual',
	// 	LESS = 'less',
	// 	LESS_EQUAL = 'lessEqual',
	// 	NEVER = 'never',
	// 	NOT_EQUAL = 'notEqual'
	// }

	export const enum Context3DTextureFormat {
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

	export const enum Context3DVertexBufferFormat {
		BYTES_4 = 4,
		FLOAT_1 = 1,
		FLOAT_2 = 2,
		FLOAT_3 = 3,
		FLOAT_4 = 4
	}

	// export const enum Context3DTriangleFace {
	// 	BACK = 'back', //CCW
	// 	FRONT = 'front', //CW
	// 	FRONT_AND_BACK = 'frontAndBack',
	// 	NONE = 'none'
	// }

	export class Context3D {
		//todo:enableErrorChecking https://www.khronos.org/webgl/wiki/Debugging

		bufferLink:Link;
		triangles:number;
		dc:number;

		private _clearBit: number;
		
		constructor() {
			this.bufferLink = new Link();
			// ROOT.on(EngineEvent.FPS_CHANGE,this.gc,this)
		}

		public configureBackBuffer(width: number,height: number,antiAlias: number,enableDepthAndStencil: boolean = true): void {
			let g = gl;
			g.viewport(0, 0, width, height);
			g.canvas.width = width;
			g.canvas.height = height;
			//TODO: antiAlias , Stencil
			if (enableDepthAndStencil) {
				this._clearBit = g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT | g.STENCIL_BUFFER_BIT;
				g.enable(g.DEPTH_TEST);
				g.enable(g.STENCIL_TEST);
			} else {
				this._clearBit = g.COLOR_BUFFER_BIT;
				g.disable(g.DEPTH_TEST);
				g.disable(g.STENCIL_TEST);
			}
		}

		
		public clear(red: number = 0.0,green: number = 0.0,blue: number = 0.0,alpha: number = 1.0,depth: number = 1.0,stencil: number /*uint*/ = 0,	mask: number /* uint */ = 0xffffffff): void {
			let g = gl;
			g.clearColor(red, green, blue, alpha);
			g.clearDepth(depth); // TODO:dont need to call this every time
			g.clearStencil(stencil); //stencil buffer
			g.clear(this._clearBit);
		}

		triangleFaceToCull:number;

		public setCulling(triangleFaceToCull: number): void {
			if(this.triangleFaceToCull == triangleFaceToCull){
				return;
			}
			this.triangleFaceToCull = triangleFaceToCull;
			let g = gl
			g.frontFace(g.CW);

			if(triangleFaceToCull == 0){
				g.disable(g.CULL_FACE);
			}else{
				g.enable(g.CULL_FACE);
				g.cullFace(triangleFaceToCull);
			}

			// switch (triangleFaceToCull) {
			// 	case Context3DTriangleFace.NONE:
			// 		g.disable(g.CULL_FACE);
			// 		break;
			// 	case Context3DTriangleFace.BACK:
			// 		g.enable(g.CULL_FACE);
			// 		g.cullFace(g.BACK);
			// 		break;
			// 	case Context3DTriangleFace.FRONT:
			// 		g.enable(g.CULL_FACE);
			// 		g.cullFace(g.FRONT);
			// 		break;
			// 	case Context3DTriangleFace.FRONT_AND_BACK:
			// 		g.enable(g.CULL_FACE);
			// 		g.cullFace(g.FRONT_AND_BACK);
			// 		break;
			// }
		}

		/**
		 * 
		 * @param depthMask 
		 * @param passCompareMode 
		 * 
		 * 
		 * @constant Context3DCompareMode.LESS=GL.LESS
		 * @constant Context3DCompareMode.NEVER=GL.NEVER
		 * @constant Context3DCompareMode.EQUAL=GL.EQUAL
		 * @constant Context3DCompareMode.GREATER=GL.GREATER
		 * @constant Context3DCompareMode.NOT_EQUAL=GL.NOTEQUAL
		 * @constant Context3DCompareMode.ALWAYS=GL.ALWAYS
		 * @constant Context3DCompareMode.LESS_EQUAL=GL.LEQUAL
		 * @constant Context3DCompareMode.GREATER_EQUAL=L.GEQUAL
		 */
		depthMask:boolean;
		passCompareMode:number;
		public setDepthTest(depthMask: boolean, passCompareMode: number): void {

			if(this.depthMask == depthMask && this.passCompareMode == passCompareMode){
				return;
			}
			this.depthMask = depthMask;
			this.passCompareMode = passCompareMode;

			let g = gl;
			g.enable(g.DEPTH_TEST);
			g.depthMask(depthMask);
			g.depthFunc(passCompareMode);
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
		sourceFactor:number;
		destinationFactor:number;
		public setBlendFactors(sourceFactor: number, destinationFactor: number): void {
			if(this.sourceFactor == sourceFactor && this.destinationFactor == destinationFactor){
				return;
			}
			this.sourceFactor = sourceFactor;
			this.destinationFactor = destinationFactor;
			let g = gl;
			g.enable(g.BLEND); //stage3d cant disable blend?
			g.blendFunc(sourceFactor, destinationFactor);
		}

		public createVertexBuffer(data: number[] | Float32Array | VertexInfo, data32PerVertex: number = -1, startVertex: number = 0, numVertices: number = -1): VertexBuffer3D {
			let buffer: VertexBuffer3D = recyclable(VertexBuffer3D);
			if(data instanceof VertexInfo){
				buffer.data32PerVertex = data.data32PerVertex;
			}else{
				if(data32PerVertex == -1){
					ThrowError("mast set data32PerVertex")
					return null;
				}
				buffer.data32PerVertex = data32PerVertex;
			}
			buffer.uploadFromVector(data, startVertex, numVertices);
			return buffer;
		}

		// private indexs: { [key: number]: IndexBuffer3D };
		indexByte:IndexBuffer3D;

		public getIndexByQuad(quadCount: number): IndexBuffer3D {
			let count = 1000;
			if (quadCount > count) {
				ThrowError("你要这么多四边形干嘛？");
				return null;
			}

			// if (undefined == this.indexs) {
			// 	this.indexs = {};
			// }
			// let buffer = this.indexs[quadCount];
			// let length = quadCount * 6;
			// if (undefined == buffer) {

				// let array = new Uint16Array(length)

			if (undefined == this.indexByte) {
				let byte = new Uint16Array(count * 6);
				count *= 4;
				let j = 0;
				for (var i: number = 0; i < count; i += 4) {
					byte[j++] = i;
					byte[j++] = i + 1;
					byte[j++] = i + 3;
					byte[j++] = i + 1;
					byte[j++] = i + 2;
					byte[j++] = i + 3;
				}
				this.indexByte = this.createIndexBuffer(byte);
			}

			return this.indexByte;
				// array.set(this.indexByte.slice(0, length));
				// this.indexs[quadCount] = buffer = this.createIndexBuffer(array);
			// }
			// return buffer;
		}

		public createIndexBuffer(data: number[] | Uint16Array | ArrayBuffer): IndexBuffer3D {
			let buffer = recyclable(IndexBuffer3D);
			if(data instanceof ArrayBuffer){
				buffer.uploadFromVector(new Uint16Array(data));
			}else{
				buffer.uploadFromVector(data);
			}
			return buffer
		}

		public getTextureData(url:string,mipmap?:boolean,mag?:number,mix?:number,repeat?:number,y?:boolean){
			let data = {} as ITextureData;
			data.url = url;
			data.mipmap = undefined != mipmap ? mipmap : false;
			data.mag = undefined != mag ? mag : WebGLConst.NEAREST;
			data.mix = undefined != mix ? mix : WebGLConst.NEAREST;
			data.repeat = undefined != repeat ? repeat : WebGLConst.CLAMP_TO_EDGE;
			return data;
		}



		public textureObj:{[key:string]:Texture} = {};

		public createTexture(key:ITextureData,pixels?: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | BitmapData): Texture {
			let texture = recyclable(Texture);
			texture.key = key.key ? key.key : (key.key = `${key.url}_${key.mipmap}_${key.mag}_${key.mix}_${key.repeat}`);
			texture.data = key;
			texture.pixels = pixels;
			
			if(pixels){
				texture.width = pixels.width;
				texture.height = pixels.height;
			}
			
			this.textureObj[key.key] = texture;
			return texture;
		}

		public createEmptyTexture(key:ITextureData,width: number, height: number): Texture {
			let texture = recyclable(Texture);
			texture.key = key.key ? key.key : (key.key = `${key.url}_${key.mipmap}_${key.mag}_${key.mix}_${key.repeat}`);
			texture.data = key;
			texture.width = width;
			texture.height = height;
			this.textureObj[key.key] = texture;
			return texture;
		}


		public createRttTexture(key:ITextureData,width: number, height: number): RTTexture {
			let texture = new RTTexture();
			texture.key = key.key ? key.key : (key.key = `${key.url}_${key.mipmap}_${key.mag}_${key.mix}_${key.repeat}`);
			texture.data = key;
			texture.width = width;
			texture.height = height;
			this.textureObj[key.key] = texture;
			return texture;
		}


		public setRenderToTexture(texture:RTTexture,enableDepthAndStencil: boolean = true,antiAlias: number = 0,surfaceSelector: number /*int*/ = 0,colorOutputIndex: number /*int*/ = 0){
			let g = gl;

			if(!texture.readly){
				if(false == texture.awaken()){
					return;
				}
			}


			let{frameBuffer,renderBuffer,texture:textureObj,width,height} = texture;
			g.bindFramebuffer(g.FRAMEBUFFER,frameBuffer);

			// if(frameBuffer){
			// 	g.deleteFramebuffer(frameBuffer);
			// }

			// width = stageWidth;
			// height = stageHeight;

			// width = height = 512;

			// // this.configureBackBuffer(width,height,0,true);

			// g.bindTexture(g.TEXTURE_2D,textureObj);
			// g.texImage2D(g.TEXTURE_2D,0,g.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,undefined);

			// texture.frameBuffer = frameBuffer = g.createFramebuffer();
			// g.bindFramebuffer(g.FRAMEBUFFER,frameBuffer);

			// if(renderBuffer){
			// 	g.deleteRenderbuffer(renderBuffer);
			// }
			// texture.renderBuffer = renderBuffer = g.createRenderbuffer();

			// g.bindRenderbuffer(g.RENDERBUFFER,renderBuffer);
			// g.renderbufferStorage(g.RENDERBUFFER,g.DEPTH_COMPONENT16,width,height);
			// g.framebufferRenderbuffer(g.FRAMEBUFFER,g.DEPTH_ATTACHMENT,g.RENDERBUFFER,renderBuffer);
			
			// g.framebufferTexture2D(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.TEXTURE_2D,textureObj,0);


			// this.configureBackBuffer(stageWidth,stageHeight,0,true);

			// g.bindRenderbuffer(g.RENDERBUFFER,undefined);
			// g.bindFramebuffer(g.FRAMEBUFFER,undefined);
			// g.bindFramebuffer(g.FRAMEBUFFER, texture.frameBuffer);

			// let{renderBuffer}=texture;
			// if(renderBuffer){
			// 	g.deleteRenderbuffer(renderBuffer);
			// }
			// texture.renderBuffer = renderBuffer = g.createRenderbuffer();
			// g.bindRenderbuffer(g.RENDERBUFFER,renderBuffer);
			// g.renderbufferStorage(g.RENDERBUFFER,g.DEPTH_COMPONENT16,256,256);
			// g.framebufferRenderbuffer(g.FRAMEBUFFER,g.DEPTH_ATTACHMENT,g.RENDERBUFFER,renderBuffer);
			// g.framebufferTexture2D(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.TEXTURE_2D,texture.texture,0);
			// g.bindRenderbuffer(g.RENDERBUFFER,undefined);

			if (enableDepthAndStencil) {
				texture.cleanBit = g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT | g.STENCIL_BUFFER_BIT;
				g.enable(g.DEPTH_TEST);
				g.enable(g.STENCIL_TEST);
			} else {
				texture.cleanBit = g.COLOR_BUFFER_BIT;
				g.disable(g.DEPTH_TEST);
				g.disable(g.STENCIL_TEST);
			}

			g.clearColor(0,0,0,1);
			g.clearDepth(1.0);
			g.clearStencil(0.0)
			g.clear(texture.cleanBit);
			//TODO: antiAlias surfaceSelector colorOutputIndex
		}

		public setRenderToBackBuffer(): void {
			let g = gl;
			g.bindFramebuffer(g.FRAMEBUFFER, null);
		}

		programs: { [key: string]: Recyclable<Program3D> } = {};

		public createProgram(vertexCode: string, fragmentCode: string, key?: string): Recyclable<Program3D> {
			var program: Recyclable<Program3D>
			if (undefined != key) {
				program = this.programs[key];
				if (undefined == program) {
					this.programs[key] = program = recyclable(Program3D);
				}
			} else {
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
		public setProgramConstantsFromVector(variable: string, data: number | number[] | Float32Array, format: number,array:boolean = true): void {
			let p = this.cProgram;
			let uniforms = p.uniforms;
			let g = gl;
			var index;
			if(true == (variable in uniforms)){
				index = uniforms[variable];
			}else{
				index = g.getUniformLocation(p.program, variable);
				uniforms[variable] = index;
			}

			if (undefined != index) {
				if(array){
					gl['uniform' + format + 'fv'](index, data);
				}else{
					gl['uniform' + format + 'f'](index, data);
				}
				
			}
		}

		/**
        *  @variable must predefined in glsl
        */
		public setProgramConstantsFromMatrix(variable: string, rawData: ArrayLike<number>): void {
			let p = this.cProgram;
			let uniforms = p.uniforms;
			let g = gl;
			var index;
			if(true == (variable in uniforms)){
				index = uniforms[variable];
			}else{
				index = g.getUniformLocation(p.program, variable);
				uniforms[variable] = index;
			}
			if (undefined != index) {
				g.uniformMatrix4fv(index, false, rawData as Float32Array);
			}
		}

		private cProgram: Program3D = undefined;
		public setProgram(program: Program3D): void {
			if (program == undefined) return 

			program.preusetime = engineNow;

			if (false == program.readly) {
				if (false == program.awaken()) {
					ThrowError("program create error!");
					return;
				}
			}else{
				if(program == this.cProgram) return;
			}

			this.cProgram = program;
			gl.useProgram(program.program);
		}


		public drawTriangles(indexBuffer: IndexBuffer3D, numTriangles:number,firstIndex: number = 0): void {
			let g = gl;
			if(undefined != indexBuffer){
				if (false == indexBuffer.readly) {
					if (false == indexBuffer.awaken()) {
						throw new Error("create indexBuffer error!");
					}
				}
				indexBuffer.preusetime = engineNow;
				// g.drawArrays(g.TRIANGLES,0,numTriangles)
				g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
				g.drawElements(g.TRIANGLES, numTriangles * 3, g.UNSIGNED_SHORT, firstIndex * 2);
			}else{
				g.drawArrays(g.TRIANGLES,0,numTriangles * 3);
			}
			
			this.triangles += numTriangles;
			this.dc ++;
		}


		/*
         *  [Webgl only]
         *   For instance indices = [1,3,0,4,1,2]; will draw 3 lines :
         *   from vertex number 1 to vertex number 3, from vertex number 0 to vertex number 4, from vertex number 1 to vertex number 2
         */
		public drawLines(indexBuffer: IndexBuffer3D, numTriangles:number, firstIndex: number = 0, numLines: number = -1): void {
			if (false == indexBuffer.readly) {
				if (false == indexBuffer.awaken()) {
					throw new Error("create indexBuffer error!");
				}
			}
			indexBuffer.preusetime = engineNow;
			let g = gl;
			g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
			g.drawElements(g.LINES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, g.UNSIGNED_SHORT, firstIndex * 2);

			this.triangles += numTriangles;
			this.dc ++;
		}



		// /*
        //  * [Webgl only]
        //  *  For instance indices = [1,2,3] ; will only render vertices number 1, number 2, and number 3 
        //  */
		// public drawPoints(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
		// 	if (false == indexBuffer.readly) {
		// 		if (false == indexBuffer.awaken()) {
		// 			throw new Error("create indexBuffer error!");
		// 		}
		// 	}
		// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
		// 	gl.drawElements(gl.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
		// }

		// /**
        //  * [Webgl only]
        //  * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
        //  */
		// public drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
		// 	if (false == indexBuffer.readly) {
		// 		if (false == indexBuffer.awaken()) {
		// 			throw new Error("create indexBuffer error!");
		// 		}
		// 	}
		// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
		// 	gl.drawElements(gl.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
		// }

		// /**
        //  * [Webgl only]
        //  * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
        //  */
		// public drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
		// 	if (false == indexBuffer.readly) {
		// 		if (false == indexBuffer.awaken()) {
		// 			throw new Error("create indexBuffer error!");
		// 		}
		// 	}
		// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
		// 	gl.drawElements(
		// 		gl.LINE_STRIP,
		// 		numPoints < 0 ? indexBuffer.numIndices : numPoints,
		// 		gl.UNSIGNED_SHORT,
		// 		firstIndex * 2
		// 	);
		// }

		// /**
        // * [Webgl only]
        // *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        // */
		// public drawTriangleStrip(indexBuffer: IndexBuffer3D): void {
		// 	if (false == indexBuffer.readly) {
		// 		if (false == indexBuffer.awaken()) {
		// 			throw new Error("create indexBuffer error!");
		// 		}
		// 	}
		// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
		// 	gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
		// }

		// /**
        //  * [Webgl only]
        //  * creates triangles in a similar way to drawTriangleStrip(). 
        //  * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
        //  * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
        //  */
		// public drawTriangleFan(indexBuffer: IndexBuffer3D): void {
		// 	if (false == indexBuffer.readly) {
		// 		if (false == indexBuffer.awaken()) {
		// 			throw new Error("create indexBuffer error!");
		// 		}
		// 	}
		// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
		// 	gl.drawElements(gl.TRIANGLE_FAN, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
		// }

		/**
        *   In webgl we dont need to call present , browser will do this for us.
        */
		// public present(): void { }

		// private enableTex(keyInCache): void {
		// 	var tex: Texture = this._texCache[keyInCache];
		// 	gl.activeTexture(gl['TEXTURE' + tex.textureUnit]);

		// 	gl.TEXTURE31\
		// 	var l: WebGLUniformLocation = gl.getUniformLocation(this._linkedProgram.program, keyInCache);
		// 	gl.uniform1i(l, tex.textureUnit); // TODO:multiple textures
		// }

		gc(now:number):void{
			let link = this.bufferLink;
			let vo = link.getFrist();
			var hasChange = false
			while(vo){
				if(false == vo.close){
					let buffer:Recyclable<Buffer3D> = vo.data;
					if(now - buffer.preusetime > 3000){
						buffer.recycle();
						vo.close = true;
						hasChange = true;
					}
				}
				vo = vo.next;
			}
			if(hasChange) link.clean();
		}


		toString():string{
			let link = this.bufferLink;
			let vo = link.getFrist();
			let v=0,t=0,p=0,i=0;
			while(vo){
				if(false == vo.close){
					let buffer:Recyclable<Buffer3D> = vo.data;
					if(buffer instanceof VertexBuffer3D){
						v ++;
					}else if(buffer instanceof IndexBuffer3D){
						i ++;
					}else if(buffer instanceof Texture){
						t ++;
					}else if(buffer instanceof Program3D){
						p ++;
					}
				}
				vo = vo.next;
			}
			return `p:${p} i:${i} v:${v} t:${t}`;
		}
	}


	/**
	 * todo
	 */
	export function webGLSimpleReport(): Object {
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
