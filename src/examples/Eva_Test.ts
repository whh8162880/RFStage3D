module rf{
    export class Eva_Text{
        constructor(){
            let m = singleton(TestMediator);
            facade.toggleMediator(m);
        }

        
    }


    export class TestMediator extends Mediator{
        $panel:TestPanel
        constructor(){
            super("TestMediator");
            this.setPanel(new TestPanel());
        }
        mediatorReadyHandle():void{
            super.mediatorReadyHandle();
        }

        awaken():void{
            console.log("mediator awaken")
        }

    }


    export class TestPanel extends TPanel{
        constructor(){
            super("create","ui.asyncpanel.create");
        }
    }

    export class TestModel extends BaseMode{
        constructor(){
            super("Test");
        }
    }
}