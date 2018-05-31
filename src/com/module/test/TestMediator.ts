///<reference path="../../youbt/mvc/MVC.ts" />
module rf{

    export class TestMediator extends Mediator{
        constructor(){
            super("TestMediator");
            this.setPanel(new TestPanel("lib","ui.asyncpanel.test"));
        }
    }

    export class TestPanel extends Panel implements IModule_test{
       
    }

}