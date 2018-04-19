//之后移植到Sprite里面
module rf{

	export enum PanelEvent{
		SHOW = "PanelEvent_SHOW",
		HIDE = "PanelEvent_HIDE",
	}

    export enum ChooseState {
		SELECT = "selected",
		NORMAL = "normal",
		SHRTLY = "shortly",
	}
	
	export enum RES_STATE{
		LOAD_DISPOSE= -1, //被销毁
		LOAD_NONE,  // 未加载
		LOAD_PARSING , //解析状态
		LOAD_PARSED, //解析状态
		
		LOAD_LOADING,// 加载中
		LOAD_LOADED ,// 已加载
		LOAD_ERROR	// 加载失败
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
            this.skin = skin;
			skin.mouseEnabled = true
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
		
		set chooseState(value:string){if(value == ChooseState.SELECT){this.selected = true;}else{this.selected = false;}}
		get chooseState():string{return this._selected ? ChooseState.SELECT : ChooseState.NORMAL;}
       
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
		
		addEventListener(type:string|number, listener:Function, priority:number=0):void
		{
			this._skin.addEventListener(type,listener,priority);
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
		tweer:Tween;

		constructor(){
			super();
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

			this.isShow = true;
			this.awaken();
			this.effectTween(1);

			this.addEventListener(MouseEventX.MouseDown,this.panelClickHandler);
			if(this.hasEventListener(PanelEvent.SHOW))
			{
				this.simpleDispatch(PanelEvent.SHOW);
			}


		}

		effectTween(type:number):void{
			if(this.tweer)
			{
				// this.tweer.off()
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
		state:number;

		_resizeable:boolean;

		resource:PanelSource;
		container:DisplayObjectContainer;
		_readyShow:boolean = false;
		
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



		
		show(container:any=null, isModal:Boolean=false):void{
			if((this.state != RES_STATE.LOAD_LOADED) || !this.resource.isReady){
				this._readyShow=true;
				this.container = container;
				// this._isModal = isModal;
				this.state = RES_STATE.LOAD_NONE;
				
				this.load();
				return;
			}
			super.show(container,isModal);
			
			// if(isShow)
			// {
			// 	resource.sleeptime = 0;
			// }

		}

		load():void{
			// if(this.state != .LOAD_NONE && this.state != ResourceState.LOAD_ERROR && p3dCompleted){
			// 	return;	
			// }
			
			// let url= this.getURL();
			// let manage:PanelSourceManage = new PanelSourceManage;
			// manage.load(url);
			
			// loadRes(url, this.p3dloadComplete, this, ResType.text)
			// this.resource =  //p3d.load(url, uri, this);
			// resource.ungc = ungc;
			// if(resource.isReady){
			// 	this.resourcevo = resource.vo;
			// 	state = ResourceState.LOAD_LOADING;
				// initReady(null);
				
			// }else{
			// 	toggleLoading(true);
			// 	resource.addEventListener(RFLoaderEvent.COMPLETE,loaderHandler);	
			// 	resource.addEventListener(RFLoaderEvent.PROGRESS,progressHandler);
			// 	resource.addEventListener(RFLoaderEvent.FAILED,loaderHandler);
			// 	state = ResourceState.LOAD_LOADING;
			// }
		}

		p3dloadComplete(e:EventX):void{
			//
		}

		p3dCompleted():Boolean
		{
			return this.resource.isReady;
		}


		hide(e:Event = undefined):void{
			super.hide(e);
		}


	}



    
}