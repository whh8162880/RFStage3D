module rf{
    export interface IProxy extends IName{
        /**
		 * 当被注册到应用中时触发; 
		 * 
		 */		
		onRegister( ):void;
		
		/**
		 * 当从应用中删除时触发; 
		 * 
		 */		
        onRemove( ):void;
        
    }

    export class BaseMode extends MiniDispatcher implements IProxy{
        /**
		 * 所有的model列表 
		 */		
        static modelObj:object = {};
        

        modelName:string;
        proxyName:string;
        
        facade:IFacade = Facade.getInstance();
        constructor(proxyName:string,modelName:string){
            super();

            this.proxyName = proxyName;
            this.modelName = modelName;
            //注册
            BaseMode.modelObj[modelName] = this;
        }

		refreshRuntimeData(type:string,data:any):void{
			
		}

        initRuntime():void{

        }

        onRegister( ):void{

        }

        onRemove():void{

        }

        getName():string{
            return this.proxyName;
        }


    }
}