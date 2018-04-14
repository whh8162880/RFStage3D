///<reference path="../Stage3D.ts" />
module rf{
    export class Mesh extends SceneObject{
        scene:Scene;
        geometry:GeometryBase;
        worldTranform:Matrix3D;
        invSceneTransform:Matrix3D;
        constructor(variables?:{ [key: string]: IVariable }){
            super(variables ? variables : vertex_mesh_variable);
            this.worldTranform = new Matrix3D();
            this.invSceneTransform = new Matrix3D();
            this.nativeRender = true;
        }


        updateSceneTransform():void{
            super.updateSceneTransform();
            const{invSceneTransform,sceneTransform} = this;
            invSceneTransform.copyFrom(sceneTransform);
            invSceneTransform.invert();


        }


        init(geometry:GeometryBase,material:Material){
            this.geometry = geometry;
            this.material = material;
        }

        render(camera: Camera, now: number, interval: number): void {
            const{geometry,material,worldTranform,sceneTransform,invSceneTransform}=this;
            let c = context3D;
            if(undefined != geometry && undefined != material){
                let b = material.uploadContext(camera,this,now,interval);
                if(true == b){
                    geometry.uploadContext(camera,this,material.program,now,interval);
                
                    worldTranform.copyFrom(sceneTransform);
                    worldTranform.append(camera.worldTranform);
                    c.setProgramConstantsFromMatrix(VC.mvp,worldTranform);
                    c.setProgramConstantsFromMatrix(VC.invm,invSceneTransform);
                    
                    c.drawTriangles(geometry.index,geometry.numTriangles)
                }
            }
            super.render(camera,now,interval);
        }
    }
}