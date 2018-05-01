///<reference path="./Stage3D.ts" />
module rf{
    interface IMouseElement{
        target:DisplayObject
        time:number;
        down:number;
        up:number;
        click:number;
        over?:number;
        out?:number;
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
            // touchElement[0] = {target:undefined,time:0,data:new MouseEventData(0)};
            // touchElement[1] = {target:undefined,time:0,data:new MouseEventData(1)};
            // touchElement[2] = {target:undefined,time:0,data:new MouseEventData(2)};
            // touchElement[3] = {target:undefined,time:0,data:new MouseEventData(3)};
            // touchElement[4] = {target:undefined,time:0,data:new MouseEventData(4)};
            // touchElement[5] = {target:undefined,time:0,data:new MouseEventData(5)};
            // touchElement[6] = {target:undefined,time:0,data:new MouseEventData(6)};
            // touchElement[7] = {target:undefined,time:0,data:new MouseEventData(7)};
            // touchElement[8] = {target:undefined,time:0,data:new MouseEventData(8)};
            // touchElement[9] = {target:undefined,time:0,data:new MouseEventData(9)};

            let _this = this;
            function m(e){
                _this.mouseHanlder(e);
            };
            
            let canvas = ROOT.canvas;
            
            if(false == mobile){
                canvas.onmousedown = m;
                canvas.onmouseup = m;
                canvas.onmousewheel = m;
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
                }else if(type == "mousewheel"){
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

                let{preRolled}=mouse;

                if(preRolled != d)
                {
                    if(undefined != preRolled){
                        preRolled.mouseroll = false;
                        preRolled.simpleDispatch(MouseEventX.ROLL_OUT,data,true);
                    }
                    if(d){
                        d.mouseroll = true;
                        d.simpleDispatch(MouseEventX.ROLL_OVER,data,true);
                    }
                    mouse.preRolled = d;
                }

                data.recycle();
            }
        }


        touchHandler(e:TouchEvent):void{
            let mouse = MouseInstance;
            const{touchElement:elements,touchLen,touchCenterY:centerY}=mouse;
            var touch = e.changedTouches[0];
            let touches =  e.touches;
            let element:ITouchlement;
            let data:MouseEventData;

            let now = engineNow;
            let d:DisplayObject;

            let mouseX = touch.clientX * pixelRatio;
            let mouseY = touch.clientY * pixelRatio;
            nativeMouseX = mouseX;
            nativeMouseY = mouseY;

            element = elements[touch.identifier];
            if(undefined == element){
                elements[touch.identifier] =  element = {target:undefined,time:0,data:new MouseEventData(touch.identifier)}
            } 
            data = element.data;
            data.dx = mouseX - data.x;
            data.dy = mouseY - data.y;
            data.x = mouseX;
            data.y = mouseY;

            if(touches.length == 2){
                const{clientX:x0,clientY:y0}=touches[0];
                const{clientX:x1,clientY:y1}=touches[1];
                let x = (x0 + x1) / 2;
                let y = (y0 + y1) / 2;
                let dx = x1 - x0;
                let dy = y1 - y0;
                let len = Math.sqrt(dx * dx + dy * dy);
                mouse.touchCenterY = y;
                mouse.touchLen = len;
            }

           
            if(mouse.preMouseTime != now){
                mouse.preMouseTime = now;
                d = ROOT.getObjectByPoint(mouseX,mouseY,1)
            }else{
                d = mouse.preTarget;
            }

            if(undefined != d){
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


        touchCenterY:number = 0;
        touchLen:number = 0;
        touchMoveHandler(e:TouchEvent):void{
            let mouse = MouseInstance;
            let now = engineNow;
            if(mouse.preMoveTime == now){
                return;
            }
            mouse.preMoveTime = now;

            let{touchElement:elements,touchCenterY:centerY,touchLen,preTarget}=mouse;
            const{touches,changedTouches}=e;
            let element:ITouchlement;
            let data;
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
            }else if(len == 2){
                if(undefined == preTarget){
                    preTarget = ROOT;
                }
                const{clientX:x0,clientY:y0}=touches[0];
                const{clientX:x1,clientY:y1}=touches[1];
                let x = (x0 + x1) / 2;
                let y = (y0 + y1) / 2;

                let dx = x1 - x0;
                let dy = y1 - y0;
                len = Math.sqrt(dx * dx + dy * dy);

                let dlen = (touchLen-len) / pixelRatio;
                dy = (y - centerY) / pixelRatio;

                if(Math.abs(dlen) > 1.0){
                    //scale
                    let data = recyclable(MouseEventData);
                    data.x = x;
                    data.y = y;
                    data.wheel = dlen > 0 ? 120 : -120;
                    preTarget.simpleDispatch(MouseEventX.MouseWheel,data,true);
                    // console.log( "scale" , dlen.toFixed(2));
                    data.recycle();
                }else if(Math.abs(dy) > 1.0){
                    let data = recyclable(MouseEventData);
                    data.x = x;
                    data.y = y;
                    data.wheel = dy > 0 ? 120 : -120;
                    preTarget.simpleDispatch(MouseEventX.MouseWheel,data,true);
                    // console.log( "scale" , dlen.toFixed(2));
                    data.recycle();
                }

                mouse.touchCenterY = y;
                mouse.touchLen = len;

                

            }


            
            
            
        }
    }



    export const MouseInstance = new Mouse();
}

