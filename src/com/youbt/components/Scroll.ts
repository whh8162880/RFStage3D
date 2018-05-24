/// <reference path="../stage3d/display/Component.ts" />
module rf{

    export interface IScrollData{
        nlen:number;
        olen:number;
        pos:number;
        max:number;
        min:number;
    }

    export class Scroll{
        vStep:number = 1;
        hStep:number = 1;

        vScroll:IScrollData;
        hScroll:IScrollData;

        rect:Size;
        target:RenderBase;
        tweener:ITweener;
        areacheck:boolean = true;

        constructor(target:RenderBase,w:number,h:number){
            this.target = target;
            target.addEventListener(EventT.RESIZE,this.resizeHandler,this);
            target.scrollRect = this.rect = {x:0,y:0,w:w,h:h};
            this.doEnabled();
            this.resizeHandler();
        }

        resizeHandler(event?:EventX):void{
            let{vStep,hStep,vScroll,hScroll}=this;
            let{w:width,h:height}=this.target;
            let{w,h}=this.rect; 
            if(hStep > 0){
                if(!hScroll){
                    this.hScroll = hScroll = {nlen:w,olen:width,min:0,max:Math.max(0,width-w)} as IScrollData;
                }
            }

            if(vStep > 0){
                if(!vScroll){
                    this.vScroll = vScroll = {nlen:h,olen:height,min:0,max:Math.max(0,height-h)} as IScrollData;
                }
            }
           
        }

        _enabled:boolean = true;
		set enabled(value:boolean){if(this._enabled == value){return;}this._enabled = value;this.doEnabled();}
		get enabled():boolean{return this._enabled;}
		doEnabled():void{
            let{_enabled,target,mouseDownHandler}=this;
            if(_enabled){
                target.on(MouseEventX.MouseDown,mouseDownHandler,this)
            }else{
                target.off(MouseEventX.MouseDown,mouseDownHandler)
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

            let{vStep,hStep,target,areacheck,rect}=this;
            let{w:width,h:height}=target;
            let{x,y,w,h}=rect;

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
                let tweener = tweenTo(o,200,defaultTimeMixer,rect);
                tweener.thisObj = this;
                tweener.update = this.refreshScroll;
                this.tweener = tweener;
            }
        }


        mouseMoveHandler(event:EventX){
            let data:IMouseEventData = event.data;
            let{vStep,hStep,rect}=this;
            if(hStep > 0){
                rect.x += data.ox;
            }
            if(vStep > 0){
                rect.y += data.oy;
            }
            this.refreshScroll();
        }

        refreshScroll(tweener?:ITweener){
            let{hStep,vStep,rect,hScroll,vScroll}=this;
            let{w:width,h:height}=this.target;
            let{x,y,w,h}=rect;
            if(hStep > 0){
                let{nlen,olen,min,max,pos}=hScroll
                if(x > min){
                    olen = width + x;
                }else if(x < -max){
                    olen = width - x;
                }else{
                    olen = width;
                }
                console.log(nlen.toFixed(2),olen.toFixed(2));
            }

            if(vStep > 0){

            }
        }

    }
}