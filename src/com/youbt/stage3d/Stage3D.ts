///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
module rf{  
    export class Stage3D extends Sprite implements IResizeable{

        static names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

        canvas:HTMLCanvasElement;

        cameraUI:CameraUI

        camera2D:CameraOrth;

        camera3D:Camera3D;

        camera:Camera;

        mouse:Mouse;

        constructor(){
            super();
            this.camera2D = new CameraOrth();
            this.camera3D = new Camera3D();
            this.cameraUI = new CameraUI();

            this.camera = this.cameraUI;

            this.renderer = new BatchRenderer(this);
            this.mouse = new Mouse();
            this.stage = this;

            this.hitArea.allWays = true;
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

            let c = this.camera;

            if(c.states){
                c.updateSceneTransform();
            }
            this.render(c,now,interval);
        }
        


        public resize(width:number,height:number):void{
            this.camera2D.resize(width,height);
            this.camera3D.resize(width,height);
            this.cameraUI.resize(width,height);
        }
    }
}