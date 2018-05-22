/// <reference path="../stage3d/display/Component.ts" />
module rf{
    export class Scroll{
        vStep:number = 1;
        hStep:number = 1;
        target:RenderBase;
        tweener:ITweener;
        areacheck:boolean = true;

        constructor(target:RenderBase,w:number,h:number){
            this.target = target;
            target.scrollRect = {x:0,y:0,w:w,h:h};
            this.doEnabled();
        }

        _enabled:boolean = true;
		set enabled(value:boolean){if(this._enabled == value){return;}this._enabled = value;this.doEnabled();}
		get enabled():boolean{return this._enabled;}
		doEnabled():void{
            let{_enabled,target}=this;
            if(_enabled){
                target.on(MouseEventX.MouseDown,this.mouseDownHandler,this)
            }
        }


        mouseDownHandler(event:EventX){
            ROOT.on(MouseEventX.MouseMove,this.mouseMoveHandler,this);
            ROOT.on(MouseEventX.MouseUp,this.mouseUpHandler,this);
            let{tweener}=this;
            if(tweener){
                tweenEnd(tweener);
                this.tweener = undefined;
            }
        }


        mouseUpHandler(event:EventX){
            ROOT.off(MouseEventX.MouseMove,this.mouseMoveHandler);
            ROOT.off(MouseEventX.MouseUp,this.mouseUpHandler);

            let{vStep,hStep,target,areacheck}=this;
            let{scrollRect,w:width,h:height}=target;
            let{x,y,w,h}=scrollRect;

            let o;

            if(hStep > 1){
                let dx = x % hStep;
                if(Math.abs(dx) > hStep * .5){
                    dx = Math.floor(x / hStep) * hStep;
                }else{
                    dx = Math.ceil(x / hStep) * hStep;
                }
                x = dx;
                if(!o){
                    o = {x:dx};
                }else{
                    o.x = dx;
                } 
            }


            if(vStep > 1){
                let dy = y % vStep;
                if(Math.abs(dy) > vStep * .5){
                    dy = Math.floor(y / vStep) * vStep;
                }else{
                    dy = Math.ceil(y / vStep) * vStep;
                }
                y = dy;
                if(!o){
                    o = {y:dy};
                }else{
                    o.y = dy;
                }
            }



            if(areacheck){
                if(hStep > 0){
                    if(x + width < w ){
                        if(!o){
                            o = {x:w - width};
                        }else{
                            o.x = w - width;
                        }   
                    }else if(x > 0){
                        if(!o){
                            o = {x:0};
                        }else{
                            o.x = 0;
                        } 
                    }
                }
                
                if(vStep > 0){
                    if(y + height < h ){
                        if(!o){
                            o = {y:h - height};
                        }else{
                            o.y = h - height;
                        }   
                    }else if(y > 0){
                        if(!o){
                            o = {y:0};
                        }else{
                            o.y = 0;
                        } 
                    }
                }
            }

            
            

            if(o){
                this.tweener = tweenTo(o,200,defaultTimeMixer,scrollRect);
            }
        }


        mouseMoveHandler(event:EventX){
            let data:IMouseEventData = event.data;
            let{scrollRect}=this.target;
            let{vStep,hStep}=this;
            if(hStep > 0){
                scrollRect.x += data.ox;
            }
            if(vStep > 0){
                scrollRect.y += data.oy;
            }
        }

    }
}