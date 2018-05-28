///<reference path="../../youbt/mvc/MVC.ts" />
module rf{

    export class TestMediator extends Mediator{
        constructor(){
            super("TestMediator");
            this.setPanel(new TestPanel("test","ui.asyncpanel.testbg"));
        }
    }

    export class TestPanel extends Panel{

    }

}