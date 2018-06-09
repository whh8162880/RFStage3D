///<reference path="../stage3d/display/Sprite.ts" />
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
			const{symbol, graphics , source} = this;
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

				if(type == 9)
				{
					console.log("xxx");
				}

				if(ComponentClass.hasOwnProperty(type+""))
				{
					//文本这样处理是不行的
					sp = this[name];
					if(!sp)
					{
						if(type == ComponentConst.Label){
							let textElement = ele as IDisplayTextElement;
							let{format:e_format,width,height,text,color,multiline}=textElement
							let textfield:TextField = recyclable(TextField);

							let format:TextFormat = recyclable(TextFormat).init();
							format.size = e_format["size"] == undefined ? 12 : e_format["size"];
							format.align = e_format["alignment"] == undefined ? "left" : e_format["alignment"];

							textfield.init(source, format);
							textfield.color = color;
							textfield.multiline = multiline;
							if(textElement.input){
								textfield.type = TextFieldType.INPUT;
								textfield.mouseEnabled = true;
							}else{
								textfield.type = TextFieldType.DYNAMIC;
							}
							
							textfield.setSize(width,height);
							if(text){
								textfield.text = text;
							}

							textfield.x = x;
							textfield.y = y;
							this.addChild(textfield);

							textfield.name = name;
							this[name] = textfield;
						}else{
							sp = recyclable(ComponentClass[type]);
							sp.source = source;
							sp.setSymbol(ele as IDisplaySymbol);

							
							sp.locksize = true;
							sp.x = x;
							sp.y = y;
							this.addChild(sp);
							sp.name = name;
							this[name] = sp;
						}
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

		_selected:boolean = false;
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


	export class Label extends Component{
		txt_label:TextField;
		//---------------------------------------------------------------------------------------------------------------
		//
		//label
		//
		//---------------------------------------------------------------------------------------------------------------
		_label:string;
		set label(value:string){this._label = value+"";this.doLabel();}
		get label():string{const{_editable,txt_label,_label}=this;if(_editable){return txt_label.text;}return _label;}
		_editable:boolean;
		set editable(value:boolean){this._editable = value;this.doEditable();}
		get editable():boolean{return this._editable;}		
		doEditable(){};


		bindComponents():void
        {
			
		}

		doLabel(){
			const{txt_label,_label,_editable}=this;
			if(txt_label){
				txt_label.text = _label;
				// if(!_editable){
				// 	textField.w = textField.textWidth+5;
				// 	textField.h = textField.textHeight+5;
				// }
				this.textResize();
			}
		}

		textResize(){}
	}

	export class Button extends Label{
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
			ROOT.on(MouseEventX.MouseUp, this.mouseUpHandler, this);
			this.mouseDown = true;
			this.clipRefresh();
		}

		protected mouseUpHandler(event:EventX):void{
			this.mouseDown = false;
			ROOT.off(MouseEventX.MouseUp, this.mouseUpHandler);
			this.clipRefresh();
		}

		protected rollHandler(event:EventX):void{
			this.clipRefresh();
		}

		protected clipRefresh():void{
			const{mouseDown,mouseroll} = this;
			this.gotoAndStop(mouseDown ? 2 : (mouseroll ? 1 : 0));
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

		protected clipRefresh():void{
			const{mouseDown,mouseroll,_selected} = this;
			this.gotoAndStop(_selected ? (mouseDown ? 6 : (mouseroll ? 5 : 4)) : (mouseDown ? 2 : (mouseroll ? 1 : 0) ) );
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

			let text:TextField = this.txt_label;
			let colors:object = TabItem.colors;
			let {_selected, _label} = this;
			if(colors != undefined && text != undefined)
			{
				text.html = true;
				// text.text = HtmlUtil.renderColor(_label , _selected ? colors["normal"] : colors["select"]);
			}
		}
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
		7 : Component,
		9 : Component
	}
}