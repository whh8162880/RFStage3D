module rf {

    export let vertex_ui_variable:{ [key: string]: { size: number, offset: number } } = {
        //x,y,z,u,v,index,r,g,b,a
        "pos":{size:3,offset:0},
        "uv":{size:3,offset:3}, //xy uv ~~ z index
        "color":{size:4,offset:6}
    }

    export let vertex_mesh_variable:{ [key: string]: { size: number, offset: number } } = {
        "pos":{size:3,offset:0},
        "normal":{size:3,offset:3},
        "uv":{size:2,offset:6},
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