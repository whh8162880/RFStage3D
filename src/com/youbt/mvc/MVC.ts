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


        toggleMediator(mediator:Mediator,type:number = -1):Mediator{
            let panel = mediator._panel;

            if(panel == null) return null;

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
		name:string;
		eventInterests:{[key:string]:EventHandler};

		constructor(NAME:string){
			super();
			this.name = NAME;
			this.mEventListeners = {};
			facade.mediatorMap[this.name] = this;
			this.eventInterests = {};
		}
		
		_panel:TPanel
		setPanel(panel:TPanel):void{
			if(this._panel)
			{
				// this._panel.removeEventListener();
			}

			this._panel = panel;
			if("$panel" in this)
			{
				this["$panel"] = panel;
			}
        }
        
        mediatorReadyHandle():void{


        }



		// stageHandler(event:EventX):void{
		// 	this.awkenSleepCheck(event.type);
		// }

		// awkenSleepCheck(type:string|number):void
		// {
		// 	switch(type){
		// 		case ""://Event.ADDED_TO_STAGE:
		// 			facade.registerEvent(this.eventInterests,this);
		// 			this.awaken();
		// 			break;
		// 		case ""://Event.REMOVED_FROM_STAGE:
		// 			facade.removeEvent(this.eventInterests);
		// 			this.sleep();
		// 			break;
		// 	}
		// }

		
		sleep():void{
		}
		
		awaken():void{
		}

		onRemove():void{
			
        }
    }
    
    export class BaseMode extends MiniDispatcher{
        modelName:string;
        
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