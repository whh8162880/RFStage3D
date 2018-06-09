module rf{
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
}