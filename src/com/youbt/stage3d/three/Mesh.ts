///<reference path="../display/Sprite.ts" />
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
            const{geometry,material,worldTranform}=this;
            let c = context3D;
            if(undefined != geometry && undefined != material){
                const{vertex,index}=geometry;
                if(undefined != vertex && undefined != index){
                    let{program}=material;
                    if(undefined == program){
                        program = material.createProgram();
                    }
                    c.setProgram(program);
                    vertex.uploadContext(program);

                    worldTranform.copyFrom(this.sceneTransform);
                    worldTranform.append(camera.worldTranform);
                    c.setProgramConstantsFromMatrix(VC.mvp,worldTranform);

                    material.uploadContext();
                    c.drawTriangles(index,index.numIndices)
                }
            }
            super.render(camera,now,interval);
        }
    }
}