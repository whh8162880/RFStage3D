///<reference path="./Sprite.ts" />
/// <reference path="../../components/Scroll.ts" />
module rf{


	export const enum SymbolConst{
		SYMBOL = 0,
		BITMAP = 1,
		TEXT = 2,
		RECTANGLE = 3
	}

    export class Component extends Sprite{
        constructor(source?:BitmapSource){
			super(source);
		}
		
        currentClip:number;

		symbol:IDisplaySymbol;
		
		sceneMatrix:IMatrix;

		setSymbol(symbol:IDisplaySymbol,matrix?:IMatrix):void{
			this.symbol = symbol;
			if(!symbol){
				const{graphics}=this;
				graphics.clear();
				graphics.end();
				return;
			}
			this.x = symbol.x;
			this.y = symbol.y;
			this.gotoAndStop(symbol.displayClip, true);
			this.updateHitArea();
			this.bindComponents();
		}

		
		gotoAndStop(clip:any, refresh:Boolean=false):void{
			const{symbol, graphics} = this;
			if(symbol == undefined){
				// this.gotoAndStop(clip,refresh);
				return;
			}
			
			if(this.currentClip == clip && !refresh){
				return;
			}
			graphics.clear();

			this.currentClip = clip;
			let elements = symbol.displayFrames[clip];
			if(undefined == elements)
			{
				graphics.end();
				return;
			}
			
			let sp:Component;
			
			let names:any[];
			for(let ele of elements)
			{
				let{type,x,y,rect,name,matrix2d}=ele;

				if(matrix2d instanceof ArrayBuffer){
					ele.matrix2d = matrix2d = new Float32Array(matrix2d);
				}
				if(ComponentClass.hasOwnProperty(type+""))
				{
					//文本这样处理是不行的
					sp = this[name];
					if(!sp)
					{
						sp = recyclable(ComponentClass[type]);
						sp.source = this.source;
						if(type == ComponentConst.Label)
						{//文本处理
							let textElement = ele as IDisplayTextElement;
							let textfield:TextField = recyclable(TextField);
							let e_format:object = textElement.format;
							let format:TextFormat = recyclable(TextFormat).init();
							format.size = e_format["size"] == undefined ? 12 : e_format["size"];
							format.align = e_format["alignment"] == undefined ? "left" : e_format["alignment"];

							textfield.init(this.source, format);
							textfield.color = textElement.color;
							textfield.multiline = textElement.multiline;
							if(textElement.input){
								textfield.type = TextFieldType.INPUT;
								textfield.mouseEnabled = true;
							}else{
								textfield.type = TextFieldType.DYNAMIC;
							}
							
							textfield.setSize(textElement.width,textElement.height);
							textfield.text = textElement.text;
							sp["text"] = textfield;
							sp.addChild(textfield);
							sp.x = x;
							sp.y = y;
							sp.setSize(textfield.w, textfield.h);
							this.addChild(sp);
						}else{
							sp.setSymbol(ele as IDisplaySymbol);
							sp.locksize = true;
						}
						sp.x = x;
						sp.y = y;
						
						this.addChild(sp);
						sp.name = name;
						this[name] = sp;
					}
				}else{
					this.renderFrameElement(ele);
				}
			}
			
			graphics.end();
			
		}

		setSize(width:number, height:number){
			let{w,h}=this;
			if(w == width && h == height){
				return;
			}
			
			super.setSize(width,height);
			let{$graphics:graphics}=this;
			if(graphics){
				graphics.setSize(width,height);
			}
		}
		
		addToStage():void{
			super.addToStage();
			this.simpleDispatch(EventT.ADD_TO_STAGE);
		}

		removeFromStage():void{
			super.removeFromStage();
			this.simpleDispatch(EventT.REMOVE_FROM_STAGE);
		}
		
		// var scaleGeomrtry:ScaleNGeomrtry;
		
		renderFrameElement(element:IDisplayFrameElement,clean?:Boolean):void{
			let vo:IBitmapSourceVO = this.source.getSourceVO(element.libraryItemName, 0);
			if(vo == undefined)
			{
				return;
			}
			const {graphics,symbol}  = this;
			if(clean){
				graphics.clear();
			}

			let{rect,x,y,matrix2d}=element;
			

			if(rect){
				graphics.drawScale9Bitmap(x,y,vo,rect,symbol.matrix2d);
			}else{
				graphics.drawBitmap(x,y,vo,matrix2d);
			}

			if(clean){
				graphics.end();
			}
		}

		protected doResize():void
		{
			
		}

		_selected:boolean;
		set selected(value:boolean){this._selected = value;this.doSelected();}
		get selected():boolean{return this._selected;}
		doSelected():void{}
		
		_enabled:boolean = true;
		set enabled(value:boolean){if(this._enabled == value){return;}this._enabled = value;this.doEnabled();}
		get enabled():boolean{return this._enabled;}
		doEnabled():void{}

		_data:{};
        set data(value:{}){this._data = value;this.doData();}
        get data():{}{return this._data;}
		doData():void{}
		refreshData():void{this.doData();}
		
		bindComponents():void{}
		awaken():void{}
        sleep():void{}
	}

	export interface ILabel{
		label:string;
		editable:boolean;
		text:TextField;
	}


	export class Label extends Component implements ILabel{
		text:TextField;
		//---------------------------------------------------------------------------------------------------------------
		//
		//label
		//
		//---------------------------------------------------------------------------------------------------------------
		_label:string;
		set label(value:string){this._label = value+"";this.doLabel();}
		get label():string{const{_editable,text,_label}=this;if(_editable){return text.text;}return _label;}
		_editable:boolean;
		set editable(value:boolean){this._editable = value;this.doEditable();}
		get editable():boolean{return this._editable;}		
		doEditable(){};


		bindComponents():void
        {
			
		}

		doLabel(){
			const{text,_label,_editable}=this;
			if(text){
				text.text = _label;
				// if(!_editable){
				// 	textField.w = textField.textWidth+5;
				// 	textField.h = textField.textHeight+5;
				// }
				this.textResize();
			}
		}

		textResize(){}
	}

	export interface IButton extends ILabel{
		mouseDown:boolean;
		addClick(func:Function,thisObj:any);
	}
	export class Button extends Label implements IButton{
		mouseDown:boolean = false;
		bindComponents():void
		{
			// if(this["label"] != undefined)
			// {
			// 	this.text = this["label"];
			// 	this.text.html = true;
			// }
			this.mouseChildren = false;

			this.doEnabled();
		}

		doEnabled():void
		{
			this.mouseEnabled = this._enabled;
			this.setEnable(this._enabled);
		}

		private setEnable(show:Boolean):void
		{
			// _enableFlag = show;
			if(show){
				this.on(MouseEventX.MouseDown,this.mouseDownHandler, this);
				this.on(MouseEventX.ROLL_OVER,this.rollHandler, this);
				this.on(MouseEventX.ROLL_OUT,this.rollHandler, this);
			
				this.mouseEnabled = true;
			}else{
				this.off(MouseEventX.MouseDown,this.mouseDownHandler);
				this.off(MouseEventX.ROLL_OVER,this.rollHandler);
				this.off(MouseEventX.ROLL_OUT,this.rollHandler);
				this.mouseEnabled = false;
			}
		}
		
		protected mouseDownHandler(event:EventX):void{
			this.on(MouseEventX.MouseUp, this.mouseUpHandler, this);
			this.mouseDown = true;
			this.clipRefresh();
		}

		protected mouseUpHandler(event:EventX):void{
			this.mouseDown = false;
			this.off(MouseEventX.MouseUp, this.mouseUpHandler);
			this.clipRefresh();
		}

		protected rollHandler(event:EventX):void{
			this.clipRefresh();
		}

		protected clipRefresh():void{
			const{mouseDown} = this;
			this.gotoAndStop(mouseDown ? 2 : (this.mouseroll ? 1 : 0));
		}

		addClick(listener:Function,thisObj:any){
			this.on(MouseEventX.CLICK,listener,thisObj);
		}
	}

	export class CheckBox extends Button{

		doEnabled():void
		{
			super.doEnabled();
			let {_enabled} = this;
			if(_enabled){
				this.on(MouseEventX.CLICK, this.clickHandler, this);
			}else{
				this.off(MouseEventX.CLICK, this.clickHandler);
			}
		}

		protected clickHandler(event:EventX):void{
			this.selected = !this._selected
		}

		doSelected():void{
			this.simpleDispatch(EventT.SELECT);
			this.clipRefresh();
		}
	}

	export class RadioButton extends CheckBox{
		protected _group:string;
		constructor(source?:BitmapSource, group?:string)
		{
			super(source);
			if(group != undefined)
			{
				this.group = group;
			}
		}

		doSelected():void{
			this.simpleDispatch(EventT.SELECT, this);
			this.clipRefresh();
			if(!this._selected){
				this.on(MouseEventX.CLICK, this.clickHandler, this);
			}else{
				this.off(MouseEventX.CLICK, this.clickHandler);
			}
		}

		set group(name:string){
			let {_group} = this;
			var radioButtonGroup:RadioButtonGroup;
			if(_group){
				radioButtonGroup = RadioButtonGroup.getGroup(_group);
				if(radioButtonGroup){
					radioButtonGroup.removeRadioButton(this);
				}
			}
			this._group = name;
			if(this._group){
				radioButtonGroup = RadioButtonGroup.getGroup(_group,true);
				radioButtonGroup.addRadioButton(this);
			}
		}
		get group():string{
			return this._group;
		}
	}

	export class RadioButtonGroup extends MiniDispatcher{
		private static groupDict:object = {};

		private name:String;
		private list:any[];

		constructor(name:string){
			super();
			this.name = name;
			this.list = [];
			RadioButtonGroup.groupDict[name] = this;
		}

		static getGroup(name:string, autoCreate:boolean = false):RadioButtonGroup
		{
			let group:RadioButtonGroup = this.groupDict[name];
			if(!group)
			{
				if(autoCreate){
					group = new RadioButtonGroup(name);
				}
			}
			return group;
		}
		private _selectRadioButton:RadioButton;
		set selectRadioButton(radioButton:RadioButton){
			this._selectRadioButton = radioButton;
			if(this._selectRadioButton){
				this._selectRadioButton.selected = true;
			}
		}
		get selectRadioButton():RadioButton{
			return this._selectRadioButton;
		}
		
		
		private _selectIndex:number;
		set selectIndex(value:number){
			
			this._selectIndex = value;
			
			var item:RadioButton = this.list[value];
			if(item){
				item.selected = true;
			}
		}
		
		get selectIndex():number
		{
			return this._selectIndex;
		}
		
		/**
		 *  
		 * @param radioButton
		 * 
		 */		
		addRadioButton(radioButton:RadioButton):void{
			if(this.list.indexOf(radioButton)==-1){
				if(this._selectRadioButton != undefined){
					this._selectRadioButton = radioButton;
					radioButton.selected = true;
				}else{
					radioButton.addEventListener(EventT.SELECT, this.radioButtonSelectHandler, radioButton);
				}
				this.list.push(radioButton);
			}
		}
		
		/**
		 * 
		 * @param radioButton
		 * 
		 */		
		removeRadioButton(radioButton:RadioButton):void{
			var i:number = this.list.indexOf(radioButton);
			if(i==-1){
				return;
			}
			radioButton.removeEventListener(EventT.SELECT,this.radioButtonSelectHandler);
			this.list.splice(i,1);
		}
		
		protected radioButtonSelectHandler(event:EventX):void{
			var target:RadioButton = event.data as RadioButton;
			if(target && target.selected){
				if(this._selectRadioButton){
					this._selectRadioButton.selected = false;
					this._selectRadioButton.addEventListener(EventT.SELECT, this.radioButtonSelectHandler, this._selectRadioButton);
				}
				this._selectRadioButton = target;
				this._selectRadioButton.removeEventListener(EventT.SELECT, this.radioButtonSelectHandler);
				this.dispatchEvent(new EventX(EventT.CHANGE));
			}
		}
	}

	export class TabItem extends Button{
		static colors:object = null;

		index:number = 0;
		target:Sprite = null;

		doSelected():void{
			this.clipRefresh();

			let text:TextField = this.text;
			let colors:object = TabItem.colors;
			let {_selected, _label} = this;
			if(colors != undefined && text != undefined)
			{
				text.html = true;
				// text.text = HtmlUtil.renderColor(_label , _selected ? colors["normal"] : colors["select"]);
			}
		}
	}

	export class ScrollBar extends Component{
		btn_up:Button;
		btn_down:Button;
		btn_thumb:Button;
		track:Component;

		target:Sprite;
		_scroll:Scroll;

		step:number = 100;

		private _skin:Component;

		/**
		 * 组件拖动按钮所在区域实际大小
		 */
		private _defaultLen:number;

		private _maxPos:number;

		private scrolltype:number;

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
			let {_skin} = this;
			// this.btn_up = _skin["btn_up"];
			// this.btn_down = _skin["btn_down"];
			// this.btn_thumb = _skin["btn_thumb"];
			// this.track = _skin["track"];
		}

		/**
		 * 绑定滚动
		 * @param target target为异步内容时在初始化时宽高会异常 
		 * @param w 
		 * @param h 
		 */
		init(target:Sprite, w:number, h:number, scrolltype:number = ScrollType.H_SCROLL):void
		{
			this.scrolltype = scrolltype;
			this.target = target;

			target.renderer = new BatchRenderer(target);

			this._scroll = new Scroll(target, w, h);
			this._scroll.hStep = 0;
			this._scroll.vStep = 1;
			this._scroll.areacheck = true;
			// target需要支持mousewheel事件
			let {mouseWheelHandler, targetScrollHandler, upHandler, downHandler, mousedownHandler, targetresizeHandler} = this;

			target.addEventListener(MouseEventX.MouseWheel, mouseWheelHandler, this);
			target.on(EventT.RESIZE, targetresizeHandler,this);

			this._scroll.addEventListener(EventT.SCROLL, targetScrollHandler, this);

			this.btn_up.addClick(upHandler, this);
			this.btn_down.addClick(downHandler, this);
			this.btn_thumb.addEventListener(MouseEventX.MouseDown, mousedownHandler, this);

			if(scrolltype == ScrollType.H_SCROLL)
			{
				this._defaultLen = w - this.btn_up.w - this.btn_down.w;
				this.track.setSize(this._defaultLen, this.track.h);
				this.btn_down.x = w - this.btn_down.w;
				this._skin.setSize(w, this._skin.h);//这个地方需要对——skin重新赋值 目前因为使用setsize会锁定检测区域 因此需要重新赋值 

				this._maxPos = this.btn_down.x - this.btn_thumb.w;
			}else if(scrolltype == ScrollType.V_SCROLL){
				this._defaultLen = h - this.btn_down.h - this.btn_up.h;
				this.track.setSize(this.track.w, this._defaultLen);
				this.btn_down.y = h - this.btn_down.h;
				this._skin.setSize(this._skin.w, h);

				this._maxPos = this.btn_down.y - this.btn_thumb.h;
			}
		}

		protected targetresizeHandler(event:EventX):void
		{
			let{w:width,h:height}=this.target;
			let{_scroll, _defaultLen, scrolltype} = this;
			//重新计算btn_thumb的高度
			let scrolldata:IScrollData = scrolltype == ScrollType.H_SCROLL ? _scroll.hScroll : _scroll.vScroll;
			let max:number = scrolltype == ScrollType.H_SCROLL ? width : height;
			let n:number = scrolldata.dlen / max;
			let tracklen:number = Math.max(20, _defaultLen * n);//btn_thumb实际大小

			if(scrolltype == ScrollType.H_SCROLL)
			{
				this.btn_thumb.setSize(tracklen, this.btn_thumb.h);
				this._maxPos = this.btn_down.x - this.btn_thumb.w;
			}else{
				this.btn_thumb.setSize(this.btn_thumb.w, tracklen);

				this._maxPos = this.btn_down.y - this.btn_thumb.h;
			}
		}

		protected targetScrollHandler(event:EventX):void
		{
			//btn_thumb拖动就不需要进行计算了
			let {scrolltype, _defaultLen, _maxPos} = this;
			let drager:Drager = event.data;
			let scrolldata:IScrollData = scrolltype == ScrollType.H_SCROLL ? drager.hScroll : drager.vScroll;
			let pos:number = scrolldata.pos;
			if(pos > 0)
			{
				pos = 0;
			}
			let n:number = Math.abs(pos / scrolldata.max);
			let y:number = _defaultLen * n + this.btn_up.h;
			if(y < this.btn_up.h)
			{
				y = this.btn_up.h;
			}else if(y > _maxPos){
				y = _maxPos;
			}
			this.btn_thumb.y = y;
		}

		protected mouseWheelHandler(event:EventX):void
		{
			let data:IMouseEventData = event.data;
			// data.wheel
		}

		protected upHandler(event:MouseEventX):void
		{
			//计算一下是否超界
			let sdata:IScrollData = this._scroll.vScroll;
			let {step} = this;
			this._scroll.update(0, step);
			this._scroll.end();
		}

		protected downHandler(event:MouseEventX):void
		{
			let {step} = this;
			this._scroll.update(0, -step);
			this._scroll.end();
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
			this._scroll.update(-ox, -oy);
			this._scroll.end();
		}
	}

	export const enum ScrollType{
		H_SCROLL,
		V_SCROLL
	}
	

	export const enum ComponentConst{
		Component,
		Label,
		Button,
		CheckBox,
		RadioButton,
		TabItem,
		ScrollBar,
		List,
		MList,
		Dele,
	}

	export let ComponentClass:{ [type: string]: { new(): Component } } = {
		0 : Component,
		1 : Label,
		2 : Button,
		3 : CheckBox,
		4 : RadioButton,
		5 : TabItem,
		6 : ScrollBar,
		7 : Component
	}
}