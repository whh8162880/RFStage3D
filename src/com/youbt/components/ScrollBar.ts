module rf{
    export const enum ScrollType{
		H_SCROLL,
		V_SCROLL
	}


    export class ScrollBar extends Component{
		btn_up:Button;
		btn_down:Button;
		btn_thumb:Button;
		track:Component;
		
		step:number = 100;
		
		bindComponents(){
			this.on(MouseEventX.MouseWheel,this.mouseWheelHandler,this);
		}

		bindScroll(scroll:Scroll){
			this.scroll = scroll;
			//vScrollBar
			scroll.bind(this.btn_thumb,0,-1);

			this.updateThumb();

			scroll.on(EventT.SCROLL,this.updateThumb,this);
		}
		
        setSize(width:number, height:number){
            let{btn_down,track,btn_thumb,hitArea,scroll}=this;
            let sh = btn_down.h;
			let h =height - sh * 2;
			track.setSize(track.w,h);
			btn_down.y = h + sh;
			hitArea.clean();
			hitArea.updateArea(width, height, 0);

			if(scroll){
				this.updateThumb();
			}
		}
		
        updateThumb(e?:EventX){
			let{btn_down,track,btn_thumb,scroll}=this;
			let{vScroll}=scroll;
			let{dlen,mlen,max,pos}=scroll.vScroll;
			let h = track.h;

			let p = Math.min(1,dlen / mlen);
			btn_thumb.setSize(btn_thumb.w,h * p);

			btn_thumb.y =  btn_down.h + (pos / mlen) * h

        }


		mouseWheelHandler(event:EventX)
		{
			let data:IMouseEventData = event.data;
			// data.wheel
		}

		protected upHandler(event:MouseEventX):void
		{
			//计算一下是否超界
			let sdata:IScrollData = this.scroll.vScroll;
			let {step} = this;
			this.scroll.update(0, step);
			this.scroll.end();
		}

		protected downHandler(event:MouseEventX):void
		{
			let {step} = this;
			this.scroll.update(0, -step);
			this.scroll.end();
		}


	}
}