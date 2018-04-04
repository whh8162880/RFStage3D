///<reference path="./Stage3D.ts" />
module rf{
    export class Mouse{
        init():void{
            let canvas = ROOT.canvas;
            // canvas.onmousemove = this.mouseMoveHandler;
            canvas.onmousedown = this.mouseMoveHandler;
        }

        mouseMoveHandler(e:MouseEvent):void{
           let mx = e.clientX;
           let my = e.clientY;
           let d = ROOT.checkmouse(mx,my,1);
           console.log(d);
        }
    }
}