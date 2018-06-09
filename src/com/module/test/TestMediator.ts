///<reference path="../../youbt/components/MVC.ts" />
module rf{
	export class TestPanel extends Panel{
		
        bindComponents(){
           // let panel = this as TestPanel & IMODULE_TEST;
        }
        
        
    }
    
	export class TestMediator extends Mediator{
		$panel:TestPanel & IMODULE_TEST;
        constructor(){
            super("test");
            this.setPanel(new TestPanel("test","ui.asyncpanel.test"));
            
        }
        
        mediatorReadyHandle(): void {
			let{$panel:panel} = this;
            //event
            let{bar_bar}=panel;

            bar_bar.setSize(bar_bar.w,200);

            super.mediatorReadyHandle()

            //after event
        }
    }
}