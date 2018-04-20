module rf{
	export class Mediator extends MiniDispatcher{
		name:string;
		constructor(NAME:string){
			super();
			this.name = NAME;
			this.mEventListeners = {};
			// facade.mediatorMap[this.name] = this;

		}

		sleep():void{
		}
		
		awaken():void{
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

		_skin:MiniDispatcher
		setView(_skin:Sprite):void{
			if(this._skin){
				// _skin.removeEventListener(Event.,this.stageHandler);
			}
			
			this._skin =_skin;
			if(this._skin){
				// addEventListener(event)
			}
		}




		stageHandler(event:EventX):void{
			this.awkenSleepCheck(event.type);
		}

		awkenSleepCheck(type:string|number):void
		{
			switch(type){
				case ""://Event.ADDED_TO_STAGE:
					// facade.registerEvent(this);
					this.awaken();
					break;
				case ""://Event.REMOVED_FROM_STAGE:
					// facade.removeEvent(this);
					this.sleep();
					break;
			}
		}

		onRemove():void{
			
		}

	}

}