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
        index:IndexBuffer3D;
        
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
            let context = context3D;
            let arr = createGeometry(empty_float32_object,variables,numVertices);
            this.vertex = context.createVertexBuffer(new VertexInfo(arr,this.data32PerVertex,variables));
            this.index = context.createIndexBuffer(indices);
        
            // this.setIndex( indices );
            // this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
            // this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
            // this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

            
            return this;
        }
    }


    export class BoxGeometry extends GeometryBase{
        create( width:number , height:number , depth:number , widthSegments:number , heightSegments:number , depthSegments:number){
            width = width || 1;
            height = height || 1;
            depth = depth || 1;
            // segments
            widthSegments = Math.floor( widthSegments ) || 1;
            heightSegments = Math.floor( heightSegments ) || 1;
            depthSegments = Math.floor( depthSegments ) || 1;

            var indices = [];
            var vertices = [];
            var normals = [];
            var uvs = [];
        
            // helper variables
        
            var numberOfVertices = 0;
            var groupStart = 0;
        
            // build each side of the box geometry
        
            buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
            buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
            buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
            buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
            buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
            buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // n



            function buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

                var segmentWidth = width / gridX;
                var segmentHeight = height / gridY;
        
                var widthHalf = width / 2;
                var heightHalf = height / 2;
                var depthHalf = depth / 2;
        
                var gridX1 = gridX + 1;
                var gridY1 = gridY + 1;
        
                var vertexCounter = 0;
                var groupCount = 0;
        
                var ix, iy;
        
                var vector = new Vector3D();
        
                // generate vertices, normals and uvs
        
                for ( iy = 0; iy < gridY1; iy ++ ) {
        
                    var y = iy * segmentHeight - heightHalf;
        
                    for ( ix = 0; ix < gridX1; ix ++ ) {
        
                        var x = ix * segmentWidth - widthHalf;
        
                        // set values to correct vector component
        
                        vector[ u ] = x * udir;
                        vector[ v ] = y * vdir;
                        vector[ w ] = depthHalf;
        
                        // now apply vector to vertex buffer
        
                        vertices.push( vector.x, vector.y, vector.z );
        
                        // set values to correct vector component
        
                        vector[ u ] = 0;
                        vector[ v ] = 0;
                        vector[ w ] = depth > 0 ? 1 : - 1;
        
                        // now apply vector to normal buffer
        
                        normals.push( vector.x, vector.y, vector.z );
        
                        // uvs
        
                        uvs.push( ix / gridX );
                        uvs.push( 1 - ( iy / gridY ) );
        
                        // counters
        
                        vertexCounter += 1;
        
                    }
        
                }
        
                // indices
        
                // 1. you need three indices to draw a single face
                // 2. a single segment consists of two faces
                // 3. so we need to generate six (2*3) indices per segment
        
                for ( iy = 0; iy < gridY; iy ++ ) {
        
                    for ( ix = 0; ix < gridX; ix ++ ) {
        
                        var a = numberOfVertices + ix + gridX1 * iy;
                        var b = numberOfVertices + ix + gridX1 * ( iy + 1 );
                        var c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
                        var d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;
        
                        // faces
        
                        indices.push( a, b, d );
                        indices.push( b, c, d );
        
                        // increase counter
        
                        groupCount += 6;
        
                    }
        
                }
        
        
                groupStart += groupCount;
        
                // update total number of vertices
        
                numberOfVertices += vertexCounter;
        
            }
        }


        
    }
}