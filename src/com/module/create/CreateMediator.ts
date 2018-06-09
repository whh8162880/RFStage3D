///<reference path="../../youbt/components/MVC.ts" />
module rf{
	export class CreatePanel extends Panel{
		
        bindComponents(){
           // let panel = this as CreatePanel & IMODULE_CREATE;
        }
        
        
    }
    
	export class CreateMediator extends Mediator{
		$panel:CreatePanel & IMODULE_CREATE;
        constructor(){
            super("create");
            this.setPanel(new CreatePanel("create","ui.asyncpanel.create"));
            
        }
        
        mediatorReadyHandle(): void {
			let{$panel:panel} = this;
            //event

            super.mediatorReadyHandle()

            //after event
        }
    }
}