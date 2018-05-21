module rf{
    export class Scroll{
        vPixel:number = 1;
        hPixel:number = 1;
        target:Component;

        constructor(target:Component,w:number,h:number){
            this.target = target;
            target.rect = {x:0,y:0,w:w,h:h};
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
        }


        mouseUpHandler(event:EventX){
            ROOT.off(MouseEventX.MouseMove,this.mouseMoveHandler);
            ROOT.off(MouseEventX.MouseUp,this.mouseUpHandler);
        }


        mouseMoveHandler(event:EventX){
            let data:IMouseEventData = event.data;
            let{rect}=this.target;
            rect.x += data.ox;
            rect.y += data.oy;
        }

    }
}