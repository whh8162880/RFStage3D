module rf{
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