/// <reference path="../stage3d/display/Component.ts" />
module rf{

    export interface IScrollData{
        dlen:number;//裁剪尺寸
        mlen:number;//原始尺寸
        pos:number;//位移后的坐标
        max:number;
    }


    export class Drager extends MiniDispatcher{
        vStep:number = 1;
        hStep:number = 1;
        vScroll:IScrollData;
        hScroll:IScrollData;

        rect:Size

        width:number;
        height:number;

        target:RenderBase;
        tweener:ITweener;
        areacheck:boolean = false;
        dragTarget:boolean = false;

        updateScroll(scroll:IScrollData,dlen:number,mlen:number){
            scroll.dlen = dlen;
            scroll.mlen = mlen;
            scroll.max = Math.max(0,mlen-dlen);
            return scroll;
        }

        setArea(w:number,h:number,width:number,height:number){
            let{rect,hStep,vStep,updateScroll,dragTarget,target}=this;

            if(!rect){
                this.rect = rect = {x:0,y:0,w:w,h:h};
            }else{
                rect.w = w;
                rect.h = h;
            }

            if(dragTarget){
                rect.x = target.x;
                rect.y = target.y;
            }

            this.width = width;
            this.height = height;
            if(hStep > 0){
                let{hScroll} = this;
                if(!hScroll){
                    this.hScroll = hScroll = {} as IScrollData;
                }
                updateScroll(hScroll,w,width);
            }

            if(vStep > 0){
                let{vScroll} = this;
                if(!vScroll){
                    this.vScroll = vScroll = {} as IScrollData;
                }
                updateScroll(vScroll,h,height);
            }
            return this;
        }


        start(){
            let{tweener}=this;
            if(tweener){
                tweenEnd(tweener);
                this.tweener = undefined;
            }
        }


        update(ox:number,oy:number){
            let{vStep,hStep,rect}=this;
            if(hStep > 0){
                rect.x += ox;
            }
            if(vStep > 0){
                rect.y += oy;
            }
            this.refreshScroll();
        }


        end(){
            let{vStep,hStep,areacheck,rect,width,height}=this;
            let{x,y,w,h}=rect;
            let o;
            if(hStep > 1){
                let dx = x % hStep;
                if(Math.abs(dx) > hStep * .5){
                    if(dx > 0){
                        dx = Math.ceil(x / hStep) * hStep;
                    }else{
                        dx = Math.floor(x / hStep) * hStep;
                    }
                }else{
                    if(dx > 0){
                        dx = Math.floor(x / hStep) * hStep;
                    }else{
                        dx = Math.ceil(x / hStep) * hStep;
                    }
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
                    if(dy > 0){
                        dy = Math.ceil(y / vStep) * vStep;
                    }else{
                        dy = Math.floor(y / vStep) * vStep;
                    }
                }else{
                    if(dy > 0){
                        dy = Math.floor(y / vStep) * vStep;
                    }else{
                        dy = Math.ceil(y / vStep) * vStep;
                    }
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
                    if(x + w > width ){
                        if(!o){
                            o = {x:width-w};
                        }else{
                            o.x = width - w;
                        }   
                    }else if(x < 0){
                        if(!o){
                            o = {x:0};
                        }else{
                            o.x = 0;
                        } 
                    }
                }
                
                if(vStep > 0){
                    if(y + h > height ){
                        if(!o){
                            o = {y:height - h};
                        }else{
                            o.y =  height - h;
                        }   
                    }else if(y < 0){
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
            }else{
                this.refreshScroll();
            }
        }




        bind(target:RenderBase,drager:boolean){
            let{target:t,mouseDownHandler}=this;
            if(t == target){
                return;
            }
            if(t){
                t.off(MouseEventX.MouseDown,mouseDownHandler);
            }
            this.target = target;
            target.on(MouseEventX.MouseDown,mouseDownHandler,this);
            this.dragTarget = drager;
            return this;
        }


        mouseDownHandler(event:EventX){
            let{mouseMoveHandler,mouseUpHandler}=this;
            ROOT.on(MouseEventX.MouseMove,mouseMoveHandler,this);
            ROOT.on(MouseEventX.MouseUp,mouseUpHandler,this);
            this.start();
        }


        mouseUpHandler(event:EventX){
            ROOT.off(MouseEventX.MouseMove,this.mouseMoveHandler);
            ROOT.off(MouseEventX.MouseUp,this.mouseUpHandler);
            this.end();
        }


        mouseMoveHandler(event:EventX){
            let{ox,oy} = event.data;
            this.update(ox,oy);
        }

        refreshScroll(tweener?:ITweener){
            let{hStep,vStep,rect,width,height,dragTarget,target}=this;
            let{x,y,w,h}=rect;
            if(hStep > 0){
                let{hScroll:scroll}=this;
                let{max}=scroll
                if(x > 0){
                    scroll.mlen = width + x;
                    scroll.pos = max;
                }else if(x < -max){
                    scroll.mlen = width - x;
                    scroll.pos = 0;
                }else{
                    scroll.mlen = width;
                    scroll.pos = x;
                }

                this.hScroll.pos = scroll.pos;
            }

            if(vStep > 0){
                let{hScroll:scroll}=this;
                let{max}=scroll
                if(y > 0){
                    scroll.mlen = height + y;
                    scroll.pos = max;
                }else if(y < -max){
                    scroll.mlen = height - y;
                    scroll.pos = 0;
                }else{
                    scroll.mlen = height;
                    scroll.pos = y;
                }

                this.vScroll.pos = scroll.pos;
            }
            this.simpleDispatch(EventT.SCROLL,this);

            if(dragTarget){
                target.setPos(x,y);
            }
        }

    }


    export class Scroll extends Drager{
        constructor(target:RenderBase,w:number,h:number){
            super();
            this.areacheck = true;
            this.bind(target,false);
            if(target.states | DChange.area){
                target.updateHitArea();
            }

            let{w:width,h:height}=target;
            this.setArea(w,h,width,height);
            target.scrollRect = this.rect;
            target.on(EventT.RESIZE,this.resizeHandler,this);
        }

        resizeHandler(event?:EventX):void{
            let{w:width,h:height}=this.target;
            let{w,h}=this.rect; 
            this.setArea(w,h,width,height);
        }


        end(){
            let{vStep,hStep,areacheck,rect,width,height}=this;
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
            }else{
                this.refreshScroll();
            }
        }
    }
}