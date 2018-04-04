///<reference path="./Stage3D.ts" />
module rf{
    export class Mouse{
        init():void{
            let canvas = ROOT.canvas;
            // canvas.onmousemove = this.mouseMoveHandler;
            canvas.onmousedown = this.mouseHanlder;
            canvas.onmouseup = this.mouseHanlder;
            canvas.onmousewheel = this.mouseHanlder;

            canvas.onmousemove = this.mouseMoveHandler;

            ROOT.addEventListener(MouseEventX.MouseDown,function (e:EventX):void{
                console.log(e);
            })
        }

        preMouseTime:number;
        preMoveTime:number;
        preTarget:DisplayObject;
        preMouseDownTime:number;
        mouseHanlder(e:MouseEvent):void{
            var d:DisplayObject;
            if(this.preMouseTime != engineNow){
                this.preMouseTime = engineNow;
                d = ROOT.getMouseTarget(e.clientX,e.clientY,1)
            }else{
                d = this.preTarget;
            }

            if(undefined != d){
                d.simpleDispatch(e.type,e,true);
            }
        }


        mouseMoveHandler(e:MouseEvent):void{
            if(this.preMoveTime == engineNow){
                return;
            }
            let d = ROOT.getMouseTarget(e.clientX,e.clientY,1);
            if(undefined != d){
                d.simpleDispatch(MouseEventX.MouseMove,e,true)
            }
        }
    }
}