///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
module rf{  
    export class Stage3D extends Sprite implements IResizeable{

        static names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

        canvas:HTMLCanvasElement;

        camera2D:Camera2D;

        mouse:Mouse

        constructor(){
            super();
            this.camera2D = new Camera2D();
            this.renderer = new BatchRenderer(this);
            this.mouse = new Mouse();
            this.stage = this;
        }

        public requestContext3D(canvas:HTMLCanvasElement):boolean{
            this.canvas = canvas;
            for(var name of Stage3D.names){
                try {
                    gl = <WebGLRenderingContext> this.canvas.getContext(name);
                } catch (e) { 

                }
                if(gl){
                    break;
                }
            }
            
            if(undefined == gl){
                context3D = null;
                this.simpleDispatch(EventT.ERROR,"webgl is not available");
                return false;
            }

            context3D = singleton(Context3D);

            canvas.addEventListener('webglcontextlost',this.webglContextLostHandler);
            canvas.addEventListener("webglcontextrestored",this.webglContextRestoredHandler);
            this.mouse.init();
            this.simpleDispatch(EventT.CONTEXT3D_CREATE,gl);
            return true;
        }

        private webglContextLostHandler(e):void{
            console.log("Lost:"+e);
        }

        private webglContextRestoredHandler(e):void{
            console.log("RestoredHandler:"+e);
        }


        //在这里驱动渲染
        public update(now:number,interval:number):void{
            if(this.states & DChange.ct){
                this.updateTransform();
            }
            context3D.clear(0,0,0,1);
            context3D.setBlendFactors(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

            if(this.camera2D.states){
                this.camera2D.updateSceneTransform();
            }

            this.render(this.camera2D,now,interval);
        }
        


        public resize(width:number,height:number):void{
            this.camera2D.resize(width,height);
        }
    }
}