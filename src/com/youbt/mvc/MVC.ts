module rf{
    //var facade
    //facade 注册记录保存所有Model class 等信息

    export class Facade extends MiniDispatcher{

        SINGLETON_MSG:string = "Facade Singleton already constructed!";
        mediatorMap:{[key:string]:Mediator}= {};
        modelMap:{[key:string]:BaseMode}= {};


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
        data:BaseMode;

		constructor(NAME:string){
			super();
			this.name = NAME;
			this.mEventListeners = {};
			facade.mediatorMap[this.name] = this;
			this.eventInterests = {};
		}
		
		_panel:TPanel
		setPanel(panel:TPanel):void{
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
    
    export class BaseMode extends MiniDispatcher{
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


}