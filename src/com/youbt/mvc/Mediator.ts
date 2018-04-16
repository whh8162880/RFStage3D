module rf{
    //Mediator
    export interface IMediator extends IName{
        /**
		 * 取得所代理视图; 
		 * @return 
		 * 
		 */		
		getView():DisplayObject;
		
		
		getPanel():IPanel;
		
		/**
		 * 取得部件 
		 * @param key
		 * @return 
		 * 
		 */		
		getCompnent(key:string):DisplayObject;
		
		/**
		 * 设置视图; 
		 * @param view
		 * 
		 */		
		//setView(view:DisplayObject):void;
		
		/**
		 * 设置数据模型; 
		 * @param model
		 * 
		 */		
		setModel(model:any):void;
		
		/**
		 * 取得模型; 
		 * @return 
		 * 
		 */		
		getModel():any;
		
		/**
		 * 当被注册到应用中触发 
		 * 
		 */		
		onRegister():void;
		
		/**
		 * 当从应用中删除时触发; 
		 * 
		 */		
		onRemove():void;
		
		/**
		 *  
		 * 休眠;
		 */		
		sleep():void;
		
		/**
		 * 唤醒 
		 * 
		 */		
        awaken():void;
        
    }
/**
	 * 基本的视图中介调停者类,所有需要实现中介的类必须继承于此类;
	 * @author crl
	 * 
	 */	
    class Mediator implements IMediator
    {
		name:string;
		viewComponent:DisplayObject;
		_panel:IPanel;
		
		data:any;
		/**
		 * 中介所关心的事件列表; 
		 */		
		 _eventInterests:Object;
		
		
		/**
		 * 呼叫引用(谁触发了此mediator的打开); 
		 */		
        // callReferrer:CallReferrer;
        
        constructor(mediatorName:string){
            this.name = mediatorName;
            this,this._eventInterests = new Object();
        }
		
		getName():string 
		{	
			return this.name;
		}
		
		
		setPanel(panel:IPanel):void{
            let _panel =this._panel;
            _panel = panel;
			// _panel.addEventListener(PanelEvent.MOTION_HIDE_FINISHED,panelHide);
			// _panel.addEventListener(PanelEvent.MOTION_SHOW_FINISHED,panelShow);
			if("$panel" in this){
				this["$panel"]=_panel;
			}
			// this.setView(panel.skin);
        }
        
		getPanel():IPanel{
			return this._panel;
		}
		
		setView( view:DisplayObject):void 
		{
            let  viewComponent =this.viewComponent;
			if(viewComponent){
				this.bindSetViewEvent(viewComponent,false);
			}
			
			viewComponent = view;
			
			if("$view" in this){
				this["$view"]=view;
			}
			
			if(viewComponent){
				this.bindSetViewEvent(viewComponent,true);
			}
		}
		
		/**
		 * 只定义刷新视图的接口(以供大家统一思想)
		 * 
		 */		
		updateView():void{
			
		}
		
		
		get viewIsShow():boolean{
            let _panel = <TPanel>this._panel;
            if(_panel){
				
				return _panel.isShow;
			}
			return false;
		}
		
		/**
		 * 供子类实现非 ADDED_TO_STAGE的事件类型;
		 * @param viewComponent
		 * @param isBind
		 * 
		 */		
		bindSetViewEvent(viewComponent:DisplayObject, isBind:Boolean):void
		{
			if(isBind){
				// viewComponent.addEventListener(Event.ADDED_TO_STAGE,stageHandler);
				// viewComponent.addEventListener(Event.REMOVED_FROM_STAGE,stageHandler);
			}else{
				// viewComponent.removeEventListener(Event.ADDED_TO_STAGE,stageHandler);
				// viewComponent.removeEventListener(Event.REMOVED_FROM_STAGE,stageHandler);
			}
		}
		
		stageHandler(event:Event):void{
			//由于事件的类型无法重写,供特殊方法不想走ADDED_TO_STAGE与REMOVED_FROM_STAGE
			this.awkenSleepCheck(event.type);
		}

		/**
		 * 可供重写事件的type转为addStage与removeStage; 
		 * @param type
		 * 
		 */		
		awkenSleepCheck(type:string):void{
			// switch(type){
			// 	case Event.ADDED_TO_STAGE:
			// 		facade.registerEvent(this);
			// 		if(isCanAwaken)
			// 		{
			// 			awaken();
			// 		}
			// 		break;
			// 	case Event.REMOVED_FROM_STAGE:
			// 		facade.removeEvent(this);
			// 		sleep();
			// 		break;
			// }
		}
		
		
		panelHide(event:Event):void{
			
			// if(callReferrer){
			// 	callReferrer.execute();
			// 	callReferrer=null;
			// }
		}
		
		panelShow(event:Event):void{
			
		}
		
		/**
		 * 现在状态是否可让它唤醒 
		 * @return 
		 * 
		 */		
		get isCanAwaken():Boolean{
			
			return true;
		}
		
		
		getView():DisplayObject
		{	
			return this.viewComponent;
		}
		getCompnent(key:String):DisplayObject{
			return null;
		}
		
		getModel():any{
			return this.data;
		}
		setModel(model:any):void{
			this.data=model;
			
			if("$model" in this){
				this["$model"]=model;
			}
		}
		
		handle( even:Event):void {
		}
		
		execute(type:string,...args):void{
			if(type in this){
				var func:Function=this[type];
				if(func !=null){
					func.apply(null,args);
					return;
				}
			}
		}
		
		get eventInterests():Object{
			return this._eventInterests;
		}
		
		onRegister( ):void {
			
		}
		
		
		onRemove( ):void {
			
		}
		
		
		sleep():void{
			
		}
		
	    awaken():void{
			
		}
		
    }


    /**
	 * 异步视图控制器
	 * 视图异步与模型异步 
	 * 提供异步的同步调用;
	 * @author crl
	 * 
	 */	
    export class AsyncMediator  extends  Mediator{

        static COMPLETE:string="AsyncMendiatorComplete";
		
		_ready:boolean=false;
		
		/**
		 * 视图代理完成后需要处理的列表;
		 *  viewCompleteExecutes[function]=parms;
		 * for function.apply(null,parms);
		 */		
		// _readyExecutes:ArraySet;
        
        constructor(mediatorName:string){
            super(mediatorName);
        }
		
		startSync():Boolean{
			var panel:IPanel= this.getPanel();
			// if(panel is IAsyncPanel){
			// 	var asyncPanel:IAsyncPanel=panel as IAsyncPanel;
			// 	if(asyncPanel.isReady){
			// 		preViewCompleteHandler(null);
			// 	}else{
			// 		asyncPanel.load();
			// 		asyncPanel.addEventListener(Event.COMPLETE,preViewCompleteHandler);
			// 	}
			// }
			
			return true;
		}
		
		setView(value:DisplayObject):void{
			if("$view" in this){
				this["$view"]=value;
			}
			
			// if(viewComponent){
			// 	bindSetViewEvent(viewComponent,false);
			// }
			// viewComponent = value;
			// if(viewComponent){
			// 	bindSetViewEvent(viewComponent,true);
			// }
		}
		
		setModel(value:any):void{
			
			// if("$model" in this){
			// 	this["$model"]=value;
			// }
			// var proxy:IAsyncProxy;
			// if(data is IAsyncProxy){
			// 	proxy=data as IAsyncProxy;
			// 	proxy.removeEventListener(EventX.COMPLETE,preModelCompleteHandle);
			// }
			
			// data=value;
		}
		
		/**
		 * 在viewComplete初始化之前想做什么事情;
		 * @param event
		 * 
		 */		
		preViewCompleteHandler(event:Event):void{
			// if(event){
			// 	var view:IAsyncPanel=event.target as IAsyncPanel;
			// 	view.removeEventListener(EventX.COMPLETE,preViewCompleteHandler);
			// 	setView(view.skin);
			// }
			// viewCompleteHandler(event);
			
			// checkModelLoad();
		}
		
		/**
		 *检测数据是否需要加载 
		 * 
		 */		
		checkModelLoad():void
		{
			// if(data is IAsyncProxy){
			// 	var proxy:IAsyncProxy=data as IAsyncProxy;
			// 	if(!proxy.isReady){
			// 		proxy.addEventListener(EventX.COMPLETE,preModelCompleteHandle);
			// 		proxy.load();
			// 	}else{
			// 		CallLater.add(mediatorReadyHandle);
			// 	}
			// }else{
			// 	CallLater.add(mediatorReadyHandle);
			// }
		}
		
		/**
		 * viewcomplete操作; 
		 * @param event
		 * 
		 */		
		viewCompleteHandler(event:Event):void{
			
		}
		
		preModelCompleteHandle(event:EventX):void
		{
			// var proxy:IAsyncProxy=event.target as IAsyncProxy;
			// proxy.removeEventListener(EventX.COMPLETE,preModelCompleteHandle);
			// mediatorReadyHandle();
		}
		
		/**
		 * 当视图及基本数据都完成时
		 * 
		 * 为什么这个要这么写
		 * 可以对complete事件更自由的押后操作(也不必写preHandle与postHandle);
		 * @param event
		 * 
		 */		
		mediatorReadyHandle():void{
			this._ready=true;
			
			if(this.viewComponent.stage){
				// facade.registerEvent(this);
				this.awaken();
			}
			
			// if(_readyExecutes){
			// 	for each(var handle:Function in _readyExecutes.getCloneList()){
			// 		handle.apply(null,_readyExecutes.get(handle));
			// 	}
			// 	_readyExecutes.clear();
			// 	_readyExecutes=null;
			// }
			
			// facade.simpleDispatch(COMPLETE,name);
		}
		
		
		/**
		 * true  有stage
		 * false 无stage 
		 */		
		stage_state:Boolean;
		
		awkenCheckIndex:number;
		
		
		/**
		 * 可供重写事件的type转为addStage与removeStage; 
		 * @param type
		 * 
		 */
	    awkenSleepCheck(type:String):void{
			// switch(type){
			// 	case Event.ADDED_TO_STAGE:
			// 		if(awkenCheckIndex){
			// 			clearTimeout(awkenCheckIndex);
			// 		}
			// 		if(false == stage_state){
			// 			doAwaken();
			// 		}
			// 		break;
			// 	case Event.REMOVED_FROM_STAGE:
			// 		if(awkenCheckIndex){
			// 			clearTimeout(awkenCheckIndex);
			// 		}
			// 		awkenCheckIndex = setTimeout(doSleep,100);
			// 		break;
			// }
		}
		
		
		/**
		 * 
		 */		
		doAwaken():void{
			this.stage_state = true;
			// facade.registerEvent(this);
			// if(isCanAwaken && isReady){
			// 	awaken();
			// }
		}
		
		/**
		 * 
		 */		
		doSleep():void{
			this.stage_state = false;
			// facade.removeEvent(this);
			// if(isReady){
			// 	sleep();
			// }
		}
		
		
		execute(type:String,...args):void{
			
			// if(isReady==false){
			// 	args.splice(0,0,execute,type);
			// 	addReadyExecute.apply(null,args);
			// 	return;
			// }
			// if(type in this){
			// 	var func:Function=this[type] as Function;
			// 	if(func !=null){
			// 		func.apply(null,args);
			// 	}
			// }
			
		}
		
		/**
		 * isReady不作触发性的操作,只用于方法调用的判断(如不去做一些加载操作,像sleep时,它不用像isCanAwaken,去做一些未加载成功的重新启动操作)
		 * @return 
		 * 
		 */		
		get isReady():Boolean
		{
			return this._ready;
		}
		
		/**
		 * 检查mediator ready 是否完成,并让它回调方法 
		 * @param handle
		 * @param args
		 * 
		 */		
		addReadyExecute(handle:Function,...args):void{
			if(this._ready){
				handle.apply(null,args);
				return;
			}else{
				this.startSync();
			}
			
			// if(!_readyExecutes)_readyExecutes=new ArraySet(false);
			// _readyExecutes.set(handle,args);
		}
		
		/**清除Executes*/
		removeReadyExecute():void
		{
			// if(_readyExecutes){
			// 	_readyExecutes.clear();
			// 	_readyExecutes=null;
			// }
		}
    }


}