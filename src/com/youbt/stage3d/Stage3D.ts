///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
module rf{  

    export class AllActiveSprite extends Sprite{
        constructor(source?:BitmapSource,variables?:{ [key: string]: IVariable }){
            super(source,variables);
            this.hitArea.allWays = true;
        }
    }

    export let threeContainer;
    export let popContainer = new AllActiveSprite();
    export let tipContainer = new AllActiveSprite();
    export class Stage3D extends AllActiveSprite implements IResizeable{

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
            this.renderer = new BatchRenderer(this);
            this.mouse = new Mouse();
            this.camera = this.cameraUI;
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
            this.render(this.camera,now,interval);
        }
        
        public resize(width:number,height:number):void{
            this.camera2D.resize(width,height);
            this.camera3D.resize(width,height);
            this.cameraUI.resize(width,height);
        }



        initContainer(){
            let g = gl;
            let container = new PassContainer(vertex_mesh_variable);
            container.depthMask = true;
            container.passCompareMode = g.LEQUAL;
            container.sourceFactor = g.SRC_ALPHA
            container.destinationFactor = g.ONE_MINUS_CONSTANT_ALPHA;
            container.triangleFaceToCull = Context3DTriangleFace.NONE;
            this.addChild(container);
            threeContainer = container;

            let uiContainer = new UIContainer(undefined,vertex_ui_variable);
            uiContainer.renderer = new BatchRenderer(uiContainer);
            uiContainer.depthMask = false;
            uiContainer.passCompareMode = g.ALWAYS;
            uiContainer.sourceFactor = g.SRC_ALPHA;
            uiContainer.destinationFactor = g.ONE_MINUS_CONSTANT_ALPHA;
            uiContainer.triangleFaceToCull = Context3DTriangleFace.NONE;
            this.addChild(uiContainer);
            uiContainer.addChild(popContainer);
            uiContainer.addChild(tipContainer);
        }
    }

    export class PassContainer extends RenderBase{
        constructor(variables?:{ [key: string]: IVariable }){
            super(variables);
            this.hitArea = new HitArea();
            this.hitArea.allWays = true;
        }

        public render(camera: Camera, now: number, interval: number): void {
            const{camera3D}=ROOT;
            const{depthMask,passCompareMode,sourceFactor,destinationFactor,triangleFaceToCull}=this;
            let c = context3D;
            let g = gl;
           

            if(camera3D.states){
                camera3D.updateSceneTransform();
            }

            c.setCulling(triangleFaceToCull)
            c.setDepthTest(depthMask,passCompareMode);
            c.setBlendFactors(sourceFactor,destinationFactor);

            super.render(camera3D,now,interval);
        }
    }

    export class UIContainer extends AllActiveSprite{
        public render(camera: Camera, now: number, interval: number): void {
            const{cameraUI}=ROOT;
            const{depthMask,passCompareMode,sourceFactor,destinationFactor,triangleFaceToCull}=this;
            let c = context3D;
            let g = gl;
           
            if(cameraUI.states){
                cameraUI.updateSceneTransform();
            }

            c.setCulling(triangleFaceToCull)
            c.setDepthTest(depthMask,passCompareMode);
            c.setBlendFactors(sourceFactor,destinationFactor);

            super.render(cameraUI,now,interval);
        }
    }
}