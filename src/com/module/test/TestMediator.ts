///<reference path="../../youbt/mvc/MVC.ts" />
module rf{
	export class TestPanel extends Panel{
        constructor(uri: string, cls: string)
        {
            super(uri,cls);
        }
        
        bindComponents(){
            let panel = this as TestPanel & IMODULE_TEST;
            // this.scrollRect = new Rect(0,0,100,50);
            // this.setPos(100,100);
            // new Scroll(this);
        }
    }
    
	export class TestMediator extends Mediator{
		$panel:TestPanel & IMODULE_TEST;
        constructor(){
            super("TestMediator");
            this.setPanel(new TestPanel("test","ui.asyncpanel.test"));
            
            this.$panel = this.$panel as TestPanel & IMODULE_TEST;
        }
        
        mediatorReadyHandle(): void {

            //event

            super.mediatorReadyHandle()

            //after event
        }
    }
}