module rf{
    export class Float32Byte{
        public array:Float32Array;
       
        constructor(array:Float32Array){
            this.array = array;
        }

        get length():number{
            return this.array.length;
        }

        set length(value:number){
            if(this.array.length  == value){
                return;
            }
            let nd = new Float32Array(value);
            let len = value < this.array.length ? value : this.array.length;
            nd.set(this.array.slice(0,len),0);
            this.array = nd;
        }

        public append(byte:Float32Byte,offset:number = 0,len:number = -1):void{
            var position:number = 0;
            if(0 > offset){
                offset = 0;
            }

            if(-1 == len){
                len = byte.length - offset;
            }else{
                if(len > byte.length - offset){
                    len = byte.length - offset;
                }
            }

            position = this.array.length;
            length = this.array.length + byte.length;

            if(len == byte.length){
                this.array.set(byte.array,position);
            }else{
                this.array.set(byte.array.slice(offset,len),position);
            }
        }

        public addPoint(position:number,x:number,y:number,z:number,u:number,v:number,index:number,r:number,g:number,b:number,a:number):void{
            this.array[position    ] = x;
            this.array[position + 1] = y;
            this.array[position + 2] = z;
            this.array[position + 3] = u;
            this.array[position + 4] = v;
            this.array[position + 5] = index;
            this.array[position + 6] = r;
            this.array[position + 7] = g;
            this.array[position + 8] = b;
            this.array[position + 9] = a;
        }
    }

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