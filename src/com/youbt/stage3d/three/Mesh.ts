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

        id:string;


        constructor(material?:Material,variables?:{ [key: string]: IVariable }){
            super(variables);
            this.material = material;
        }

        load(url:string){
            this.id = url;
            url += "mesh.km";
            loadRes(url,this.loadCompelte,this,ResType.bin);
        }

        loadCompelte(e:EventX){
            let item:ResItem = e.data;
            let amf = singleton(AMF3);
            let byte = item.data;
            var inflate = new Zlib.Inflate( new Uint8Array(byte) );
            var plain = inflate.decompress();
            amf.setArrayBuffer(plain.buffer);
            let o = amf.readObject();
            this.setKFM(o);
        }

        setKFM(kfm){
            let mesh = kfm.mesh ? kfm.mesh : kfm;
            let c = context3D;
            let vertex = new Float32Array(mesh["vertex"]);
            let geometry = new GeometryBase(this.variables);
            geometry.numVertices = mesh["numVertices"];
            geometry.numTriangles = mesh["numTriangles"];
            geometry.data32PerVertex = mesh["data32PerVertex"];
            let info:VertexInfo = new VertexInfo(vertex,geometry.data32PerVertex,this.variables);
            geometry.vertex = c.createVertexBuffer(info);


            if(mesh.matrix){
                let m = new Matrix3D(new Float32Array(mesh.matrix));
                m.appendScale(100,100,100);
                this.setTransform(m);
            }

            let index=mesh["index"];
            if(index){
                geometry.index = c.createIndexBuffer(new Uint16Array(index));
            }
            
            this.geometry = geometry;


            this.material.triangleFaceToCull = Context3DTriangleFace.NONE;
            // this.material["diffTex"] = this.id + kfm["diff"];
            this.material["diffTex"] = this.id + "diff.png";
            
        }
    }
}