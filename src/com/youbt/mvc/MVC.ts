///<reference path="../stage3d/display/Component.ts" />
///<reference path="./manage/PanelSourceManage.ts" />
module rf{
    //var facade
    //facade 注册记录保存所有Model class 等信息

    export class Facade extends MiniDispatcher{

        SINGLETON_MSG:string = "Facade Singleton already constructed!";
        mediatorMap:{[key:string]:Mediator}= {};
        modelMap:{[key:string]:BaseModel}= {};


        constructor(){
            super();
        }


        mediator:Mediator = null;
        type:number;
        toggleMediator(mediator:Mediator,type:number = -1):Mediator{
            let panel = mediator._panel;

            if(panel == null) return null;
            if(mediator.isReady == false && mediator.startSync())
            {
                this.mediator = mediator;
                this.type = type;
                mediator.addEventListener(EventT.COMPLETE_LOADED,this.onCompleteHandle,this);
                return;
            }

            this.mediator = null;
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

            return mediator;
        }

        onCompleteHandle(e:EventX):void{
            let mediator = this.mediator;
            if(mediator && mediator.hasEventListener(EventT.COMPLETE_LOADED)){
                mediator.off(EventT.COMPLETE_LOADED, this.onCompleteHandle);
            }

            if(mediator){
                this.toggleMediator(this.mediator,this.type);
            }   

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

    }

    export let facade = singleton(Facade);


    export class Mediator extends MiniDispatcher{

        eventInterests:{[key:string]:EventHandler};

        isReady:boolean = false;

        name:string;
        data:BaseModel;

		constructor(NAME:string){
			super();
			this.name = NAME;
			this.mEventListeners = {};
			facade.mediatorMap[this.name] = this;
			this.eventInterests = {};
		}
		
		_panel:Panel
		setPanel(panel:Panel):void{
           if(this._panel){
               this.setBindView(false);
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
                let skin = e.currentTarget  as Component;
                skin.removeEventListener(EventT.COMPLETE,this.preViewCompleteHandler);
                this.setBindView(true);
            }
            //checkModeldata
            // TimerUtil.add(this.mediatorReadyHandle,100);
            this.mediatorReadyHandle();
            this.simpleDispatch(EventT.COMPLETE_LOADED,this);

        }

        // _readyExecutes:Function[];
        // _readyExecutesArgs:{[key:string]:any} = {}
        // addReadyExecute(fun:Function,...args):void{
            // const {_panel} = this;
            // let _readyExecutes = this._readyExecutes;
            // let _readyExecutesArgs = this._readyExecutesArgs

            // if(this.isReady){
			// 	if(_panel && !_panel.loaded)
			// 	{

            //         let length:number = _readyExecutes.length;
            //         _readyExecutes.push(fun);
            //         _readyExecutesArgs[length] =args;
			// 		return;
            //     }
            //     fun.apply(null,args);
			// 	return;
			// }else{
			// 	this.startSync();
            // }
            
            // let length:number = _readyExecutes.length;
            // _readyExecutes.push(fun);
            // _readyExecutesArgs[length] =args;
			
        // }

        awakenAndSleepHandle(e:EventX):void{
            let type = e.type;
            switch(type){
                case EventT.ADD_TO_STAGE:
                    facade.registerEvent(this.eventInterests,this);
                    this.awaken();
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

        //    let _readyExecutes = this._readyExecutes;
        //    let _readyExecutesArgs = this._readyExecutesArgs;
        //     if(_readyExecutes.length){
        //         let i = 0;
        //         while(_readyExecutes.length){
        //             let fun = _readyExecutes.shift();
        //             let args = _readyExecutesArgs[i];
        //             fun.apply(null,args);

        //             i++;
        //         }
		// 	}

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
    
    export class Panel extends Component{
		uri:string;
		clsName:string;
		_resizeable:boolean;
        isShow:boolean = false;
		container:DisplayObjectContainer;
        isModel:boolean;
        loadSource:AsyncResource;

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
				url = "../assets/" + this.uri + ".p3d";
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
            
            if(this.isShow)
			{
				this.bringTop();
				return;
			}
			if(!container)
			{
				container = popContainer;
			}
			container.addChild(this);

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
			if(this.loadSource == undefined ||this.loadSource.status == 0 )
			{
				let url = this.getURL();
				this.loadSource = sourceManger.load(url, this.uri);
				this.loadSource.addEventListener(EventT.COMPLETE, this.asyncsourceComplete, this);
				// this.showload();
			}else{
				this.asyncsourceComplete(undefined);
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
                this.remove();
            }
            
        }

        awaken():void{}
		sleep():void{}
	}

}