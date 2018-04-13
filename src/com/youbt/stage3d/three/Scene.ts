///<reference path="../Stage3D.ts" />
///<reference path="./Light.ts" />
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
}