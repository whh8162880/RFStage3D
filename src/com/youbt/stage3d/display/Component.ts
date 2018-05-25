///<reference path="../../mvc/manage/PanelSourceManage.ts" />
///<reference path="./Sprite.ts" />
module rf{

	export interface IDisplayFrameElement{
		type:number;
		name:string;
		rect:any;
		x:number;
		y:number;
		scaleX:number;
		scaleY:number;
		rotaion:number;
		matrix2d:IMatrix;
		libraryItemName:string;
	}

	export interface IDisplayTextElement extends IDisplayFrameElement
	{
		fontRenderingMode:String;
		width:number;
		height:number;
		selectable:boolean;
		text:string;
		filter:any[];
		format:object;
		input:boolean;
		multiline:boolean;
		color:number;
	}

	export interface IDisplaySymbol extends IDisplayFrameElement{
		className:String;
		displayClip:number;
		displayFrames:{[key:number]:IDisplayFrameElement[]}
	}


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
			
			let tempMatrix:IMatrix = newMatrix();

			let names:any[];
			for(let ele of elements)
			{
				if(ComponentClass.hasOwnProperty(ele.type.toString()))
				{
					//文本这样处理是不行的
					sp = this[ele.name];
					if(!sp)
					{
						sp = recyclable(ComponentClass[ele.type]);
						sp.source = this.source;
						if(ele.type == ComponentConst.Label)
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
							sp.x = ele.x;
							sp.y = ele.y;
							sp.setSize(textfield.w, textfield.h);
							this.addChild(sp);
						}else{
							sp.setSymbol(ele as IDisplaySymbol);
						}
						sp.x = ele.x;
						sp.y = ele.y;
						sp.setSize(Math.round(sp.w * ele.scaleX),Math.round(sp.h * ele.scaleY));
						this.addChild(sp);
						this[ele.name] = sp;
					}
				}else{
					this.renderFrameElement(ele);
				}
			}
			
			graphics.end();
			
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
		
		renderFrameElement(element:IDisplayFrameElement,clean:Boolean = false):void{
			let vo:BitmapSourceVO = this.source.getSourceVO(element.libraryItemName, 1);
			if(vo == undefined)
			{
				return;
			}
			const {graphics}  = this;
			if(clean){
				graphics.clear();
			}
			
			if(element.rect){
				// scaleGeomrtry = _graphics.scale9(vo,element.rect,scaleGeomrtry);
				// if(_width == 0){
				// 	_width = vo.w;
				// }
				// if(_height == 0){
				// 	_height = vo.h;
				// }
				// scaleGeomrtry.set9Size(_width,_height);
			}else{
				graphics.drawBitmap(0,0,vo);//,element.matrix2d
			}
			
			if(clean){
				graphics.end();
			}
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
		addClick(func:Function,thisObj?:any);
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

		addClick(listener:Function,thisObj?:any){
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
	

	export const enum ComponentConst{
		Component,
		Label,
		Button,
		CheckBox,
		RadioButton,
		TabItem,
		ScrollBar,
		Dele,
		List,
		MList,
		Tab
	}

	export let ComponentClass:{ [type: string]: { new(): Component } } = {
		0 : Component,
		1 : Label,
		2 : Button,
		3 : CheckBox,
		4 : RadioButton,
		5 : TabItem,
		7 : Component
	}
}