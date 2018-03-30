module rf{
    

    

    export class VertexInfo{
        vertex:Float32Byte;
        variables: { [key: string]: { size: number, offset: number } } = undefined;

        constructor(value:number|Float32Array){
            if(value instanceof Float32Array){
                this.vertex = new Float32Byte(value)
            }else{
                this.vertex = new Float32Byte(new Float32Array(value));
            }
                
        }

        public regVariable(variable: string, offset: number, size: number): void {
            if (undefined == this.variables) {
                this.variables = {};
            }
            this.variables[variable] = { size: size, offset: offset * 4 };
        }
    }


    export interface IGeometry{
        vertex:VertexInfo;
        index?:Uint16Array;
    }
}