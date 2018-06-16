///<reference path="../../../com/youbt/components/MVC.ts" />
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
            let{bar_bar,area}=panel;
            let scroll = area.setScrollRect(100,100);
            scroll.hStep = 0;
            bar_bar.setSize(bar_bar.w,200);
            bar_bar.bindScroll(scroll);

            super.mediatorReadyHandle()

            //after event
        }
    }
}