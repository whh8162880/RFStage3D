module rf{
	export class Mediator extends MiniDispatcher{
		name:string;
		constructor(NAME:string){
			super();
			this.name = NAME;
			this.mEventListeners = {};
		}

		onRegister():void{

		}

		sleep():void{
		}
		
		awaken():void{
		}

		getName():string{
			return this.name;
		}

		execute(type:string, ...args):void
		{
			if(type in this){
				let func:Function=this[type];
				if(func !=null){
					func.apply(null,args);
					return;
				}
			}
		}

		_panel:TPanel
		setPanel(panel:TPanel):void{
			this._panel = panel;
			if("$panel" in this)
			{
				this["$panel"] = panel;
			}
			this.setView(panel.skin);
		}

		viewComponent:MiniDispatcher
		setView(_skin:MiniDispatcher):void{
			if(this.viewComponent){
				this.bindSetViewEvent(this.viewComponent,false);
			}
			
			this.viewComponent =_skin;
			
			if("$view" in this){
				this["$view"]=_skin;
			}
			
			if(this.viewComponent){
				this.bindSetViewEvent(this.viewComponent,true);
			}
		}


		bindSetViewEvent(_view:MiniDispatcher , isBind:boolean):void{
			if(isBind)
			{
				//加载舞台
				//离开舞台
				// _view.addEventListener()
			}else{

			}
		}


		stageHandler(event:EventX):void{
			this.awkenSleepCheck(event.type);
		}

		awkenSleepCheck(type:string|number):void
		{
			switch(type){
				// case Event.ADDED_TO_STAGE:
					// facade.registerEvent(this);
					// if(isCanAwaken)
					// {
					// 	awaken();
					// }
					// break;
				// case Event.REMOVED_FROM_STAGE:
					// facade.removeEvent(this);
					// sleep();
					// break;
			}
		}

	}

}