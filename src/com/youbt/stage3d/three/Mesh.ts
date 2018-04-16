///<reference path="../Stage3D.ts" />
module rf{
    export class Mesh extends SceneObject{
        scene:Scene;
        geometry:GeometryBase;
        invSceneTransform:Matrix3D;
        constructor(variables?:{ [key: string]: IVariable }){
            super(variables ? variables : vertex_mesh_variable);
            this.invSceneTransform = new Matrix3D();
            this.nativeRender = true;
        }


        updateSceneTransform():void{
            super.updateSceneTransform();
            let{invSceneTransform,sceneTransform} = this;
            invSceneTransform.copyFrom(sceneTransform);
            invSceneTransform.invert();


        }


        init(geometry:GeometryBase,material:Material){
            this.geometry = geometry;
            this.material = material;
        }

        render(camera: Camera, now: number, interval: number): void {
            const{geometry,material}=this;
            if(undefined != geometry && undefined != material){
                let b = material.uploadContext(camera,this,now,interval);
                if(true == b){
                    geometry.uploadContext(camera,this,material.program,now,interval);
                    context3D.drawTriangles(geometry.index,geometry.numTriangles)
                }
            }
            super.render(camera,now,interval);
        }
    }


    export class KFMMesh extends Mesh{
        constructor(material?:Material,variables?:{ [key: string]: IVariable }){
            super(variables);
            this.material = material;
        }

        load(url:string){
            loadRes(url,function (e:EventX){

                let item:ResItem = e.data;
                let amf = singleton(AMF3);
                amf.setArrayBuffer(item.data);
                let o = amf.readObject();
                this.setKFM(o);
            },this,ResType.bin)
        }

        setKFM(kfm:object){
            let c = context3D;
            let vertex = new Float32Array(kfm["vertex"]);
            let index = new Uint16Array(kfm["index"]);
            let geometry = new GeometryBase(this.variables);
            geometry.numVertices = kfm["numVertices"];
            geometry.numTriangles = kfm["numTriangles"];
            geometry.data32PerVertex = kfm["data32PerVertex"];
            let info:VertexInfo = new VertexInfo(vertex,geometry.data32PerVertex,this.variables);
            geometry.vertex = c.createVertexBuffer(info);
            geometry.index = c.createIndexBuffer(index);
            this.geometry = geometry;
            if(undefined == this.material){
                this.material = new PhongMaterial();
            }
        }
    }
}