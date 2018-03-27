///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
module rf{

    
    export class Stage3D extends Sprite{

        static names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

        public canvas:HTMLCanvasElement;

        constructor(){
            super();
           
        }


        public requestContext3D(canvas:HTMLCanvasElement):boolean{
            this.canvas = canvas;
            
            for(var name of Stage3D.names){
                try {
                    GL = <WebGLRenderingContext> this.canvas.getContext(name);
                } catch (e) { 

                }
                if(GL){
                    break;
                }
            }

            if(undefined == GL){
                this.simpleDispatch(EventX.ERROR,"webgl is not available");
                return false;
            }

            this.simpleDispatch(EventX.CONTEXT3D_CREATE,GL);
            return true;
        }
    }
}