/// <reference path="../com/youbt/rfreference.ts" />
module rf{
    export class WebglTest implements IResizeable{
        constructor(){
            var canvas:HTMLCanvasElement = document.createElement("canvas");
            document.body.appendChild(canvas);
            var stage3d:Stage3D = singleton(Stage3D);
            var b:boolean = stage3d.requestContext3D(canvas);
            if(false == b){
                console.log("GL create fail");
                return;
            }
            Engine.addResize(this);
        }




        public render():void{
            context3D.configureBackBuffer(stageWidth,stageHeight,0);
            context3D.clear(0,0,0,1);
        }


        public resize(width:number,height:number):void{
           this.render();
        }


    }
}