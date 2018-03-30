module rf{
    

    

    export class VertexInfo{
        vertex:Float32Byte;

        numVertices:number = 0;
        data32PerVertex:number = 0;
        variables: { [key: string]: { size: number, offset: number } } = undefined;

        constructor(value:number|Float32Array,data32PerVertex:number){
            if(value instanceof Float32Array){
                this.vertex = new Float32Byte(value)
            }else{
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


    export interface IGeometry{
        vertex:VertexInfo;
        index?:Uint16Array;
    }
}