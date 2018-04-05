/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
module rf {
    export class AppBase implements ITickable,IResizeable{
        constructor() {
            Engine.start();
            this.createSource();
            ROOT = singleton(Stage3D);
            Engine.addResize(this);
        }


        init(canvas?:HTMLCanvasElement):void{
           
            if(undefined == canvas){
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            var b:boolean = ROOT.requestContext3D(canvas);
            if(false == b){
                console.log("GL create fail");
                return;
            }

            

            Engine.addTick(this);
        }

        createSource():void{
            let bmd = new BitmapData(2048,2048,true);
            let source = new BitmapSource().create("component",bmd,true);
            let vo = source.setSourceVO("origin",1,1);
            bmd.fillRect(vo.x,vo.y,vo.w,vo.h,"rgba(255,255,255,255)");
            source.originU = vo.ul;
            source.originV = vo.vt;
            componentSource = source;
        }


        public update(now: number, interval: number): void {
            //todo
            ROOT.update(now,interval);
        }

        public resize(width:number,height:number):void{
            ROOT.resize(width,height);
        }

    }
}