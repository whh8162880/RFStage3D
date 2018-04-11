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

            canvas.ontouchstart = this.touchHandler;
            canvas.ontouchmove = this.touchHandler;
            canvas.ontouchend = this.touchHandler;
            canvas.ontouchcancel = this.touchHandler;

            canvas.oncontextmenu = function (event){
                event.preventDefault();
            }
        }

        preMouseTime:number;
        preMoveTime:number;
        preTarget:DisplayObject;
        clickTarget:DisplayObject;
        preMouseDownTime:number;
        mouseHanlder(e:MouseEvent):void{

            nativeMouseX = e.clientX * pixelRatio;
            nativeMouseY = e.clientY * pixelRatio;

            var d:DisplayObject;
            let now = engineNow;
            if(this.preMouseTime != now){
                this.preMouseTime = now;
                d = ROOT.getObjectByPoint(ROOT.mouseX,ROOT.mouseY,1)
            }else{
                d = this.preTarget;
            }
            if(undefined != d){
                let type = e.type;
                if(type == MouseEventX.MouseDown){
                    this.clickTarget = d;
                    this.preMouseDownTime = now;
                }else if(type == MouseEventX.MouseUp){
                    d.simpleDispatch(type,event,true);
                    if(this.clickTarget != d){
                        this.clickTarget = null;
                        this.preMouseDownTime = 0;
                    }else if(now - this.preMouseDownTime < 500){
                        d.simpleDispatch(MouseEventX.CLICK,e,true);
                    }
                    return;
                }
                d.simpleDispatch(type,e,true);
            }
        }

        preRolled:DisplayObject;
		preMouseMoveTime:number;
        mouseMoveHandler(e:MouseEvent):void{
            let r = ROOT;
            nativeMouseX = e.clientX * pixelRatio;
            nativeMouseY = e.clientY * pixelRatio;
            if(this.preMoveTime == engineNow){
                return;
            }
            let d = r.getObjectByPoint(r.mouseX,r.mouseY,1);
            if(undefined != d){
                d.simpleDispatch(MouseEventX.MouseMove,e,true)
            }
        }



        touchHandler(e:TouchEvent):void{
            console.log(e);
        }
    }
}
