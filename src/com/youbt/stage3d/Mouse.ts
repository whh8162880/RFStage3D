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
        clickTarget:DisplayObject;
        preMouseDownTime:number;
        mouseHanlder(e:MouseEvent):void{
            var d:DisplayObject;
            let now = engineNow;
            if(this.preMouseTime != now){
                this.preMouseTime = now;
                d = ROOT.getObjectByPoint(e.clientX,e.clientY,1)
            }else{
                d = this.preTarget;
            }
            if(undefined != d){
                let type = e.type;
                if(type == MouseEventX.MouseDown){
                    this.clickTarget = d;
                    this.preMouseDownTime = now;
                }else if(type == MouseEventX.MouseUp){
                    d.simpleDispatch(e.type,event,true);
                    if(this.clickTarget != d){
                        this.clickTarget = null;
                        this.preMouseDownTime = 0;
                    }else if(now - this.preMouseDownTime < 500){
                        d.simpleDispatch(MouseEventX.CLICK,e,true);
                    }
                    return;
                }
                

                d.simpleDispatch(e.type,e,true);


                
            }
        }


        mouseMoveHandler(e:MouseEvent):void{
            if(this.preMoveTime == engineNow){
                return;
            }
            let d = ROOT.getObjectByPoint(e.clientX,e.clientY,1);
            if(undefined != d){
                d.simpleDispatch(MouseEventX.MouseMove,e,true)
            }
        }
    }
}