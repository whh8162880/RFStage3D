/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
module rf {
    export class AppBase implements ITickable,IResizeable{
        constructor() {
            Engine.start();
            ROOT = singleton(Stage3D);
            Engine.addResize(this);
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