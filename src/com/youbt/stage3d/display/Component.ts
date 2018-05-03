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
		color:number;
	}

	export interface IDisplaySymbol extends IDisplayFrameElement{
		className:String;
		displayClip:number;
		displayFrames:{[key:number]:IDisplayFrameElement[]}
	}


	export enum SymbolConst{
		SYMBOL = 0,
		BITMAP = 1,
		TEXT = 2,
		RECTANGLE = 3
	}

	export enum ComponentConst{
		Label,
		Button,
		CheckBox,
		RadioButton,
		List,
		MList,
		TabItem,
		Tab
	}




    export class Component extends Sprite{
        constructor(source?:BitmapSource){
			super(source);
			
			this._skin = {};
        }

        currentClip:number;

        symbol:IDisplaySymbol;
		
		sceneMatrix:IMatrix;

		_skin:object;

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
			
			let sp:Sprite;
			
			let tempMatrix:IMatrix = newMatrix();

			for(let ele of elements)
			{
				if(ele.type == SymbolConst.SYMBOL){
					if(null == ele.name){
						// ele.name = RFProfile.addInstance(element);
					}
					
					sp = this[ele.name];
					if(!sp){
						if(ele.rect){//目前还没写9宫
							//sp = new ScaleRectSprite3D(source);
						}else{
							sp = new Component(this.source);
						}
						sp.mouseEnabled = true;
						sp.x = ele.x;
						sp.y = ele.y;
						if(ele.matrix2d){
							tempMatrix.set(ele.matrix2d);
						}else{
							tempMatrix.m2_identity();
						}
						// if(sceneMatrix){
						// 	tempMatrix.concat(sceneMatrix);
						// }
						
						(sp as Component).setSymbol(ele as IDisplaySymbol,tempMatrix);
						
						this._skin[ele.name] = sp;
						this[ele.name] = sp;
						sp.name = ele.name;
						
						sp.setSize(Math.round(sp.w * ele.scaleX),Math.round(sp.h * ele.scaleY));
					}
					this.addChild(sp);
				}else if(ele.type == SymbolConst.TEXT){
					let textElement = ele as IDisplayTextElement;
					if(!this._skin.hasOwnProperty(ele.name))
					{
						sp = recyclable(TextField);
						let e_format:object = textElement.format;
						let format:TextFormat = recyclable(TextFormat).init();
						format.size = e_format["size"] == undefined ? 12 : e_format["size"];
						format.align = e_format["alignment"] == undefined ? "left" : e_format["alignment"];

						(sp as TextField).init(this.source, format);
						(sp as TextField).color = textElement.color;
						if(textElement.input){//暂时还没写可输入
							// (sp as TextField).type = TextFieldType.INPUT;
							// (sp as TextField).selectable = true;
							// sp.mouseEnabled = true;
						}else{
							// (sp as TextField).type = TextFieldType.DYNAMIC;
						}
						
						sp.setSize(textElement.width,textElement.height);
						(sp as TextField).text = textElement.text;
						sp.x = ele.x;
						sp.y = ele.y;
						this.addChild(sp);
						if(ele.name){
							this._skin[ele.name] = sp;
							this[ele.name] = sp;
							sp.name = ele.name;
						}
					}else{
						sp = this[ele.name];
						if((sp as TextField).text != textElement.text)
						{
							textElement.text = (sp as TextField).text;
						}
						this.addChild(sp);
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
			let vo:BitmapSourceVO = this.source.getSourceVO(element.libraryItemName);
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

		_data:any;
        set data(value:any){this._data = value;this.doData();}
        get data():any{return this._data;}
		doData():void{}
		
		bindComponents():void{}

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
		addClick(func:Function,thisObj?:any)
	}
	export class Button extends Label implements IButton{
		bindComponents():void
        {
		}

		addClick(listener:Function,thisObj?:any){
			this.on(MouseEventX.CLICK,listener,thisObj);
		}
	}
}