///<reference path="../core/BitmapData.ts" />
module rf
{
    //TODO:cube texture
    export class Texture
    {

        private _glTexture: WebGLTexture;
        private _streamingLevels: number;
        private _width:number;
        private _height:number;
        private _format:string;
        private _forRTT:boolean;

        private static _bindingTexture:WebGLTexture;
        private static __texUnit:number = 0;

        private _textureUnit:number;

        constructor(width:number,height:number,format:string,optimizeForRenderToTexture:boolean,streamingLevels:number)
        {
            this._glTexture = gl.createTexture();
            this._streamingLevels = streamingLevels;

            this._textureUnit = Texture.__texUnit ++;

            //rtt needs these properties
            this._width = width;
            this._height = height;
            this._format = format;
            this._forRTT = optimizeForRenderToTexture;

            if(this._forRTT)
            {

                gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
               // GL.generateMipmap(GL.TEXTURE_2D);

                gl.texImage2D(gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    512,//this._width,
                    512,//this._height,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    null);

                if(Texture._bindingTexture)
                    gl.bindTexture(gl.TEXTURE_2D , Texture._bindingTexture);
                else
                    gl.bindTexture(gl.TEXTURE_2D, null);

                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
        }

        public __getGLTexture():WebGLTexture
        {
            return this._glTexture;
        }

        public get textureUnit():number
        {
            return this._textureUnit;
        }

        public uploadFromBitmapData(source:BitmapData, miplevel?: number): void;
        public uploadFromBitmapData(source:HTMLImageElement, miplevel?: number): void;
        public uploadFromBitmapData(source:any, miplevel: number /* uint */ = 0): void
        {
            if(this._forRTT)
                console.error("rtt texture");
            if(source instanceof BitmapData)
            {
                this.uploadFromImage(source.imageData,miplevel);
            }else
            {
                this.uploadFromImage(source, miplevel);
            }
        }

        public uploadFromImage(source: any, miplevel: number /* uint */ = 0): void
        {
            //GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, 1); //uv原点在左下角，v朝上时时才需翻转
            //GL.pixelStorei(GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            gl.activeTexture(gl["TEXTURE"+this.textureUnit]);
            gl.bindTexture(gl.TEXTURE_2D, this._glTexture);

            Texture._bindingTexture = this._glTexture;

            //TODO: set filter mode API
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR  ); //GL.NEAREST
            if (this._streamingLevels == 0)
            {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR);// GL.NEAREST
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); //linnear生成mipmap,缩放也linear
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            gl.texImage2D(gl.TEXTURE_2D,miplevel,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);

            if (!gl.isTexture(this._glTexture)) {
                throw new Error("Error:Texture is invalid");
            }
            //bind null 会不显示贴图 why?
            //GL.bindTexture(GL.TEXTURE_2D, null);
        }

        public dispose(): void
        {
            gl.bindTexture(gl.TEXTURE_2D, null);
            Texture._bindingTexture = null;
            gl.deleteTexture(this._glTexture);
            this._glTexture = null;
            this._streamingLevels = 0;
        }
    }
}