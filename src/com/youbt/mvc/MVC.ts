module rf{
    //var facade
    //facade 注册记录保存所有Model class 等信息

    export class Facade extends MiniDispatcher{

        SINGLETON_MSG:string = "Facade Singleton already constructed!";
        model: Model;
		view: View;

        constructor(){
            super();
            Facade.ins = this;
            
            this.initialize();
        }

        static ins : Facade; 
        static getInstance():Facade{
            let ins = this.ins;
            if(ins == null){
                ins = new Facade();
                this.ins = ins;
            }

            return ins;

        }

        initialize():void{
            this.initializeModel();
			this.initializeView();
        }

        initializeModel():void
        {
            if ( this.model != null ) return;
			this.model = Model.getInstance();
        }

        initializeView():void
        {
            if ( this.view != null ) return;
			this.view = View.getInstance();
        }

        registerClass<T>(clazz: { new(): T;}):void{
            singleton(clazz);
        }
        
        registerProxy( proxy:BaseMode ):void{
            this.model.registerProxy (proxy);	
			this.view.registerEvent(proxy);
        }

        getProxy(clz:BaseMode,autoCreate:boolean= true):BaseMode{

            let proxyName = clz.getName();
            let proxy = this.model.getProxy(proxyName);
            if(proxy == null && autoCreate == true)
            {
                proxy = singleton(clz as any);
				this.registerProxy(proxy);
            }
            return proxy;
        }
        
        removeProxy(clz:BaseMode):BaseMode{
            
            let proxyName = clz.getName();

            let proxy =  this.model.removeProxy(proxyName);
            if(proxy)
            {
                this.view.registerEvent(clz);
            }
         
            return proxy;
        }

        hasProxy(clz:BaseMode):BaseMode
        {  
            let proxyName = clz.getName();
            return this.model.getProxy(proxyName);
        }

        registerMediator( mediator:Mediator ):void {
			this.view.registerMediator( mediator );
        }

        getMediator(clz:Mediator):Mediator{
            let mediatorName = clz.getName();
            let mediator = this.view.getMediator(mediatorName);
            if(mediator == null)
            {
                mediator = singleton(clz as any);
				this.registerMediator(mediator as any);
            }
            return mediator;
        }

        removeMediator(clz:Mediator):Mediator{
            let mediatorName = clz.getName();
            let mediator = this.view.removeMediator(mediatorName);
            return mediator;
        }

        hasMediator(clz:Mediator):boolean{
            let mediatorName = clz.getName();
            return this.view.hasMediator(mediatorName);
        }

        toggleMediator(clz:Mediator,type:number = -1):Mediator{
            let mediator = this.getMediator(clz);
            if(!mediator)
            {
                let mediatorName = clz.getName();
                console.log(mediatorName + ":不存在");
                return null;
            }

            let panel = mediator.getPanel();
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


        executeMediator(nameOrClass:any,funcType:string,...args):any
        {
            return null
        }
    }

    
    //view
    export class View extends MiniDispatcher{
        SINGLETON_MSG	: string = "View Singleton already constructed!";
        mediatorMap :object;
        constructor(){
            super();
            if(View.ins != null)throw Error(this.SINGLETON_MSG);
            View.ins = this;
			this.mediatorMap = {};	
			this.initializeView();	
        }

        static ins:View;
        static getInstance():View{
            let ins = this.ins
            if(ins == null){
                ins = new View();
                this.ins = ins;
            }
            return ins;
        }


        initializeView(  ) : void 
		{
		}
		
		
		/**
		 * 注册视图中介(中介主要为视图控制器) 
		 * @param mediator
		 * 
		 */		
		registerMediator( mediator:Mediator ) : void
		{
            let name:string = mediator.getName();
            let mediatorMap = this.mediatorMap;

			if ( mediatorMap[ name ] != null ) {
				throw new Error("重复定义:"+name);
			}
			mediatorMap[ name ] = mediator;
			mediator.onRegister();
		}
		
		registerMediatorAlias( name:string , mediator:Mediator ):void{
            let mediatorMap = this.mediatorMap;

			if(!mediator){
				mediatorMap[ name ]=null;
				delete mediatorMap[ name ];
				return;
			}
			mediatorMap[ name ] = mediator;
		}
        
    
		registerEvent(eventInterester:MiniDispatcher):void{
			let interests:object = eventInterester.mEventListeners;
			let handle:Function;
			for(let eventType in interests){
				handle=interests[eventType];
				if(handle==null){
					// handle=eventInterester.handle;
				}
				// this.addEventListener(eventType,handle);
			}
		}
		
		removeEvent(eventInterester:MiniDispatcher):void{
		// 	let interests:Dictionary = eventInterester.eventInterests;
		// 	let handle:Function;
		// 	for (var eventType:string in interests){
		// 		handle=interests[eventType];
		// 		if(handle==null){
		// 			handle=eventInterester.handle;
		// 		}
		// 		this.removeEventListener(eventType,handle);
		// 	}
		}
		
		
		/**
		 * 取得视图中介 
		 * @param mediatorName
		 * @return 
		 * 
		 */		
		getMediator( mediatorName:string ) : Mediator
		{
			return this.mediatorMap[ mediatorName ];
		}
		
		/**
		 * 删除视图中介 
		 * @param mediatorName
		 * @return 
		 * 
		 */		
		removeMediator( mediatorName:string ) : Mediator
		{
            let mediatorMap = this.mediatorMap;
			var mediator:Mediator = mediatorMap[ mediatorName ] as Mediator;
			
			if ( mediator ) 
			{
				mediatorMap[ mediatorName ]=null;
				delete mediatorMap[ mediatorName ];
				mediator.onRemove();
			}
			
			return mediator;
		}
		
		hasMediator( mediatorName:string ) : boolean
		{
			return this.mediatorMap[ mediatorName ] != null;
		}
		
		clear():void{
            let mediatorMap = this.mediatorMap;
            for(let mediatorName in mediatorMap)
            {
                this.removeMediator(mediatorName);
            }
            // this._clear();
		}

    }


    //model
    /**
     * 数据代理注册管理器
     * 项目中所有的proxy代理都被此类管理着;
     * 
     */
    export class Model{
        SINGLETON_MSG	: string = "Model Singleton already constructed!";
        proxyMap :object;

        constructor(){
            if(Model.ins != null)throw Error(this.SINGLETON_MSG);
            Model.ins = this;
			this.proxyMap = {};	
			this.initializeModel();	
        }

        static ins:Model;
        static getInstance():Model{
            let ins = this.ins
            if(ins == null){
                ins = new Model();
                this.ins = ins;
            }
            return ins;
        }

        initializeModel():void
        {

        }

        registerProxy( proxy:BaseMode ) : void{
            let proxyName:string=proxy.getName();
            if(this.proxyMap[proxyName] != null){
                throw new Error("重复定义:"+proxyName);
            }
				
			this.proxyMap[ proxyName ] = proxy;
			proxy.onRegister();
        }

        registerProxyAlias(proxyName:string,proxy:BaseMode):void{
            let proxyMap = this.proxyMap;
            if(!proxy){
				proxyMap[ proxyName ]=null;
				delete proxyMap[ proxyName ];
				return;
			}
			proxyMap[ proxyName ] = proxy;
        }

        getProxy( proxyName:string ) : BaseMode{
            return this.proxyMap[ proxyName ];
        }

        removeProxy( proxyName:string ) : BaseMode{
            let proxyMap = this.proxyMap;
            var proxy:BaseMode = proxyMap [ proxyName ] as BaseMode;
			if ( proxy ) 
			{
				proxyMap[ proxyName ] = null;
				proxy.onRemove();
			}
			return proxy;
        }

        getAllPorxy():any{
            return this.proxyMap;
        }

        hasProxy( proxyName:string ) : Boolean{
            return this.proxyMap[ proxyName ] != null;
        }

    }
}