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
			let{w,h,symbol}=this;
			if(w == width && h == height){
				return;
			}

			let{matrix2d}=symbol;

			let m = matrix2d.m2_decompose(TEMP_MatrixComposeData);
			m.scaleX = m.scaleX / w * width;
			m.scaleY = m.scaleY / h * height;
			matrix2d.m2_recompose(m);
			
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

	export let ComponentClass:{ [type: string]: { new(): Component } } 
}