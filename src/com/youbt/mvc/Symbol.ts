module rf{
    export class Symbol extends Sprite{
        constructor(source?:BitmapSource){
			super(source);
			
			this._skin = {};
        }

        public currentClip:number;

        public dsymbol:DisplaySymbol;
		
		public sceneMatrix:Matrix;

		public _skin:object;

		setSymbol(dsymbol:DisplaySymbol,matrix?:Matrix):void{
			this.dsymbol = dsymbol;
			// this.sceneMatrix = matrix ||= new Matrix();
			if(!dsymbol){
				this.graphics.clear();
				this.graphics.end();
				return;
			}
			this.x = dsymbol.x;
			this.y = dsymbol.y;
			this.gotoAndStop(dsymbol.displayClip, true);

			this.updateHitArea();
		}
		
		
		gotoAndStop(clip:any, refresh:Boolean=false):void{
			const{dsymbol, graphics} = this;
			if(dsymbol == undefined){
				// this.gotoAndStop(clip,refresh);
				return;
			}
			
			if(this.currentClip == clip && !refresh){
				return;
			}
			
			this.currentClip = clip;
			
			let elements:any[] = dsymbol.displayFrames[clip];
			if(undefined == elements)
			{
				graphics.clear();
				graphics.end();
				return;
			}
			graphics.clear();
			
			let sp:Sprite;
			
			let tempMatrix:Matrix = new Matrix();

			for(let ele of elements)
			{
				if(ele.type == DisplayFrameElement.SYMBOL){
					if(null == ele.name){
						// ele.name = RFProfile.addInstance(element);
					}
					
					sp = this[ele.name];
					if(!sp){
						if(ele.rect){//目前还没写9宫
							//sp = new ScaleRectSprite3D(source);
						}else{
							sp = new Symbol(this.source);
						}
						sp.mouseEnabled = true;
						sp.x = ele.x;
						sp.y = ele.y;
						if(ele.matrix2d){
							tempMatrix.copyFrom(ele.matrix2d);
						}else{
							tempMatrix.identity();
						}
						// if(sceneMatrix){
						// 	tempMatrix.concat(sceneMatrix);
						// }
						
						(sp as Symbol).setSymbol(ele as DisplaySymbol,tempMatrix);
						
						this._skin[ele.name] = sp;
						this[ele.name] = sp;
						sp.name = ele.name;
						
						sp.setSize(Math.round(sp.w * ele.scaleX),Math.round(sp.h * ele.scaleY));
					}
					this.addChild(sp);
				}else if(ele.type == DisplayFrameElement.TEXT){
					let textElement:DisplayTextElement;
					textElement = ele as DisplayTextElement;
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
			
			this.graphics.end();
			
		}
		
		
		// public var scaleGeomrtry:ScaleNGeomrtry;
		
		renderFrameElement(element:DisplayFrameElement,clean:Boolean = false):void{
			let vo:BitmapSourceVO = this.source.getSourceVO(element.libraryItemName);
			
			if(vo == undefined)
			{
				return;
			}
			
			if(clean){
				this.graphics.clear();
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
				this.graphics.drawBitmap(0,0,vo);//,element.matrix2d
			}
			
			if(clean){
				this.graphics.end();
			}
		}
	}

	export class DisplayFrameElement{
		static SYMBOL:number = 0;

		static BITMAP:number = 1;

		static TEXT:number = 2;

		static RECTANGLE:number = 3;

		public type:number;
		
		public name:string;
		
		public rect:any;
		
		public x:number = 0.0;
		
		public y:number = 0.0;
		
		public scaleX:number = 1.0;
		
		public scaleY:number = 1.0;
		
		public rotaion:number = 0;
		
		public matrix2d:Matrix;
		
		public libraryItemName:string;

		constructor(){

		}
	}

	export class DisplayTextElement extends DisplayFrameElement
	{
		constructor(){
			super();
		}
		
		
		public fontRenderingMode:String;
		
		public width:number;
		
		public height:number;
		
		public selectable:boolean;
		
		public text:string;
		
		public filter:any[];
		
		public format:object;
		
		public input:boolean;
		
		public color:number;
	}

    export class DisplaySymbol extends DisplayFrameElement{
		public className:String;
		
		public displayClip:number = 0;
		
		public displayFrames:object;
		
		constructor(){
			super();
		}
	}
}