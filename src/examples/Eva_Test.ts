module rf{
    export class Eva_Text{
        constructor(){
            // window.onkeyup = this.onKeyDownHandle;
            mainKey.regKeyDown(Keybord.A,this.onKeyDownHandle,this)
    }

    onKeyDownHandle(e:KeyboardEvent):void{
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

        
        key:KeyManagerV2
        awaken():void{
            this.key = new KeyManagerV2(this.skin);
            this.key.regKeyDown(Keybord.B,this.onKeyHandle,this);
            this.key.awaken();
        }

        onKeyHandle(e:KeyboardEvent):void{
            console.log("key_down_"+e.keyCode);
        }

        sleep():void{
            this.key.sleep();

            console.log("key_sleep");
        }

    }

    export class TestModel extends BaseModel{
        constructor(){
            super("Test");
        }
    }
}