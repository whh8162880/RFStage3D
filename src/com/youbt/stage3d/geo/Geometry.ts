module rf{
    

    export class IndexInfo{
        private static byte:Uint16Array = undefined;
        private static indexs:{number:Uint16Array};
        protected static initIndexByQuadCount(count:number):void{
            let byte = IndexInfo.byte = new Uint16Array(count * 6 * 2);
            count *= 4;
            let j = 0;
			for(var i:number =0;i<count;i+=4){
				byte[j++] = i;
				byte[j++] = i + 1;
				byte[j++] = i + 3;
				byte[j++] = i + 1;
				byte[j++] = i + 2;
				byte[j++] = i + 3;
			}
        }
        /**
         * UI专用
         * @param quadCount 
         */
        public static getIndexBuffer(quadCount:number):Uint16Array{
            if(quadCount > 2000){
                ThrowError("你要这么多四边形干嘛？");
                return null;
            }

            let buffer = IndexInfo.indexs[quadCount];
            let length = quadCount * 6 * 2
            if(undefined == buffer){
                IndexInfo.indexs[quadCount] = buffer = new Uint16Array(length);
                if(undefined == IndexInfo.byte){
                    IndexInfo.initIndexByQuadCount(2000);
                }
                buffer.set(IndexInfo.byte.slice(0,length));
            }
            return buffer;
        }

    }

    export class VertexInfo{
        vertex:Float32Byte = undefined;
        varibles: { [key: string]: { size: number, offset: number } } = undefined;
        public regVariable(variable: string, offset: number, size: number): void {
            if (undefined == this.varibles) {
                this.varibles = {};
            }
            this.varibles[variable] = { size: size, offset: offset * 4 };
        }
    }


    export interface IGeometry{
        vertex:VertexInfo;
        index:Uint16Array;
    }
}