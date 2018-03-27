/// <reference path="../com/youbt/rfreference.ts" />
module rf{
    export class WebglTest{
        constructor(){
            var canvas:HTMLCanvasElement = document.createElement("canvas");
            canvas.width = 500;
            canvas.height = 500;
            document.body.appendChild(canvas);
            var stage3d:Stage3D = singleton(Stage3D);
            var b:boolean = stage3d.requestContext3D(canvas);
            if(false == b){
                console.log("GL create fail");
                return;
            }
            
            this.render();
        }




        public render():void{
            context3D.clear(0,0,0,1)
        }





    }
}