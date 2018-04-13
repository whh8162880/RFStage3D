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
        vertex: VertexInfo;
        index?: Uint16Array;
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



    export class GeometryBase implements IGeometry{
        variables:{ [key: string]: IVariable }
        constructor(variables?:{ [key: string]: IVariable }){
            if(undefined == variables){
                variables = vertex_mesh_variable;
            }
            this.variables = variables;
            this.data32PerVertex = variables["data32PerVertex"].size;
        }
        data32PerVertex:number = 0;
        numVertices:number = 0;
        vertex:VertexInfo;
        index:Uint16Array;
    }


    export class PlanGeometry extends GeometryBase{
        create(width:number = 1, height:number = 1, widthSegments:number = 1, heightSegments:number = 1){
            var width_half = width / 2;
            var height_half = height / 2;
        
            var gridX = Math.floor( widthSegments ) || 1;
            var gridY = Math.floor( heightSegments ) || 1;
        
            var gridX1 = gridX + 1;
            var gridY1 = gridY + 1;
        
            var segment_width = width / gridX;
            var segment_height = height / gridY;
        
            var ix, iy;

            let numVertices = 0;
        
            // buffers
        
            var indices = [];
            var vertices = [];
            var normals = [];
            var uvs = [];
            // generate vertices, normals and uvs
        
            for ( iy = 0; iy < gridY1; iy ++ ) {
        
                var y = iy * segment_height - height_half;
        
                for ( ix = 0; ix < gridX1; ix ++ ) {
        
                    var x = ix * segment_width - width_half;
        
                    vertices.push( x, - y, 0 );
        
                    normals.push( 0, 0, 1 );
        
                    uvs.push( ix / gridX );
                    uvs.push( 1 - ( iy / gridY ) );
        
                }
        
            }
        
            // indices
        
            for ( iy = 0; iy < gridY; iy ++ ) {
        
                for ( ix = 0; ix < gridX; ix ++ ) {
        
                    var a = ix + gridX1 * iy;
                    var b = ix + gridX1 * ( iy + 1 );
                    var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
                    var d = ( ix + 1 ) + gridX1 * iy;
        
                    // faces
        
                    indices.push( a, b, d );
                    indices.push( b, c, d );
        
                }
        
            }

            this.numVertices = numVertices = vertices.length / 3;

            empty_float32_pos.set(vertices,0);
            empty_float32_uv.set(uvs,0);
            empty_float32_normal.set(normals,0);
        
            // build geometry
            

            let variables = this.variables;

            let arr = createGeometry(empty_float32_object,variables,numVertices);
            this.vertex = new VertexInfo(arr,this.data32PerVertex,variables)
            this.index = new Uint16Array(indices);
        
            // this.setIndex( indices );
            // this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
            // this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
            // this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

            

        }
    }
}