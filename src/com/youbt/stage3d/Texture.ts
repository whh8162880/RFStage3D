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
            this._glTexture = GL.createTexture();
            this._streamingLevels = streamingLevels;

            this._textureUnit = Texture.__texUnit ++;

            //rtt needs these properties
            this._width = width;
            this._height = height;
            this._format = format;
            this._forRTT = optimizeForRenderToTexture;

            if(this._forRTT)
            {

                GL.bindTexture(GL.TEXTURE_2D, this._glTexture);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
               // GL.generateMipmap(GL.TEXTURE_2D);

                GL.texImage2D(GL.TEXTURE_2D,
                    0,
                    GL.RGBA,
                    512,//this._width,
                    512,//this._height,
                    0,
                    GL.RGBA,
                    GL.UNSIGNED_BYTE,
                    null);

                if(Texture._bindingTexture)
                    GL.bindTexture(GL.TEXTURE_2D , Texture._bindingTexture);
                else
                    GL.bindTexture(GL.TEXTURE_2D, null);

                GL.bindRenderbuffer(GL.RENDERBUFFER, null);
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
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
            GL.activeTexture(GL["TEXTURE"+this.textureUnit]);
            GL.bindTexture(GL.TEXTURE_2D, this._glTexture);

            Texture._bindingTexture = this._glTexture;

            //TODO: set filter mode API
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER,GL.LINEAR  ); //GL.NEAREST
            if (this._streamingLevels == 0)
            {
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER,GL.LINEAR);// GL.NEAREST
            } else {
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR); //linnear生成mipmap,缩放也linear
                GL.generateMipmap(GL.TEXTURE_2D);
            }

            GL.texImage2D(GL.TEXTURE_2D,
                miplevel,
                GL.RGBA,
                GL.RGBA,
                GL.UNSIGNED_BYTE,
                source);

            if (!GL.isTexture(this._glTexture)) {
                throw new Error("Error:Texture is invalid");
            }
            //bind null 会不显示贴图 why?
            //GL.bindTexture(GL.TEXTURE_2D, null);
        }

        public dispose(): void
        {
            GL.bindTexture(GL.TEXTURE_2D, null);
            Texture._bindingTexture = null;
            GL.deleteTexture(this._glTexture);
            this._glTexture = null;
            this._streamingLevels = 0;
        }
    }
}