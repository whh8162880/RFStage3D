/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
module rf {
    export class AppBase implements ITickable,IResizeable{
        constructor() {
            Engine.start();
            ROOT = singleton(Stage3D);
            Engine.addResize(this);
        }


        init(cancas?:HTMLCanvasElement):void{
            if(undefined == cancas){
                var canvas:HTMLCanvasElement = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            var b:boolean = ROOT.requestContext3D(canvas);
            if(false == b){
                console.log("GL create fail");
                return;
            }
            Engine.addTick(this);
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