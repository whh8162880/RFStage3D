///<reference path="../core/Config.ts"/>
module rf
{
    export class Program3D {

        private _glProgram:WebGLProgram;

        private _vShader: WebGLShader;
        private _fShader: WebGLShader;

        constructor()
        {
            this._glProgram = GL.createProgram();
        }
 

        get glProgram(): WebGLProgram
        {
            return this._glProgram;
        }

        public dispose(): void
        {
            if (this._vShader)
            {
                GL.detachShader(this._glProgram, this._vShader);
                GL.deleteShader(this._vShader);
                this._vShader = null;
            }

            if (this._fShader)
            {
                GL.detachShader(this._glProgram, this._fShader);
                GL.deleteShader(this._fShader);
                this._fShader = null;
            }
            GL.deleteProgram(this._glProgram);
            this._glProgram = null;
        }


        public upload(vertexProgramId: string = "shader-vs", fragmentProgramId: string = "shader-fs"): void
        {
            this._vShader = this.loadShader(vertexProgramId, GL.VERTEX_SHADER);
            this._fShader = this.loadShader(fragmentProgramId, GL.FRAGMENT_SHADER);

            if (!this._fShader || !this._vShader)
                throw new Error("loadShader error");

            GL.attachShader(this._glProgram, this._vShader);
            GL.attachShader(this._glProgram, this._fShader);

            GL.linkProgram(this._glProgram);

            if (!GL.getProgramParameter(this._glProgram, GL.LINK_STATUS))
            {
                this.dispose();
                throw new Error(GL.getProgramInfoLog(this._glProgram));
            }

        }

        /*
         * load shader from html file by document.getElementById
         */
        private loadShader(elementId: string, type: number): WebGLShader {
            var script: HTMLObjectElement = <HTMLObjectElement>document.getElementById(elementId);
            if (!script)
                throw new Error("cant find elementId: " + elementId);
            var shader: WebGLShader = GL.createShader(type);
            GL.shaderSource(shader, script.innerHTML);
            GL.compileShader(shader);
            // Check the result of compilation
            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS))
            {
                GL.deleteShader(shader);
                throw new Error(GL.getShaderInfoLog(shader));
            }
            return shader;
        }

        /**
        *   delete .......
        */
//        public getShader2(elementId: string): WebGLShader {
//            var script: HTMLObjectElement = <HTMLObjectElement>document.getElementById(elementId);
//            if (!script)
//                return null;
//
//            var str = "";
//            var k = script.firstChild;
//            while (k) {
//                if (k.nodeType == 3) {
//                    str += k.textContent;
//                }
//                k = k.nextSibling;
//            }
//
//            var shader: WebGLShader;
//            if (script.type == "x-shader/x-fragment") {
//                shader = GL.createShader(GL.FRAGMENT_SHADER);
//            } else if (script.type == "x-shader/x-vertex") {
//                shader = GL.createShader(GL.VERTEX_SHADER);
//            } else {
//                return null;
//            }
//            GL.shaderSource(shader, str);
//            GL.compileShader(shader);
//
//            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
//                console.log("error getShader() :" + GL.getShaderInfoLog(shader));
//                return null;
//            }
//            return shader;
//        }

    }
} 