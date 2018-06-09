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
        
        scroll:Scroll;

        step:number = 100;
        
		/**
		 * 组件拖动按钮所在区域实际大小
		 */
		// private _defaultLen:number;

		// private _maxPos:number;

		// private scrolltype:number;
		//btn_thumb有一个最小尺寸 暂定20

		/**
		 * 需要支持点击滚动 拖拽滚动 鼠标滚轮滚动
		 * 
		 */
		constructor(source?:BitmapSource){
			super(source);
		}

		bindComponents():void
		{
			// this.btn_up = _skin["btn_up"];
			// this.btn_down = _skin["btn_down"];
			// this.btn_thumb = _skin["btn_thumb"];
			// this.track = _skin["track"];
        }
        
        setSize(width:number, height:number){
            let{btn_down,track,btn_thumb,hitArea}=this;
            let sh = btn_down.h;
			let h =height - sh * 2;

			track.setSize(track.w,h);
			btn_thumb.setSize(btn_thumb.w,h);
			btn_down.y = h + sh;
			
			hitArea.clean();
            hitArea.updateArea(width, height, 0);
        }



        updateThumbSize(e?:EventX){

        }

        updateThumbPosition(e?:EventX){

        }


		/**
		 * 绑定滚动
		 * @param target target为异步内容时在初始化时宽高会异常 
		 * @param w 
		 * @param h 
		 */
		init(target:Sprite, w:number, h:number, scrolltype:number = ScrollType.H_SCROLL):void
		{
			// this.scrolltype = scrolltype;
			// this.target = target;
			// target.renderer = new BatchRenderer(target);
			// this._scroll = new Scroll(target, w, h);
			// this._scroll.hStep = 0;
			// this._scroll.vStep = 1;
			// this._scroll.areacheck = true;
			// target需要支持mousewheel事件
			// let {mouseWheelHandler, targetScrollHandler, upHandler, downHandler, mousedownHandler, targetresizeHandler} = this;
			// target.addEventListener(MouseEventX.MouseWheel, mouseWheelHandler, this);
			// target.on(EventT.RESIZE, targetresizeHandler,this);
			// this.scroll.addEventListener(EventT.SCROLL, targetScrollHandler, this);
			// this.btn_up.addClick(upHandler, this);
			// this.btn_down.addClick(downHandler, this);
			// this.btn_thumb.addEventListener(MouseEventX.MouseDown, mousedownHandler, this);
			// if(scrolltype == ScrollType.H_SCROLL)
			// {
			// 	this._defaultLen = w - this.btn_up.w - this.btn_down.w;
			// 	this.track.setSize(this._defaultLen, this.track.h);
			// 	this.btn_down.x = w - this.btn_down.w;
			// 	this._skin.setSize(w, this._skin.h);//这个地方需要对——skin重新赋值 目前因为使用setsize会锁定检测区域 因此需要重新赋值 
			// 	this._maxPos = this.btn_down.x - this.btn_thumb.w;
			// }else if(scrolltype == ScrollType.V_SCROLL){
			// 	this._defaultLen = h - this.btn_down.h - this.btn_up.h;
			// 	this.track.setSize(this.track.w, this._defaultLen);
			// 	this.btn_down.y = h - this.btn_down.h;
			// 	this._skin.setSize(this._skin.w, h);
			// 	this._maxPos = this.btn_down.y - this.btn_thumb.h;
			// }
		}

		protected targetresizeHandler(event:EventX):void
		{
			// let{w:width,h:height}=this.target;
			// let{scroll, _defaultLen, scrolltype} = this;
			// //重新计算btn_thumb的高度
			// let scrolldata:IScrollData = scrolltype == ScrollType.H_SCROLL ? scroll.hScroll : scroll.vScroll;
			// let max:number = scrolltype == ScrollType.H_SCROLL ? width : height;
			// let n:number = scrolldata.dlen / max;
			// let tracklen:number = Math.max(20, _defaultLen * n);//btn_thumb实际大小

			// if(scrolltype == ScrollType.H_SCROLL)
			// {
			// 	this.btn_thumb.setSize(tracklen, this.btn_thumb.h);
			// 	this._maxPos = this.btn_down.x - this.btn_thumb.w;
			// }else{
			// 	this.btn_thumb.setSize(this.btn_thumb.w, tracklen);
			// 	this._maxPos = this.btn_down.y - this.btn_thumb.h;
			// }
		}

		protected targetScrollHandler(event:EventX):void
		{
			//btn_thumb拖动就不需要进行计算了
			// let {scrolltype, _defaultLen, _maxPos} = this;
			// let drager:Drager = event.data;
			// let scrolldata:IScrollData = scrolltype == ScrollType.H_SCROLL ? drager.hScroll : drager.vScroll;
			// let pos:number = scrolldata.pos;
			// if(pos > 0)
			// {
			// 	pos = 0;
			// }
			// let n:number = Math.abs(pos / scrolldata.max);
			// let y:number = _defaultLen * n + this.btn_up.h;
			// if(y < this.btn_up.h)
			// {
			// 	y = this.btn_up.h;
			// }else if(y > _maxPos){
			// 	y = _maxPos;
			// }
			// this.btn_thumb.y = y;
		}

		protected mouseWheelHandler(event:EventX):void
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

		protected mousedownHandler(event:MouseEventX):void
		{
			ROOT.on(MouseEventX.MouseUp, this.mouseUpHandler, this);
			ROOT.on(MouseEventX.MouseMove, this.mouseMoveHandler, this)
		}

		protected mouseUpHandler(event:MouseEventX):void
		{
			ROOT.off(MouseEventX.MouseUp, this.mouseUpHandler);
			ROOT.off(MouseEventX.MouseMove, this.mouseMoveHandler);

		}

		
		protected mouseMoveHandler(event:EventX):void
		{
			let{ox,oy} = event.data;
			//检查鼠标位置
			//滚一次
			this.scroll.update(-ox, -oy);
			this.scroll.end();
		}
	}

	
}