///<reference path="../../youbt/mvc/MVC.ts" />
module rf{
	export class TestPanel extends Panel{
	   private panel:TestPanel & IMODULE_TEST;
	   
       constructor(uri: string, cls: string)
        {
            super(uri,cls);
        }
        
        bindComponents(){
            this.panel = this as TestPanel & IMODULE_TEST;
            
        }
    }
    
	export class TestMediator extends Mediator{
		$panel:TestPanel & IMODULE_TEST;
        constructor(){
            super("TestMediator");
            this.setPanel(new TestPanel("test","ui.asyncpanel.test"));
        }
        
        mediatorReadyHandle(): void {

            //event

            super.mediatorReadyHandle()

            //after event
        }
    }
}