///<reference path="../../youbt/mvc/MVC.ts" />
module rf{
	export class CreatePanel extends Panel{
	   private panel:CreatePanel & IMODULE_CREATE;
	   
       constructor(uri: string, cls: string)
        {
            super(uri,cls);
        }
        
        bindComponents(){
            this.panel = this as CreatePanel & IMODULE_CREATE;
            
        }
    }
    
	export class CreateMediator extends Mediator{
        $panel:CreatePanel & IMODULE_CREATE = null;
        
        info:InfoDele;

        constructor(){
            super("CreateMediator");
            this.setPanel(new CreatePanel("create","ui.asyncpanel.create"));

            this.$panel = this.$panel as CreatePanel & IMODULE_CREATE;
        }
        
        mediatorReadyHandle(): void {
            
            //event

            super.mediatorReadyHandle()

            //after event
            this.info = new InfoDele(this.$panel.dele_info);
        }
    }
}