///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
module rf{  

    export class SceneObject extends RenderBase{
        scene:Scene

        addChild(child:DisplayObject){
            super.addChild(child);
            if(child instanceof Mesh){
                child.scene = this.scene;
            }
        }


        addChildAt(child:DisplayObject,index:number){
            super.addChildAt(child,index);
            if(child instanceof Mesh){
                child.scene = this.scene;
            }
        }
        
        removeChild(child:DisplayObject){
			if(undefined == child){
				return;
            }
            super.removeChild(child);
            if(child instanceof Mesh){
                child.scene = null;
            }
		}


        removeAllChild(){
            const{childrens} = this;
            let len = childrens.length;
            for(let i=0;i<len;i++){
                let child = childrens[i];
                child.stage = undefined;
                child.parent = undefined;
                if(child instanceof Mesh){
                    child.scene = null;
                }
				child.removeFromStage();
            }
			this.childrens.length = 0;
        }


        removeFromStage(){
            const{childrens} = this;
            let len = childrens.length;
            for(let i=0;i<len;i++){
                let child = childrens[i];
                child.stage = undefined
                if(child instanceof Mesh){
                    child.scene = null;
                }
				child.removeFromStage();
            }
		}
		
		
		addToStage(){
            const{childrens,scene,stage} = this;
            let len = childrens.length;
            for(let i=0;i<len;i++){
                let child = childrens[i];
                child.stage = stage;
                if(child instanceof Mesh){
                    child.scene = scene;
                }
				child.addToStage();
            }
        }
    }

    export class Scene extends SceneObject{
        sun:DirectionalLight;
        camera:Camera;
        constructor(variables?:{ [key: string]: IVariable }){
            super(variables);
            this.scene = this;
            this.hitArea = new HitArea();
            this.hitArea.allWays = true;
        }

        public render(camera: Camera, now: number, interval: number): void {
            let{camera:_camera}=this;
            const{depthMask,passCompareMode,sourceFactor,destinationFactor,triangleFaceToCull}=this.material;
            let c = context3D;
            let g = gl;
           
            if(undefined == _camera){
                _camera = camera;
            }

            if(_camera.states){
                _camera.updateSceneTransform();
            }

            c.setCulling(triangleFaceToCull)
            c.setDepthTest(depthMask,passCompareMode);
            c.setBlendFactors(sourceFactor,destinationFactor);

            super.render(_camera,now,interval);
        }
    }

    export class AllActiveSprite extends Sprite{
        constructor(source?:BitmapSource,variables?:{ [key: string]: IVariable }){
            super(source,variables);
            this.hitArea.allWays = true;
        }
    }

    export let scene:Scene;
    export let popContainer = new AllActiveSprite();
    export let tipContainer = new AllActiveSprite();
    export class Stage3D extends AllActiveSprite implements IResizeable{

        static names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        canvas:HTMLCanvasElement;
        cameraUI:CameraUI
        camera2D:CameraOrth;
        camera3D:Camera3D;
        camera:Camera;
        constructor(){
            super();
            this.camera2D = new CameraOrth();
            this.camera3D = new Camera3D();
            this.cameraUI = new CameraUI();
            this.renderer = new BatchRenderer(this);
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


            Capabilities.init();
            MouseInstance.init(Capabilities.isMobile);

            canvas.addEventListener('webglcontextlost',this.webglContextLostHandler);
            canvas.addEventListener("webglcontextrestored",this.webglContextRestoredHandler);
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
    }

    export class PassContainer extends RenderBase{

        camera:Camera
        constructor(variables?:{ [key: string]: IVariable }){
            super(variables);
            this.hitArea = new HitArea();
            this.hitArea.allWays = true;
        }

        public render(camera: Camera, now: number, interval: number): void {
            let{camera:_camera}=this;
            const{depthMask,passCompareMode,sourceFactor,destinationFactor,triangleFaceToCull}=this.material;
            let c = context3D;
            let g = gl;
           
            if(undefined == _camera){
                _camera = camera;
            }

            if(_camera.states){
                _camera.updateSceneTransform();
            }

            c.setCulling(triangleFaceToCull)
            c.setDepthTest(depthMask,passCompareMode);
            c.setBlendFactors(sourceFactor,destinationFactor);

            super.render(_camera,now,interval);
        }
    }

    export class UIContainer extends AllActiveSprite{
        public render(camera: Camera, now: number, interval: number): void {
            const{cameraUI}=ROOT;
            const{depthMask,passCompareMode,sourceFactor,destinationFactor,triangleFaceToCull}=this.material;
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