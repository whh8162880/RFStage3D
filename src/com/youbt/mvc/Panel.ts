//之后移植到Sprite里面
module rf{

    export enum ChooseState {
		SELECT = "selected",
		NORMAL = "normal",
		SHRTLY = "shortly",
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
		
		addEventListener(type:string, listener:Function, priority:number=0):void
		{
			this._skin.addEventListener(type,listener,priority);
		}
		
		dispatchEvent(event:EventX):boolean
		{
			return this._skin.dispatchEvent(event);
		}
		
		hasEventListener(type:string):boolean
		{
			return this._skin.hasEventListener(type);
		}
		
		removeEventListener(type:string, listener:Function):void
		{
			this._skin.removeEventListener(type,listener);
		}
		
		simpleDispatch(type:string, data:any=null, bubbles:boolean=false):boolean
		{
			return this._skin.simpleDispatch(type,data,bubbles);
		}
		
		
		set visible(value:Boolean){
            let _skin = this._skin;
			if(_skin){
				_skin.visible = value;
				this.doVisible();
			}
		}
		get visible():Boolean{
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

        
    export interface IPanel{
        show(container:DisplayObjectContainer,isModal:boolean):void;
		
	/**
	 * 是否是展示状态 
	 * @return 
	 * 
	 */		
	// get isShow():boolean;
		
	/**
	 * 弹到最顶层; 
	 * 
	 */		
	    bringTop():void;
		
    /**
     * 隐藏 
     * @param event
     * 
     */		
		hide(event:any):void;
    }EventX

    export class TPanel extends SkinBase implements IPanel{
        
        public isShow:boolean = false;
        constructor(skin:Sprite){
            super(skin);
        }

        show(container:DisplayObjectContainer = null,isModal:boolean = false):void{

        }

        bringTop():void{

        }

        hide():void{

        }

    }

    
}