///<reference path="./DisplayObjectContainer.ts" />
///<reference path="../camera/Camera.ts" />
module rf{
    export interface I3DRender extends IRecyclable{
        render(camera:Camera,now:number,interval:number):void
    }
    export class HitArea{
        left:number = 0;
        right:number = 0;
        top:number = 0;
        bottom:number = 0;
        front:number = 0;
        back:number = 0;

        public updateArea(x:number,y:number,z:number):boolean{
            let b:boolean = false;
            if(this.left < x){
                this.left = x;
                b = true;
            }else if(this.right > x){
                this.right = x;
                b = true;
            }

            if(this.top < y){
                this.top = y;
                b = true;
            }else if(this.top > y){
                this.top = y;
                b = true;
            }

            if(this.front < z){
                this.front = z;
                b = true;
            }else if(this.back > z){
                this.back = z;
                b = true;
            }
            
            return b;
        }


        public checkIn(x:number,y:number,scale:number = 1):boolean{
            if(x < this.left * scale && x > this.right * scale && y < this.top * scale && y > this.bottom * scale){
                return false;
            }
            return true;
        }




        public toString():string{
            return `HitArea left:${this.left} right:${this.right} top:${this.top} bottom:${this.bottom} front:${this.front} back:${this.back}`
        }
    }

    export class Sprite extends DisplayObjectContainer implements I3DRender{
        hitArea:HitArea;
        $graphics:Graphics = undefined;

        batcher:Batcher;
        batcherAvailable:boolean = true;
        constructor(){
            super();
            this.hitArea = new HitArea();
            // let g = this.graphics;
            // g.drawRect(0,0,100,100,0xFF0000);
        }
        
        get graphics():Graphics{
            if(undefined == this.$graphics){
                this.$graphics = new Graphics(this);
            }
            return this.$graphics;
        }


        public render(camera:Camera,now:number,interval:number):void{
            
        }
    }



    export class Graphics{
        target:Sprite;
        byte:Float32Byte;
        constructor(target:Sprite){
            this.target = target;
            this.byte = new Float32Byte(new Float32Array(0))
        }

        private addPoint(position:number,x:number,y:number,z:number,u:number,v:number,index:number,r:number,g:number,b:number,a:number):void{
            this.byte.addPoint(position   ,x,y,z,0,0,0,r,g,b,a);
            this.target.hitArea.updateArea(x,y,z);
        }

        public drawRect(x:number, y:number,width:number, height:number,color:number,alpha:number = 1,z:number = 0):void{
            let red = (color & 0x00ff0000) >>> 16;
            let green = (color & 0x0000ff00) >>> 8;
            let blue = color & 0x000000ff;
            let r = x + width;
            let b = y + height;
            let p = this.byte.array.length;
            this.byte.length = p+40;
            this.addPoint(p   ,x,y,z,0,0,0,red,green,blue,alpha);
            this.addPoint(p+10,r,y,z,0,0,0,red,green,blue,alpha);
            this.addPoint(p+20,r,b,z,0,0,0,red,green,blue,alpha);
            this.addPoint(p+30,x,b,z,0,0,0,red,green,blue,alpha);
        }
    }




    export class Batcher implements I3DRender{
        target:Sprite;
        geometry:Link;
        currentGeometry:BatchGeometry;
        constructor(target:Sprite){
            this.target = target;
            this.geometry = new Link();
        }

        public render(camera:Camera,now:number,interval:number):void{
            if(this.target._change | DChange.vertex){

            }
        }

        batch(target:Sprite):void{
            this.cleanBatch();

        }

        cleanBatch():void{
            let vo  = this.geometry.getFrist();
            while(vo){
                if(vo.close == false){
                    let render:Recyclable<I3DRender> = vo.data;
                    if(render instanceof BatchGeometry){
                        render.recycle();
                    }
                    vo.close = true;
                }
                vo = vo.next;
            }
            this.geometry.clean();
        }
    }


    class BatchGeometry implements I3DRender,IGeometry{
        vertex:VertexInfo;
        index:Uint16Array;
        constructor(){
            this.vertex = new VertexInfo();
        }
        render(camera:Camera,now:number,interval:number):void{
            
        }

        onRecycle():void{
            this.vertex = undefined;
            this.index = undefined;
        }
    }
}