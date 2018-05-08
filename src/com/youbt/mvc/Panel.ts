//之后移植到Sprite里面
module rf{

	export const enum PanelEvent{
		SHOW = "PanelEvent_SHOW",
		HIDE = "PanelEvent_HIDE",
	}

    export class DataBase{

        DataBase3D()
        {
        }
        
        _data:any;
        set data(value:any){
            this._data = value;
            this.doData();
        }
        get data():any{
            return this._data;
        }
        doData():void{
            
        }
        
        dispose():void{
        }
        
        clear():void{
            
        }
    }

    export class SkinBase extends DataBase{
		static ROOT:Stage3D;
      
       
        constructor(skin:Sprite = null){
			super();
			if(skin){
				this.skin = skin;
				skin.mouseEnabled = true
			}
        }
        
        _skin:Sprite;
		get skin():Sprite{return this._skin;}
		set skin(value:Sprite){
			if(this._skin)
			{
				// this._skin.skinBase = null;
			}
			
            this._skin = value;
			if(this._skin){
				// this._skin.skinBase = this;
			}
			
			this.bindComponents()
        }
        
		bindComponents():void{}
		
		refreshData():void{this.doData();}
       
        _selected:boolean;
		set selected(value:boolean){this._selected = value;this.doSelected();}
		get selected():boolean{return this._selected;}
		doSelected():void{}
		
		_enabled:boolean = true;
		set enabled(value:boolean){if(this._enabled == value){return;}this._enabled = value;this.doEnabled();}
		get enabled():boolean{return this._enabled;}
		doEnabled():void{this._skin.mouseEnabled = false;this._skin.mouseChildren = false}
		
		// get scenePos():Vector3D{return this._skin.scenePos};
		
		awaken():void{}
		sleep():void{}
		
		addEventListener(type:string|number, listener:Function, thisobj:any,priority:number=0):void
		{
			this._skin.addEventListener(type,listener,thisobj,priority);
		}
		
		dispatchEvent(event:EventX):boolean
		{
			return this._skin.dispatchEvent(event);
		}
		
		hasEventListener(type:string|number):boolean
		{
			return this._skin.hasEventListener(type);
		}
		
		removeEventListener(type:string|number, listener:Function):void
		{
			this._skin.removeEventListener(type,listener);
		}
		
		simpleDispatch(type:string|number, data:any=null, bubbles:boolean=false):boolean
		{
			return this._skin.simpleDispatch(type,data,bubbles);
		}
		
		
		set visible(value:boolean){
            let _skin = this._skin;
			if(_skin){
				_skin.visible = value;
				this.doVisible();
			}
		}
		get visible():boolean{
            let _skin = this._skin;
			if(_skin){
				return _skin.visible;
			}
			
			return true;
		}
		doVisible():void{
			
		}
		
		set alpha(val:number){this._skin.alpha = val;}
		get alpha():number{return this._skin.alpha;}
		
		set scale(val:number){this._skin.scaleX = val;this._skin.scaleY = val;}
		get scale():number{return this._skin.scaleX;}
		
		set x(value:number){this._skin.x = value;}
		get x():number{return this._skin.x}
		
		set y(value:number){this._skin.y = value;}
		get y():number{return this._skin.y;}
			
		
		addChild(child:DisplayObject):void{
			this._skin.addChild(child);
		}
		
		addChildAt(child:DisplayObject,index:number):void{
			this._skin.addChildAt(child,index);
		}
		
		
		invalidateFuncs:Array<Function>;
		invalidate(func:Function = null):void{
			// nativeStage.addEventListener(Event.ENTER_FRAME, onInvalidate);
			// if(null == func){
			// 	func = draw;
			// }
			// if(!invalidateFuncs)
			// {
			// 	invalidateFuncs = [];
			// }
			// if(invalidateFuncs.indexOf(func) == -1){
			// 	invalidateFuncs.push(func);
			// }
		}
		
		
		invalidateRemove(func:Function = null):void{
			// if(null == func){
			// 	func = draw;
			// }
			// var i:int = invalidateFuncs.indexOf(func);
			// if(i != -1){
			// 	invalidateFuncs.splice(i,1);
			// 	if(!invalidateFuncs.length){
			// 		nativeStage.removeEventListener(Event.ENTER_FRAME, onInvalidate);
			// 	}
			// }
		}
		
		
		
		
		onInvalidate(event:Event):void
		{
			// IEventDispatcher(event.currentTarget).removeEventListener(Event.ENTER_FRAME, onInvalidate);
			// var arr:Array = invalidateFuncs.concat();
			// invalidateFuncs.length = 0;
			// for each(var func:Function in arr){
			// 	func();
			// }
			
		}
		
		
		
		remove(event:any = null):void{
			if(this._skin && this._skin.parent){
				this._skin.parent.removeChild(this._skin);
			}
		}
	}
	
	
	
	export class PanelBase extends SkinBase{
		isShow:boolean = false;

		constructor(){
			super(new Component());
		}

		show(container:any=null, isModal:Boolean=false):void{
			if(this.isShow)
			{
				this.bringTop();
				return;
			}
			if(!container)
			{
				container = popContainer;
			}
			container.addChild(this._skin);

			this.isShow = true;
			this.awaken();
			this.effectTween(1);

			

			this.addEventListener(MouseEventX.MouseDown,this.panelClickHandler,this);
			if(this.hasEventListener(PanelEvent.SHOW))
			{
				this.simpleDispatch(PanelEvent.SHOW);
			}


		}

		effectTween(type:number):void{
			
			this.getTweener(type);
		

			// if(type){
			
			// 	_tween = tween.get(this._skin);
			// 	_tween.to({alpha:1},200);
			// }else{
			// 	_tween = tween.get(this._skin);
			// 	_tween.to({alpha:1},200);
			// }

			// _tween.call(this.effectEndByBitmapCache,this,type);

			// this.effectEndByBitmapCache(type);
			if(type == 0){
				this._skin.remove();
			}

		}

		getTweener(type:number):void{
			// if(this._skin.alpha == 1)
			// {
			// 	this._skin.alpha = 0;
			// }
		}


		effectEndByBitmapCache(type:number):void{
			if(type == 0){
				this._skin.remove();
			}else{
				// this._skin.alpha = 1;
			}
		}

		hide(e:Event = undefined):void{
			if(!this.isShow){
				return;
			}

			this.isShow = false;

			this.sleep();
			this.effectTween(0);
			
			// this.hideState();
			this.removeEventListener(MouseEventX.MouseDown,this.panelClickHandler);
			if(this.hasEventListener(PanelEvent.HIDE)){
				this.simpleDispatch(PanelEvent.HIDE);
			}

			console.log("Mediatro sleep");
		}

		bringTop():void
		{
			let skin:Sprite = this._skin;
			if(skin.parent == null) return;
			skin.parent.addChild(skin);
		}

		panelClickHandler(e:MouseEventX):void{
			this.bringTop();
		}
		
	}

    export class TPanel extends PanelBase{
	   
		uri:string;
		clsName:string;
		_resizeable:boolean;

		source:AsyncResource;
		container:DisplayObjectContainer;
		isModel:boolean;

		isReadyShow:boolean = false;
		loaded:boolean = false;

		constructor(uri:string,cls:string){
			super();
			this.uri = uri;
			this.clsName = cls;
			this._resizeable=true;
		}

		getURL():string
		{
			let url:string = "";
			if(!url){
				url = "../assets/"+this.uri + ".p3d";
			}
			return url;
		}



		
		show(container:any=null, isModal:boolean=false):void{

			if(this.loaded == false)
			{
				this.isReadyShow=true;
				this.container = container;
				this.isModel = isModal;
				this.load();
				return;
			}
			super.show(container,isModal);
		}

		load():void{
			if(this.source == undefined ||this.source.status == 0 )
			{
				let url = this.getURL();
				let source = manage.load(url, this.uri);
				source.addEventListener(EventT.COMPLETE, this.asyncsourceComplete, this);
				this.source = source;
				// this.showload();
			}else{
				this.asyncsourceComplete(undefined);
			}


		}

		asyncsourceComplete(e:EventX):void{
			let source = this.source;
			let cs:IDisplaySymbol = source.setting[this.clsName];
			if(cs){
				let skin = this.skin as Component;
				skin.source = source.source;
				skin.setSymbol(cs);
				skin.renderer = new BatchRenderer(skin);
			}

			this.loaded = true;
			this.simpleDispatch(EventT.COMPLETE);

			if(this.isReadyShow){
				this.show(this.container,this.isModel);
			}
		}


		hide(e:Event = undefined):void{
			super.hide(e);
			this.isReadyShow=false;
		}


	}


	let manage:PanelSourceManage = singleton(PanelSourceManage);
    
}