///<reference path="../stage3d/display/Component.ts" />
///<reference path="./manage/PanelSourceManage.ts" />
module rf{
    //var facade
    //facade 注册记录保存所有Model class 等信息

    export class Facade extends MiniDispatcher{

        SINGLETON_MSG:string = "Facade Singleton already constructed!";
        // mediatorMap:{[key:string]:Mediator}= {};
        modelMap:{[key:string]:BaseModel}= {};

        protected mediatorTypes:{[key:string]:number} = {};

        constructor(){
            super();
        }

        toggleMediator(m:any,type:number = -1):Mediator{
            let mediator:Mediator = singleton(m);
            let panel = mediator._panel;

            if(mediator.isReady == false && type == 0)
            {
                if(mediator.hasEventListener(EventT.COMPLETE_LOADED))
                {
                    mediator.removeEventListener(EventT.COMPLETE_LOADED, this.mediatorCompleteHandler);
                }
                return mediator;
            }
            if(mediator.isReady == false && mediator.startSync())
            {
                this.mediatorTypes[mediator.name] = type;
                mediator.addEventListener(EventT.COMPLETE_LOADED, this.mediatorCompleteHandler, this);
                return mediator;
            }

            this.togglepanel(mediator._panel)

            return mediator;
        }

        registerEvent(events:{[key:string]:EventHandler},thisobj:any):void{
            for(let key in events){
                let fun = events[key];
                this.on(key,fun,thisobj);
            }
        }

        removeEvent(event:{[key:string]:EventHandler}):void{
            for (let key in event)
            {
                let fun = event[key];
                this.off(key,fun)
            }
        }

        private togglepanel(panel:Panel, type:number = -1):void
        {
            switch(type){
                case 1:
                    if(panel.isShow == false)
                    {
                        panel.show();
                    }else{
                        panel.bringTop();
                    }
                break;
                case 0:
                    if(panel.isShow)panel.hide();
                break;
                case -1:
                    panel.isShow?panel.hide():panel.show();
                break;
            }
        }

        private mediatorCompleteHandler(event:EventX):void
        {
            let mediator:Mediator = event.data as Mediator;
            mediator.removeEventListener(EventT.COMPLETE_LOADED, this.mediatorCompleteHandler);
            let type:number = this.mediatorTypes[mediator.name];
            delete this.mediatorTypes[mediator.name];
            this.togglepanel(mediator._panel, type);
        }
    }

    export let facade = singleton(Facade);

    export class Mediator extends MiniDispatcher{
        static NAME:string;
        eventInterests:{[key:string]:EventHandler};

        isReady:boolean = false;

        name:string;
        data:BaseModel;

		constructor(NAME:string){
			super();
			this.name = NAME;
			this.mEventListeners = {};
			this.eventInterests = {};
		}
		
		_panel:Panel
		setPanel(panel:Panel):void{
           if(this._panel){
               ThrowError("has panel");
            }

			this._panel = panel;
			if("$panel" in this)
			{
				this["$panel"] = panel;
			}
        }

        startSync():boolean
        {
            let panel = this._panel;
            if(panel.loaded == false)
            {
                panel.load();
                panel.addEventListener(EventT.COMPLETE,this.preViewCompleteHandler,this);
            }else{
                this.preViewCompleteHandler(undefined);
            }
            return true;
        }

        preViewCompleteHandler(e:EventX):void{
            if(e)
            {
                let skin = e.currentTarget as Component;
                skin.removeEventListener(EventT.COMPLETE,this.preViewCompleteHandler);
                this.setBindView(true);
            }
            //checkModeldata
            // TimerUtil.add(this. ,100);
            this.mediatorReadyHandle();
            this.simpleDispatch(EventT.COMPLETE_LOADED,this);
        }

        awakenAndSleepHandle(e:EventX):void{
            let type = e.type;
            switch(type){
                case EventT.ADD_TO_STAGE:
                    facade.registerEvent(this.eventInterests,this);
                    if(this.isReady)
                    {
                        this.awaken();
                    }
					break;
				case EventT.REMOVE_FROM_STAGE:
                    facade.removeEvent(this.eventInterests)
					this.sleep();
					break;
			}
        }

        setBindView(isBind:boolean):void{
            if(isBind){
                this._panel.addEventListener(EventT.ADD_TO_STAGE,this.awakenAndSleepHandle,this);
                this._panel.addEventListener(EventT.REMOVE_FROM_STAGE,this.awakenAndSleepHandle,this);
            }else{
                this._panel.removeEventListener(EventT.ADD_TO_STAGE,this.awakenAndSleepHandle);
                this._panel.removeEventListener(EventT.REMOVE_FROM_STAGE,this.awakenAndSleepHandle);
            }
        }

        mediatorReadyHandle():void{
            this.isReady = true;
            if(this._panel.isShow){
                facade.registerEvent(this.eventInterests,this);
                this.awaken();
            }

        }

		
		sleep():void{
		}
		
		awaken():void{
		}

		onRemove():void{
			
        }
    }
    
    export class BaseModel extends MiniDispatcher{
        modelName:string;
        
        isReady:boolean;
        constructor(modelName:string){
            super();

            this.modelName = modelName;
            //注册
            facade.modelMap[modelName] = this;
        }

		refreshRuntimeData(type:string,data:any):void{
			
		}

        initRuntime():void{

        }

        onRegister( ):void{

        }

        onRemove():void{

        }
    }

    export const enum PanelEvent{
		SHOW = "PanelEvent_SHOW",
		HIDE = "PanelEvent_HIDE",
    }
    
    export class Panel extends Component implements IResizeable{
		uri:string;
		clsName:string;
        isShow:boolean = false;
		container:DisplayObjectContainer;
        isModel:boolean;
        loadSource:AsyncResource;

		isReadyShow:boolean = false;
        loaded:boolean = false;
        protected centerFlag:Boolean = false;
        protected _resizeable:boolean = false;

		constructor(uri:string,cls:string){
			super();
			this.uri = uri;
			this.clsName = cls;
		}

		getURL():string
		{
			let url:string = "";
			if(!url){
				url = "../assets/" + this.uri + ".p3d";
			}
			return url;
		}
		
		show(container:any=null, isModal:boolean=false):void{
            let {loaded, _resizeable, centerFlag, isShow} = this;
			if(loaded == false)
			{
				this.isReadyShow=true;
				this.container = container;
				this.isModel = isModal;
				this.load();
				return;
            }
            
            if(isShow)
			{
				this.bringTop();
				return;
            }
            
			if(!container)
			{
				container = popContainer;
			}
            container.addChild(this);
            
            if(_resizeable || isModal)
            {
                Engine.addResize(this);
                // this.resize(stageWidth, stageHeight);
            }else if(centerFlag){
                this.centerLayout();
            }
            this.isShow = true;
			this.awaken();
			this.effectTween(1);

			

			this.addEventListener(MouseEventX.MouseDown,this.panelClickHandler,this);
			// if(this.hasEventListener(PanelEvent.SHOW))
			// {
			// 	this.simpleDispatch(PanelEvent.SHOW);
			// }
		}

		load():void{
            if(this.loaded)
            {
                this.asyncsourceComplete(undefined);
            }else{
                let url = this.getURL();
                this.loadSource = sourceManger.load(url, this.uri);
				this.loadSource.addEventListener(EventT.COMPLETE, this.asyncsourceComplete, this);
            }
		}

		asyncsourceComplete(e:EventX):void{
			let loadSource = this.loadSource;
			let cs:IDisplaySymbol = loadSource.setting[this.clsName];
			if(cs){
				this.source = loadSource.source;
				this.setSymbol(cs);
				this.renderer = new BatchRenderer(this);
			}

			this.loaded = true;
			this.simpleDispatch(EventT.COMPLETE);

			if(this.isReadyShow){
				this.show(this.container,this.isModel);
			}
		}


		hide(e:EventX = undefined):void{
            this.isReadyShow=false;
            
            if(!this.isShow){
				return;
			}

			this.isShow = false;

			// this.sleep();
			this.effectTween(0);
			
			// this.hideState();
			this.removeEventListener(MouseEventX.MouseDown,this.panelClickHandler);
			if(this.hasEventListener(PanelEvent.HIDE)){
				this.simpleDispatch(PanelEvent.HIDE);
			}
		}

        bringTop():void
		{
            let {parent} = this;
			if(parent == null) return;
			parent.addChild(this);
		}

		panelClickHandler(e:MouseEventX):void{
			this.bringTop();
        }
        
        effectTween(type:number):void{
			
            // this.getTweener(type);
        

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
                if(this._resizeable || this.isModel){
                    Engine.removeResize(this);
                }
                this.remove();
            }
            
        }
        
        resize(width: number, height: number):void
        {
            let {centerFlag} = this;
            if(centerFlag)
			{
				this.centerLayout();
			}
        }
        protected centerLayout():void
		{
            this.x = stageWidth - this.w >> 1;
            this.y = stageHeight - this.h >> 1;
            if(this.y < 0)
            {
                this.y = 0;
            }
		}
	}

    export class TEventInteresterDele extends Component{
        protected _eventInterests:{[key:string]:EventHandler};
        constructor(source?:BitmapSource){
            super(source);

            this._eventInterests = {};

            //这个地方加添加和移除监听
            //添加到时候将所有事件注册 移除时将所有事件移除
            this.setBindView(true);
        }

        protected bindEventInterests():void{
			
        }
        
        setBindView(isBind:boolean):void{
            if(isBind){
                this.addEventListener(EventT.ADD_TO_STAGE,this.awakenAndSleepHandle,this);
                this.addEventListener(EventT.REMOVE_FROM_STAGE,this.awakenAndSleepHandle,this);
            }else{
                this.removeEventListener(EventT.ADD_TO_STAGE,this.awakenAndSleepHandle);
                this.removeEventListener(EventT.REMOVE_FROM_STAGE,this.awakenAndSleepHandle);
            }
        }

        awakenAndSleepHandle(e:EventX):void{
            let type = e.type;
            switch(type){
                case EventT.ADD_TO_STAGE:
                    facade.registerEvent(this._eventInterests,this);
                    this.awaken();
					break;
				case EventT.REMOVE_FROM_STAGE:
                    facade.removeEvent(this._eventInterests)
					this.sleep();
					break;
			}
        }
    }
}