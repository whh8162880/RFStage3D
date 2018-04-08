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

        vertex: Float32Byte;
        numVertices: number = 0;
        data32PerVertex: number = 0;
        variables: { [key: string]: { size: number, offset: number } } = undefined;

        constructor(value: number | Float32Array, data32PerVertex: number) {
            if (value instanceof Float32Array) {
                this.vertex = new Float32Byte(value)
            } else {
                this.vertex = new Float32Byte(new Float32Array(value));
            }
            this.data32PerVertex = data32PerVertex;
            this.numVertices = this.vertex.length / data32PerVertex;
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
}