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

        registerEvent(event:MiniDispatcher):void{
            if (undefined == this.mEventListeners) {
				this.mEventListeners = {};
            }
            let signal;
            for(let type in event.mEventListeners){
                signal = event.mEventListeners[type];
                if(signal)
                {
                    this.mEventListeners[type] = signal;
                }
            }
        }

        removeEvent(event:MiniDispatcher):void{
            if (undefined == this.mEventListeners) {
				return;
            }
            let signal;
			for (let type in event.mEventListeners){
				signal=this.mEventListeners[type];
				if(signal==null){
					continue;
                }

                this.off(type,signal.data);
			}
        }

    }

    export let facade = singleton(Facade);

}