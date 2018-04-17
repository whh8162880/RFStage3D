module rf{
    export interface IName{
        getName():string;
    }

    //var facade
    //facade 注册记录保存所有Model class 等信息
    export interface IFacade{
        registerProxy(proxy:IProxy):void;
        getProxy(clz:IProxy,autoCreate:boolean):IProxy;
        removeProxy(clz:IProxy):IProxy;
        toggleMediator(nameOrClass:any,type:number):any;
        executeMediator(nameOrClass:any,funcType:string,...args):any
    }

    export class Facade implements IFacade{

        SINGLETON_MSG:string = "Facade Singleton already constructed!";
        model: IModel;
		view: IView;

        constructor(){
            Facade.ins = this;
            
            this.initialize();
        }

        static ins : IFacade; 
        static getInstance():IFacade{
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
        
        /**
		 * 注册一个proxy别名(不建议直接使用); 
		 * @param proxyName
		 * @param proxy
		 * 
		 */		
		registerProxyAlias(proxyName:string,proxy:IProxy):void{
			this.model.registerProxyAlias(proxyName,proxy);
		}
		
        registerProxy( proxy:IProxy ):void{
            this.model.registerProxy (proxy);	
			this.view.registerEvent(proxy);
        }

        getProxy(clz:IProxy,autoCreate:boolean= true):IProxy{

            let proxyName = clz.getName();
            let proxy = this.model.getProxy(proxyName);
            if(proxy == null && autoCreate == true)
            {
                proxy = singleton(clz as any);
				this.registerProxy(proxy);
            }
            return proxy;
        }
        
        removeProxy(clz:IProxy):IProxy{
            
            let proxyName = clz.getName();

            let proxy =  this.model.removeProxy(proxyName);
            if(proxy)
            {
                this.view.registerEvent(clz);
            }
         
            return proxy;
        }

        hasProxy(clz:IProxy):IProxy
        {  
            let proxyName = clz.getName();
            return this.model.getProxy(proxyName);
        }


	    /**
		 * 注册一个mediator别名(不建议直接使用); 
		 * @param mediatorName
		 * @param mediator
		 * 
		 */		
		registerMediatorAlias(mediatorName:string,mediator:IMediator):void{
			this.view.registerMediatorAlias(mediatorName,mediator);
        }
        

        registerMediator( mediator:IMediator ):void {
			this.view.registerMediator( mediator );
        }
        

        getMediator(clz:IMediator):IMediator{
            let mediatorName = clz.getName();
            let mediator = this.view.getMediator(mediatorName);
            if(mediator == null)
            {
                mediator = singleton(clz as any);
				this.registerMediator(mediator as any);
            }
            return mediator;
        }

        removeMediator(clz:IMediator):IMediator{
            let mediatorName = clz.getName();
            let mediator = this.view.removeMediator(mediatorName);
            return mediator;
        }

        hasMediator(clz:IMediator):boolean{
            let mediatorName = clz.getName();
            return this.view.hasMediator(mediatorName);
        }

        toggleMediator(clz:IMediator,type:number = -1):IMediator{
            let mediatorName = clz.getName();
			// if(_shieldMediators[mediatorName])
			// {
			// 	simpleDispatch(NOTICE_WARNING ,_shieldMediators[mediatorName]+"功能暂不提供开放！");
			// 	return;
            // }
            let mediator = this.getMediator(clz);
            if(!mediator)
            {
                console.log(mediatorName + ":不存在");
                return null;
            }

            let panel = <TPanel>mediator.getPanel();
            // let async = <AsyncMediator>mediator ;
            //加载
            // if(!async.isReady && !type)
            // {
            //     async.removeReadyExecute();
            //     return;
            // }

            // if(!async.isReady &&  async.startSync())
            // {
            //     async.addReadyExecute(this.toggleMediator,mediator,type);
            //     return mediator;
            // }
            
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
    export interface IView {
/**
		 * 注册一个视图中介; 
		 * @param mediator
		 * 
		 */		
		registerMediator( mediator:IMediator ) : void;
		
		/**
		 * 注册一个别名; 
		 * @param name
		 * @param mediator
		 * 
		 */		
		registerMediatorAlias( name:string , mediator:IMediator ):void;
		
		/**
		 * 取得 一个视图中介; 
		 * @param mediatorName
		 * @return 
		 * 
		 */		
		getMediator( mediatorName:string ) : IMediator;
		
		/**
		 * 删除一个视图中介;  
		 * @param mediatorName
		 * @return 
		 * 
		 */		
		removeMediator( mediatorName:string ) : IMediator;
		
		/**
		 * 是否存在相应的视图中介;  
		 * @param mediatorName
		 * @return 
		 * 
		 */		
		hasMediator( mediatorName:string ) : boolean;
		
		/**
		 * 
		 * @param mediator
		 * 
		 */		
		registerEvent(eventInterester:IProxy):void;
		
		/**
		 * 
		 * @param mediator
		 * 
		 */		
		removeEvent(eventInterester:IProxy):void;
		
		/**
		 * 清理它管理的所有内容; 
		 * 
		 */		
		clear():void;
    }

    export class View extends MiniDispatcher implements IView{
        SINGLETON_MSG	: string = "View Singleton already constructed!";
        mediatorMap :object;
        constructor(){
            super();
            if(View.ins != null)throw Error(this.SINGLETON_MSG);
            View.ins = this;
			this.mediatorMap = {};	
			this.initializeView();	
        }

        static ins:IView;
        static getInstance():IView{
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
		registerMediator( mediator:IMediator ) : void
		{
            let name:string = mediator.getName();
            let mediatorMap = this.mediatorMap;

			if ( mediatorMap[ name ] != null ) {
				throw new Error("重复定义:"+name);
			}
			mediatorMap[ name ] = mediator;
			mediator.onRegister();
		}
		
		registerMediatorAlias( name:string , mediator:IMediator ):void{
            let mediatorMap = this.mediatorMap;

			if(!mediator){
				mediatorMap[ name ]=null;
				delete mediatorMap[ name ];
				return;
			}
			mediatorMap[ name ] = mediator;
		}
        
    
		registerEvent(eventInterester:IProxy):void{
		// 	var interests:Dictionary = eventInterester.eventInterests;
		// 	var handle:Function;
		// 	for(var eventType:String in interests){
		// 		handle=interests[eventType];
		// 		if(handle==null){
		// 			handle=eventInterester.handle;
		// 		}
		// 		this.addEventListener(eventType,handle);
		// 	}
		}
		
		removeEvent(eventInterester:IProxy):void{
		// 	var interests:Dictionary = eventInterester.eventInterests;
		// 	var handle:Function;
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
		getMediator( mediatorName:string ) : IMediator
		{
			return this.mediatorMap[ mediatorName ];
		}
		
		/**
		 * 删除视图中介 
		 * @param mediatorName
		 * @return 
		 * 
		 */		
		removeMediator( mediatorName:string ) : IMediator
		{
            let mediatorMap = this.mediatorMap;
			var mediator:IMediator = mediatorMap[ mediatorName ] as IMediator;
			
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
    export interface IModel{
        /**
		 * 注册数据代理; 
		 * @param proxy
		 * 
		 */		
		registerProxy( proxy:IProxy ) : void;
		
		/**
		 * 注册一个别名; 
		 * @param name
		 * @param proxy
		 * 
		 */
		registerProxyAlias(proxyName:string,proxy:IProxy):void;
		
		/**
		 * 取得数据代理;
		 * @param proxyName
		 * @return 
		 * 
		 */		
		getProxy( proxyName:string ) : IProxy;
		
		
		/**
		 * 删除数据代理; 
		 * @param proxyName
		 * @return 
		 * 
		 */		
		removeProxy( proxyName:string ) : IProxy;
		
		
		/**
		 * 取得所有代理定义 
		 * @return 
		 * 
		 */		
		getAllPorxy():{ [key: string]: IProxy; };
		
		/**
		 * 是否存在相应的数据代理; 
		 * @param proxyName
		 * @return 
		 * 
		 */		
		hasProxy( proxyName:string ) : Boolean;
    }

    export class Model implements IModel{
        SINGLETON_MSG	: string = "Model Singleton already constructed!";
        proxyMap :object;

        constructor(){
            if(Model.ins != null)throw Error(this.SINGLETON_MSG);
            Model.ins = this;
			this.proxyMap = {};	
			this.initializeModel();	
        }

        static ins:IModel;
        static getInstance():IModel{
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

        registerProxy( proxy:IProxy ) : void{
            let proxyName:string=proxy.getName();
            if(this.proxyMap[proxyName] != null){
                throw new Error("重复定义:"+proxyName);
            }
				
			this.proxyMap[ proxyName ] = proxy;
			proxy.onRegister();
        }

        registerProxyAlias(proxyName:string,proxy:IProxy):void{
            let proxyMap = this.proxyMap;
            if(!proxy){
				proxyMap[ proxyName ]=null;
				delete proxyMap[ proxyName ];
				return;
			}
			proxyMap[ proxyName ] = proxy;
        }

        getProxy( proxyName:string ) : IProxy{
            return this.proxyMap[ proxyName ];
        }

        removeProxy( proxyName:string ) : IProxy{
            let proxyMap = this.proxyMap;
            var proxy:IProxy = proxyMap [ proxyName ] as IProxy;
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