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


    export let vertex_skeleton_variable:{ [key: string]: IVariable } = {
        "index":{size:4,offset:0},
        "weight":{size:4,offset:4},
        "data32PerVertex":{size:8,offset:0}
    }

    export const EMPTY_MAX_NUMVERTICES = Math.pow(2,13);
    export let empty_float32_pos = new Float32Array(3 * EMPTY_MAX_NUMVERTICES);
    export let empty_float32_normal = new Float32Array(3 * EMPTY_MAX_NUMVERTICES);
    export let empty_float32_tangent = new Float32Array(3 * EMPTY_MAX_NUMVERTICES);
    export let empty_float32_uv = new Float32Array(2 * EMPTY_MAX_NUMVERTICES);
    export let empty_float32_color = new Float32Array(4* EMPTY_MAX_NUMVERTICES);

    //2000面应该很多了吧
    export let empty_uint16_indexs = new Uint16Array(3*EMPTY_MAX_NUMVERTICES);

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


    export function geometry_plane(width:number,height:number,position:number,variables:{ [key: string]: IVariable },matrix3D?:IMatrix3D):void{

        let width_half = width * 0.5;
        let height_half = height * 0.5;

        let points = [
            width_half,height_half,0,0,0,
            -width_half,height_half,0,1,0,
            -width_half,-height_half,0,1,1,
            width_half,-height_half,0,0,1
        ];
        let v:IVector3D = TEMP_VECTOR3D;

        let variable = variables[VA.pos];
        let pos = variable ? variable.size * 4 : -1;

        variable =variables[VA.normal];
        let normal = variable ? variable.size * 4 : -1;

        variable =variables[VA.uv];
        let uv = variable ? variable.size * 4 : -1;


        for(let i=0;i<4;i++){
            let p = i * 5;

            if(-1 != pos){
                v.x = points[p];
                v.y = points[p+1];
                v.z = points[p+2];
                if(undefined != matrix3D){
                    matrix3D.m3_transformVector(v,v);
                }
                empty_float32_pos.wPoint3(position * pos + (i * 3) , v.x,v.y,v.z);
            }

            if(-1 != normal){
                v.x = 0;
                v.y = 0;
                v.z = 1;
    
                if(undefined != matrix3D){
                    matrix3D.m3_transformRotation(v,v);
                }
                empty_float32_normal.wPoint3(position * normal +  (i * 3) , v.x,v.y,v.z);
            }

            if(-1 != uv){
                empty_float32_uv.wPoint2(position * uv + (i * 2) , points[p+3], points[p+4]);
            }
           
        }
    }

    export class GeometryBase implements IGeometry{
        variables:{ [key: string]: IVariable };
        vertex:VertexBuffer3D;
        index:IndexBuffer3D;
        _mesh:IMeshData;
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

        setData(mesh:IMeshData){

            this._mesh = mesh;

            let{variables:meshVar,numVertices,numTriangles,data32PerVertex,vertex,index,vertexBuffer,indexBuffer}=mesh;
            let{variables}=this;
            let c = context3D;

            if(!meshVar){
                mesh.variables = variables;
                mesh.data32PerVertex = data32PerVertex;
            }else{
                variables = mesh.variables;
            }
            
            this.numVertices = numVertices;
            this.numTriangles = numTriangles;
            this.data32PerVertex = data32PerVertex;


            if(!vertexBuffer){
                let info: VertexInfo = new VertexInfo(vertex, data32PerVertex, variables);
                mesh.vertexBuffer = vertexBuffer = c.createVertexBuffer(info);
            }

            this.vertex = vertexBuffer;

            if(!indexBuffer){
                if(index){
                   mesh.indexBuffer = indexBuffer = c.createIndexBuffer(index);
                }
            }
            this.index = indexBuffer;

            // if (index) {
            //     geometry.index = c.createIndexBuffer(new Uint16Array(index));
            // }else{
            //     geometry.numTriangles *= 3;
            // }
        }
        
        
        


        get pos(){
            const{numVertices,vertex,data32PerVertex}=this.vertex.data;
            let pos = [];
            for(let i=0;i<numVertices;i++){
                let p = i * data32PerVertex;
                pos.push([vertex[p],vertex[p+1],vertex[p+2]])
            }
            return pos;
        }

        get uv(){
            const{numVertices,vertex,data32PerVertex,variables}=this.vertex.data;
            let uv = variables["uv"];
            let uvs = [];
            for(let i=0;i<numVertices;i++){
                let p = i * data32PerVertex + uv.offset;
                uvs.push([vertex[p],vertex[p+1]])
            }
            return uvs;
        }

        get triangles(){
            const{numTriangles}=this;
            const{data}=this.index;
            let triangles = [];
            for(let i=0;i<numTriangles;i++){
                let p = i * 3;
                triangles.push( [data[p],data[p+1],data[p+2]] )
            }

            return triangles;
        }


        uploadContext(camera:Camera,mesh:Mesh, program:Program3D, now: number, interval: number){
            let c = context3D;
            this.vertex.uploadContext(program);
            let{sceneTransform,invSceneTransform}=mesh;
            let worldTranform = TEMP_MATRIX;
            worldTranform.set(sceneTransform);
            worldTranform.m3_append(camera.worldTranform);
            c.setProgramConstantsFromMatrix(VC.mvp,worldTranform);
            c.setProgramConstantsFromMatrix(VC.invm,invSceneTransform);
        }
        
    }

    export interface ISkeletonJoint{
        index:number;
        name:string;
        inv:Float32Array;
        chind:ISkeletonJoint[];
        parent:ISkeletonJoint;
    }

    export class SkeletonGeometry extends GeometryBase{
        skVertex:VertexBuffer3D;
        joints:{[key:string]:ISkeletonJoint};
        jointroot:ISkeletonJoint;
    }


    export class PlaneGeometry extends GeometryBase{
        create(width:number = 1, height:number = 1){
            let numVertices = 0;
            let quad = 0;

            let variables = this.variables;

            let matrix3D = newMatrix3D();

            geometry_plane(width,height,0,variables);
            numVertices += 4;
            quad ++;

            
            matrix3D.m3_rotation(180*DEGREES_TO_RADIANS,Y_AXIS);
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
            let matrix3D = newMatrix3D();
            let numVertices = 0;
            let quad = 0;
            let variables = this.variables;

            matrix3D.m3_translation(0,0,depth * 0.5);
            geometry_plane(width,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;

            matrix3D.m3_identity();
            matrix3D.m3_rotation(180 * DEGREES_TO_RADIANS,Y_AXIS);
            matrix3D.m3_translation(0,0,-depth * 0.5);
            geometry_plane(width,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;


            matrix3D.m3_identity();
            matrix3D.m3_rotation(-90 * DEGREES_TO_RADIANS,Y_AXIS);
            matrix3D.m3_translation(width * 0.5,0,0);
            geometry_plane(depth,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;

            matrix3D.m3_identity();
            matrix3D.m3_rotation(90 * DEGREES_TO_RADIANS,Y_AXIS);
            matrix3D.m3_translation(-width * 0.5,0,0);
            geometry_plane(depth,height,quad,variables,matrix3D);
            numVertices += 4;
            quad++;


            matrix3D.m3_identity();
            matrix3D.m3_rotation(90 * DEGREES_TO_RADIANS,X_AXIS);
            matrix3D.m3_translation(0,height * 0.5,0);
            geometry_plane(width,depth,quad,variables,matrix3D);
            numVertices += 4;
            quad++;


            matrix3D.m3_identity();
            matrix3D.m3_rotation(-90 * DEGREES_TO_RADIANS,X_AXIS);
            matrix3D.m3_translation(0,-height * 0.5,0);
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

    export function hsva(h:number, s:number, v:number, a:number){
        if(s > 1 || v > 1 || a > 1){return;}
        var th = h % 360;
        var i = Math.floor(th / 60);
        var f = th / 60 - i;
        var m = v * (1 - s);
        var n = v * (1 - s * f);
        var k = v * (1 - s * (1 - f));
        var color = [];
        var r = [v, n, m, m, k, v];
        var g = [k, v, v, n, m, m];
        var b = [m, m, k, v, v, n];
        color.push(r[i], g[i], b[i], a);
        return color;
    }


    export class SphereGeometry extends GeometryBase{
        create(row:number, column:number, rad:number,color?:number[]){
            let numVertices = 0;
            for(let i = 0; i <= row; i++){
                let r = Math.PI / row * i;
                let ry = Math.cos(r);
                let rr = Math.sin(r);
                for(let ii = 0; ii <= column; ii++){
                    let tr = Math.PI * 2 / column * ii;
                    let tx = rr * rad * Math.cos(tr);
                    let ty = ry * rad;
                    let tz = rr * rad * Math.sin(tr);
                    let rx = rr * Math.cos(tr);
                    let rz = rr * Math.sin(tr);
                    let tc = color;
                    if(undefined == tc){
                        tc = hsva(360 / row * i, 1, 1, 1);
                    }
                    empty_float32_pos.wPoint3(numVertices * 3,tx,ty,tz);
                    empty_float32_normal.wPoint3(numVertices * 3,rx,ry,rz);
                    empty_float32_uv.wPoint2(numVertices * 2,1 - 1 / column * ii, 1 / row * i);
                    empty_float32_color.wPoint4(numVertices * 4 , tc[0], tc[1], tc[2], tc[3]);
                    numVertices ++;
                }
            }

            let position = 0;
            for(let i = 0; i < row; i++){
                for(let ii = 0; ii < column; ii++){
                    let r = (column + 1) * i + ii;
                    empty_uint16_indexs.set([r, r + 1, r + column + 2,r, r + column + 2, r + column + 1],position);
                    position += 6;
                }
            }


            let variables = this.variables;
            let c = context3D;
            let arr = createGeometry(empty_float32_object,variables,numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr,this.data32PerVertex,variables));
            this.index = c.createIndexBuffer(empty_uint16_indexs.slice(0,position));

            this.numVertices = numVertices;
            this.numTriangles =  position / 3;

            return this;
        }
    }

    export class TorusGeomerty extends GeometryBase{
        
        create(row:number, column:number, irad:number, orad:number){
            let numVertices = 0;
            for(var i = 0; i <= row; i++){
                var r = Math.PI * 2 / row * i;
                var rr = Math.cos(r);
                var ry = Math.sin(r);
                for(var ii = 0; ii <= column; ii++){
                    var tr = Math.PI * 2 / column * ii;
                    var tx = (rr * irad + orad) * Math.cos(tr);
                    var ty = ry * irad;
                    var tz = (rr * irad + orad) * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    // if(color){
                    //     var tc = color;
                    // }else{
                    //     tc = hsva(360 / column * ii, 1, 1, 1);
                    // }
                    var rs = 1 / column * ii;
                    var rt = 1 / row * i + 0.5;
                    if(rt > 1.0){rt -= 1.0;}
                    rt = 1.0 - rt;

                    empty_float32_pos.wPoint3(numVertices * 3,tx,ty,tz);
                    empty_float32_normal.wPoint3(numVertices * 3,rx,ry,rz);
                    empty_float32_uv.wPoint2(numVertices * 2,rs, rt);
                    // empty_float32_color.wPoint4(numVertices * 4 , tc[0], tc[1], tc[2], tc[3]);
                    numVertices ++;
                }
            }
            
            let position = 0;
            for(i = 0; i < row; i++){
                for(ii = 0; ii < column; ii++){
                    r = (column + 1) * i + ii;
                    empty_uint16_indexs.set([r, r + column + 1, r + 1,r + column + 1, r + column + 2, r + 1],position);
                    position += 6;
                }
            }
            
            
            let variables = this.variables;
            let c = context3D;
            let arr = createGeometry(empty_float32_object,variables,numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr,this.data32PerVertex,variables));
            this.index = c.createIndexBuffer(empty_uint16_indexs.slice(0,position));

            this.numVertices = numVertices;
            this.numTriangles =  position / 3;

            return this;
        }
    }
}