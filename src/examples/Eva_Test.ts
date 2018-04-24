module rf{
    export class Eva_Text{
        constructor(){
            window.onkeyup = this.onKeyDownHandle;
    }

    onKeyDownHandle(e:KeyboardEvent):void{
        // console.log(e.type);
        switch(e.code){
            case "KeyA":
               let m = singleton(TestMediator);
                facade.toggleMediator(m);
            break;

        }
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