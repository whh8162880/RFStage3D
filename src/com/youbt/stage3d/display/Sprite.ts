///<reference path="./DisplayObjectContainer.ts" />
module rf{
    export class Sprite extends DisplayObjectContainer{
        constructor(){
            super();
        }
        $graphics:Graphics = undefined;

        get graphics():Graphics{
            if(undefined == this.$graphics){
                this.$graphics = new Graphics(this);
            }
            return this.$graphics;
        }
    }



    export class Graphics{
        target:Sprite;
        byte:Float32Byte
        constructor(target:Sprite){
            this.target = target;
            this.byte = new Float32Byte(new Float32Array(0))
        }

        
        public drawRect(x:number, y:number,width:number, height:number,color:number,z:number = 0):void{

            let _a = (color & 0xff000000) >>> 24;
            let _r = (color & 0x00ff0000) >>> 16;
            let _g = (color & 0x0000ff00) >>> 8;
            let _b = color & 0x000000ff;

            let r = x + width;
            let b = y + height;
            
            let p = this.byte.array.length;

            this.byte.length = p+40;

            this.byte.addPoint(p   ,x,y,z,0,0,0,_r,_g,_b,_a);
            this.byte.addPoint(p+10,r,y,z,0,0,0,_r,_g,_b,_a);
            this.byte.addPoint(p+20,r,b,z,0,0,0,_r,_g,_b,_a);
            this.byte.addPoint(p+30,x,b,z,0,0,0,_r,_g,_b,_a);
            


        }
    }
}