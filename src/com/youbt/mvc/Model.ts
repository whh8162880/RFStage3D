module rf{
    export class BaseMode extends MiniDispatcher{
        /**
		 * 所有的model列表 
		 */		
        static modelObj:object = {};
        

        modelName:string;
        proxyName:string;
        
        facade:Facade = Facade.getInstance();
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