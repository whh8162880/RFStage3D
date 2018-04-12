///<reference path="./Stage3D.ts" />
module rf{
    interface IMouseElement{
        target:DisplayObject
        time:number;
        down:number;
        up:number;
        click:number;
    }

    interface ITouchlement{
        id:number;
        x:number;
        y:number;
        target:DisplayObject;
        timer:number;
        
    }
    export class Mouse{
        
        init(mobile:boolean):void{

            let mouseElement = this.mouseElement;
            mouseElement[0] = {target:undefined,time:0,down:MouseEventX.MouseDown,up:MouseEventX.MouseUp,click:MouseEventX.CLICK};
            mouseElement[1] = {target:undefined,time:0,down:MouseEventX.MouseMiddleDown,up:MouseEventX.MouseMiddleUp,click:MouseEventX.middleClick};
            mouseElement[2] = {target:undefined,time:0,down:MouseEventX.MouseRightDown,up:MouseEventX.MouseRightUp,click:MouseEventX.RightClick};

            let canvas = ROOT.canvas;
            
            if(false == mobile){
                canvas.addEventListener("mousedown",this.mouseHanlder);
                canvas.addEventListener("mouseup",this.mouseHanlder);
                // canvas.onmousedown = this.mouseHanlder;
                // canvas.onmouseup = this.mouseHanlder;
                canvas.onmousewheel = this.mouseHanlder;
                canvas.onmousemove = this.mouseMoveHandler;
                canvas.oncontextmenu = function (event){
                    event.preventDefault();
                }
            }else{
                canvas.ontouchstart = this.touchHandler;
                canvas.ontouchmove = this.touchMoveHandler;
                canvas.ontouchend = this.touchHandler;
            }

            

            
        }
        
        preMouseTime:number;
        preMoveTime:number;
        preTarget:DisplayObject;

        mouseElement:{ [key:number]:IMouseElement } = {};

        touchElement:{ [key:number]:ITouchlement } = {};

        mouseHanlder( e ):void{
            let mouse = MouseInstance;
            let mouseX = e.clientX * pixelRatio;
            let mouseY = e.clientY * pixelRatio;

           

            nativeMouseX = mouseX;
            nativeMouseY = mouseY;
            var d:DisplayObject;
            let now = engineNow;
            let numType = 0;
            let element:IMouseElement;
            if(mouse.preMouseTime != now){
                mouse.preMouseTime = now;
                d = ROOT.getObjectByPoint(mouseX,mouseY,1)
            }else{
                d = mouse.preTarget;
            }
            if(undefined != d){
                let data = recyclable(MouseEventData);
                data.id = e.button;
                data.x = mouseX;
                data.y = mouseY;
                data.ctrl = e.ctrlKey;
                data.alt = e.altKey;
                data.shift = e.shiftKey;

                let type = e.type;
                if(type == "mousedown"){
                    //判断左右按键
                    element = mouse.mouseElement[data.id];
                    element.target = d;
                    element.time = now;
                    d.simpleDispatch(element.down,data,true);
                }else if(type == "mouseup"){
                    element = mouse.mouseElement[data.id];
                    d.simpleDispatch(element.up,event,true);
                    if(element.target == d && now - element.time < 500){
                        d.simpleDispatch(element.click,data,true);
                    }
                    element.target = null;
                    element.time = 0;
                }else{
                    data.wheel = e.deltaY
                    d.simpleDispatch(MouseEventX.MouseWheel,data,true);
                }
                
                data.recycle();
            }

            
        }

        preRolled:DisplayObject;
		preMouseMoveTime:number;
        mouseMoveHandler( e ):void{
            let mouse = MouseInstance;
            if(mouse.preMoveTime == engineNow){
                return;
            }
           
            let r = ROOT;
            let mouseX = e.clientX * pixelRatio;
            let mouseY = e.clientY * pixelRatio;
            nativeMouseX = mouseX;
            nativeMouseY = mouseY;

            let d = r.getObjectByPoint(mouseX,mouseY,1);
            if(undefined != d){
                let data = recyclable(MouseEventData);
                data.id = e.button;
                data.x = mouseX;
                data.y = mouseY;
                data.ctrl = e.ctrlKey;
                data.alt = e.altKey;
                data.shift = e.shiftKey;
                data.dx = (e.movementX || e.mozMovementX || e.webkitMovementX || 0) * pixelRatio;
                data.dy = (e.movementY || e.mozMovementY || e.webkitMovementY || 0) * pixelRatio;
                d.simpleDispatch(MouseEventX.MouseMove,data,true);
                data.recycle();
            }
        }


        touchHandler(e:TouchEvent):void{
            let mouse = MouseInstance;
            let touch = e.changedTouches[0];


            console.log(e.type,e.changedTouches.length);
        }

        touchMoveHandler(e:TouchEvent):void{
            let mouse = MouseInstance;
        }
    }



    export const MouseInstance = new Mouse();
}
