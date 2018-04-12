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
        target:DisplayObject;
        time:number;
        data:MouseEventData;
        
    }
    export class Mouse{
        
        init(mobile:boolean):void{

            const{touchElement,mouseElement} = this;
            mouseElement[0] = {target:undefined,time:0,down:MouseEventX.MouseDown,up:MouseEventX.MouseUp,click:MouseEventX.CLICK};
            mouseElement[1] = {target:undefined,time:0,down:MouseEventX.MouseMiddleDown,up:MouseEventX.MouseMiddleUp,click:MouseEventX.middleClick};
            mouseElement[2] = {target:undefined,time:0,down:MouseEventX.MouseRightDown,up:MouseEventX.MouseRightUp,click:MouseEventX.RightClick};

            //10个指头应该够了吧
            touchElement[0] = {target:undefined,time:0,data:new MouseEventData(0)};
            touchElement[1] = {target:undefined,time:0,data:new MouseEventData(1)};
            touchElement[2] = {target:undefined,time:0,data:new MouseEventData(2)};
            touchElement[3] = {target:undefined,time:0,data:new MouseEventData(3)};
            touchElement[4] = {target:undefined,time:0,data:new MouseEventData(4)};
            touchElement[5] = {target:undefined,time:0,data:new MouseEventData(5)};
            touchElement[6] = {target:undefined,time:0,data:new MouseEventData(6)};
            touchElement[7] = {target:undefined,time:0,data:new MouseEventData(7)};
            touchElement[8] = {target:undefined,time:0,data:new MouseEventData(8)};
            touchElement[9] = {target:undefined,time:0,data:new MouseEventData(9)};


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
                canvas.ontouchcancel = this.touchHandler
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
            let now = engineNow;
            if(mouse.preMoveTime == now){
                return;
            }
            mouse.preMoveTime = now;
           
            let mouseX = e.clientX * pixelRatio;
            let mouseY = e.clientY * pixelRatio;
            nativeMouseX = mouseX;
            nativeMouseY = mouseY;

            let d = ROOT.getObjectByPoint(mouseX,mouseY,1);
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
            const{touchElement:elements}=mouse;
            let touch = e.changedTouches[0];
            let element:ITouchlement;
            let data:MouseEventData;

            let now = engineNow;
            let d:DisplayObject;

            let mouseX = touch.clientX * pixelRatio;
            let mouseY = touch.clientY * pixelRatio;
            nativeMouseX = mouseX;
            nativeMouseY = mouseY;

            if(mouse.preMouseTime != now){
                mouse.preMouseTime = now;
                d = ROOT.getObjectByPoint(mouseX,mouseY,1)
            }else{
                d = mouse.preTarget;
            }

            if(undefined != d){
                element = elements[touch.identifier];
                data = element.data;
                data.dx = mouseX - data.x;
                data.dy = mouseY - data.y;
                data.x = mouseX;
                data.y = mouseY;
                if(e.type == "touchstart"){
                    if(true == d.mousedown){
                        return;
                    }
                    element.target = d;
                    element.time = now;
                    d.mousedown = true;
                    d.simpleDispatch(MouseEventX.MouseDown,data,true);
                }else{
                    if(false == d.mousedown){
                        return;
                    }
                    d.mousedown = false;
                    d.simpleDispatch(MouseEventX.MouseUp,data,true);
                    if(element.target == d && now - element.time < 500){
                        d.simpleDispatch(MouseEventX.CLICK,data,true);
                    }

                }
            }
        }

        touchMoveHandler(e:TouchEvent):void{
            let mouse = MouseInstance;
            let now = engineNow;
            if(mouse.preMoveTime == now){
                return;
            }
            mouse.preMoveTime = now;

            const{touchElement:elements}=mouse;
            const{touches,changedTouches}=e;
            let element:ITouchlement;
            let data:MouseEventData;
            let len = touches.length;
            if(len == 1){
                let touch = changedTouches[0];
                let mouseX = touch.clientX * pixelRatio;
                let mouseY = touch.clientY * pixelRatio;
                nativeMouseX = mouseX;
                nativeMouseY = mouseY;
                let d = ROOT.getObjectByPoint(mouseX,mouseY,1);
                if(undefined != d){
                    element = elements[touch.identifier];
                    data = element.data;
                    data.dx = mouseX - data.x;
                    data.dy = mouseY - data.y;
                    data.x = mouseX;
                    data.y = mouseY;
                    d.simpleDispatch(MouseEventX.MouseMove,data,true);
                }
                return;
            }else{
                // let x = 0;
                // let y = 0;
                // for(let i=0;i<len;i++){
                //     let touch = touches[i];
                // }
            }


            
            
            
        }
    }



    export const MouseInstance = new Mouse();
}
