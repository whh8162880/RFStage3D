module rf {
    export let vertex_ui_variable:{ [key: string]: IVariable } = {
        //x,y,z,u,v,index,r,g,b,a
        "pos":{size:3,offset:0},
        "uv":{size:3,offset:3}, //xy uv ~~ z index
        "color":{size:4,offset:6},
        "data32PerVertex":{size:10,offset:0}
    }

    /**
     * 可合并的UI对象完整体
     */
    export let vertex_ui_full_variable:{ [key: string]: IVariable } = {
        //x,y,z,u,v,index,r,g,b,a
        "pos":{size:3,offset:0},
        "normal":{size:3,offset:3},
        "uv":{size:3,offset:6}, //xy uv ~~ z index
        "color":{size:4,offset:9},
        "data32PerVertex":{size:13,offset:0}
    }

    export let vertex_mesh_variable:{ [key: string]: IVariable } = {
        "pos":{size:3,offset:0},
        "normal":{size:3,offset:3},
        "uv":{size:2,offset:6},
        "data32PerVertex":{size:8,offset:0}
    }


    export let vertex_mesh_full_variable:{ [key: string]: IVariable } = {
        "pos":{size:3,offset:0},
        "normal":{size:3,offset:3},
        "uv":{size:2,offset:6},
        "color":{size:4,offset:8},
        "data32PerVertex":{size:12,offset:0}
    }


    export let empty_float32_pos = new Float32Array(1000);
    export let empty_float32_normal = new Float32Array(1000);
    export let empty_float32_uv = new Float32Array(1000);
    export let empty_float32_color = new Float32Array(1200);

    //2000面应该很多了吧
    export let empty_uint16_indexs = new Uint16Array(6000);

    export let empty_float32_object:{ [key: string]: Float32Array } = {
        "pos":empty_float32_pos,
        "normal":empty_float32_normal,
        "uv":empty_float32_uv,
        "color":empty_float32_color
    }

    /**
     * pos:Float32Array
     * noraml:Float32Array
     * uv:Float32Array
     * color:Float32Array
     */
    export function createGeometry(data:{ [key: string]: Float32Array },variables:{ [key: string]: IVariable },numVertices:number,result?:Float32Array):Float32Array{
        let data32PerVertex = variables["data32PerVertex"].size;
        if(undefined == result){
            result = new Float32Array(data32PerVertex * numVertices);
        }
        let offset = 0;
        let offsetIndex = 0;
        let offsetData = 0;
        let key = "";
        let index = 0;
        for(let i = 0;i<numVertices;i++){
            offset = data32PerVertex * i;
            for(key in data){
                let variable = variables[key];
                if(undefined == variable){
                    continue;
                }
                let array = data[key];
                offsetData = i * variable.size;
                offsetIndex = offset + variable.offset;
                for(index=0;index<variable.size;index++){
                    result[offsetIndex + index] = array[offsetData+index];
                }
            }
        }
        return result;
    }

    export interface IVariable{
        size:number;
        offset:number;
    }


    export class VertexInfo {
        vertex: Float32Array;
        numVertices: number = 0;
        data32PerVertex: number = 0;
        variables: { [key: string]: IVariable };

        constructor(value: number | Float32Array, data32PerVertex: number,variables?:{ [key: string]: IVariable }) {
            if (value instanceof Float32Array) {
                this.vertex = value
            } else {
                this.vertex = new Float32Array(value);
            }
            this.data32PerVertex = data32PerVertex;
            this.numVertices = this.vertex.length / data32PerVertex;
            this.variables = variables;
        }

        public regVariable(variable: string, offset: number, size: number): void {
            if (undefined == this.variables) {
                this.variables = {};
            }
            this.variables[variable] = { size: size, offset: offset };
        }
    }


    export interface IGeometry {
        vertex: VertexBuffer3D;
        index?: IndexBuffer3D;
    }


    export class Temp_Float32Byte implements IRecyclable{
        constructor(){
            this.data = new Float32Array(2048); //先无脑申请个8KB内存
        }
        data:Float32Array;
        data32PerVertex:number = 1;
        numVertices:number = 0;
        position:number = 0;
        onSpawn(){
            this.data32PerVertex = 1;
            this.numVertices = 0;
            this.position = 0;
        }


        set(array: ArrayLike<number>, offset?: number): void{
            if(undefined == offset){
                offset = this.position;
            }
            this.data.set(array,offset);
            this.position = offset + array.length;
        }


        toArray():Float32Array{
            let len = this.data32PerVertex * this.numVertices
            let arr = new Float32Array(len);
            arr.set(this.data.slice(0,len));
            return arr;
        }
    }


    export function geometry_point(position:number,variables:{ [key: string]: IVariable },x:number,y:number,z:number,nx:number,ny:number,nz:number,u:number,v:number):void{

    }
   

    export function geometry_plane(width:number,height:number,position:number,variables:{ [key: string]: IVariable },matrix3D?:Matrix3D):void{

        let width_half = width * 0.5;
        let height_half = height * 0.5;

        let points = [
            -width_half,-height_half,0,
            width_half,-height_half,0,
            width_half,height_half,0,
            -width_half,height_half,0
        ];
        let v:Vector3D = TEMP_VECTOR3D;

        let variable = variables[VA.pos];
        let pos = variable ? variable.size * 4 : -1;

        variable =variables[VA.normal];
        let normal = variable ? variable.size * 4 : -1;

        variable =variables[VA.uv];
        let uv = variable ? variable.size * 4 : -1;


        for(let i=0;i<12;i+=3){
            v.x = points[i];
            v.y = points[i+1];
            v.z = points[i+2];

            if(undefined != matrix3D){
                matrix3D.transformVector(v,v);
            }
            empty_float32_pos.wPoint3(position * pos + i , v.x,v.y,v.z);

            v.x = 0;
            v.y = 0;
            v.z = 1;

            if(undefined != matrix3D){
                matrix3D.transformRotation(v,v);
            }
            empty_float32_normal.wPoint3(position * normal + i , v.x,v.y,v.z);

            empty_float32_uv.wPoint2(position * uv + i , (v.x+width_half) / width, (v.y+height_half) / height);
            
           
        }
    }

    export class GeometryBase implements IGeometry{
        variables:{ [key: string]: IVariable };
        vertex:VertexBuffer3D;
        constructor(variables?:{ [key: string]: IVariable }){
            if(undefined == variables){
                variables = vertex_mesh_variable;
            }
            this.variables = variables;
            this.data32PerVertex = variables["data32PerVertex"].size;
        }
        data32PerVertex:number = 0;
        numVertices:number = 0;
        numTriangles:number = 0;
        index:IndexBuffer3D;


        uploadContext(camera:Camera,mesh:Mesh, program:Program3D, now: number, interval: number){

            let c = context3D;

            this.vertex.uploadContext(program);

            const{worldTranform,sceneTransform,invSceneTransform}=mesh;

            worldTranform.copyFrom(sceneTransform);
            worldTranform.append(camera.worldTranform);
            c.setProgramConstantsFromMatrix(VC.mvp,worldTranform);
            c.setProgramConstantsFromMatrix(VC.invm,invSceneTransform);
        }
        
    }


    export class PlaneGeometry extends GeometryBase{
        create(width:number = 1, height:number = 1){
            let numVertices = 0;
            let quad = 0;

            let variables = this.variables;

            let matrix3D = new Matrix3D();

            geometry_plane(width,height,0,variables);
            numVertices += 4;
            quad ++;

            
            matrix3D.appendRotation(180,Vector3D.Y_AXIS);
            geometry_plane(width,height,1,variables,matrix3D);
            numVertices += 4;
            quad ++;

           
            let c = context3D;
            let arr = createGeometry(empty_float32_object,variables,numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr,this.data32PerVertex,variables));
            this.index = c.getIndexByQuad(quad);

            this.numVertices = numVertices;
            this.numTriangles = quad*2;
 
            return this;
        }
    }


    export class BoxGeometry extends GeometryBase{
        create( width:number , height:number , depth:number){
            let matrix3D = new Matrix3D();
            let numVertices = 0;
            let quad = 0;
            let variables = this.variables;

            matrix3D.appendTranslation(0,0,depth * 0.5);
            geometry_plane(width,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;

            matrix3D.identity();
            matrix3D.appendRotation(180,Vector3D.Y_AXIS);
            matrix3D.appendTranslation(0,0,-depth * 0.5);
            geometry_plane(width,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;


            matrix3D.identity();
            matrix3D.appendRotation(-90,Vector3D.Y_AXIS);
            matrix3D.appendTranslation(width * 0.5,0,0);
            geometry_plane(depth,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;

            matrix3D.identity();
            matrix3D.appendRotation(90,Vector3D.Y_AXIS);
            matrix3D.appendTranslation(-width * 0.5,0,0);
            geometry_plane(depth,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;


            matrix3D.identity();
            matrix3D.appendRotation(90,Vector3D.X_AXIS);
            matrix3D.appendTranslation(0,height * 0.5,0);
            geometry_plane(width,depth,quad,variables,matrix3D);
            numVertices += 4;
            quad++;


            matrix3D.identity();
            matrix3D.appendRotation(-90,Vector3D.X_AXIS);
            matrix3D.appendTranslation(0,-height * 0.5,0);
            geometry_plane(width,depth,quad,variables,matrix3D);
            numVertices += 4;
            quad++;


            
            let c = context3D;
            let arr = createGeometry(empty_float32_object,variables,numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr,this.data32PerVertex,variables));
            this.index = c.getIndexByQuad(quad);

            this.numVertices = numVertices;
            this.numTriangles = quad*2;

            return this;
        }
    }


    export class SphereGeometry extends GeometryBase{
        class 
    }
}